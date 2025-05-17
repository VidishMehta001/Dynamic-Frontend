import {createClient} from '@supabase/supabase-js'
import { PostHog } from 'posthog-node'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

//console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
//console.log('POSTHOG_API_KEY:', process.env.POSTHOG_API_KEY) For troubleshooting

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
const openai = new OpenAI({
    apiKey: openaiApiKey
})
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_ANON_KEY
const openaiApiKey = process.env.OPENAI_API_KEY
const posthogHost = process.env.POSTHOG_HOST
const posthogProjectId = process.env.POSTHOG_PROJECT_ID
const posthogProjectApi = process.env.POSTHOG_PROJECT_API
const posthogPersonId = process.env.POSTHOG_PERSON_ID

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Get user session data from PostHog
    async function getPostHogSession() {
        const response = await fetch(`${posthogHost}/api/projects/${posthogProjectId}/session_recordings?person_uuid=${posthogPersonId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${posthogProjectApi}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch session data from PostHog')
        }

        const data = await response.json()
        return data.results.map(session => ({
            id: session.id,
            start_time: session.start_time,
            duration: session.recording_duration,
            start_url: session.start_url,
            click_count: session.click_count,
            mouse_activity_count: session.mouse_activity_count,
            console_log_count: session.console_log_count
        }))   
    }

    // 2. Turn it into promptable logs for the LLM
    function summarizeSession(session) {
        return session.map(s => `Session ID: ${s.id}\nStart Time: ${s.start_time}\nDuration: ${s.duration}s\nURL: ${s.start_url}\nClicks: ${s.click_count}\nMouse Movements: ${s.mouse_activity_count}\nConsole Logs: ${s.console_log_count}`).join('\n---\n')
    }

    // Feed user session data to the LLM and get suggestions for UI changes
    async function suggestUIChanges(sessionSummary) {
        const prompt = `
        You're a UX optimization agent tasked with maximizing feedback submission.

        Below is the current form structure (in React JSX using inline styles or Tailwind). Your goal is to suggest a new, **entire form layout**, using HTML with inline CSS that:
        - Encourages the user to complete the form
        - Uses creative widgets like sliders, emojis, cards, buttons, mood indicators, etc.
        - Presents a visually engaging layout
        - Can be rendered in a React app via dangerouslySetInnerHTML
        - Includes a visible Submit button

        Current form:
        <div>
        <label>Clarity (0to5):</label>
        <input type="range" min="0" max="5" />
        <label>Engagement (0 to 5):</label>
        <input type="range" min="0" max="5" />
        <label>Comments:</label>
        <textarea></textarea>
        </div>
        Do NOT include the Submit button. That will be rendered separately by the app.
        Return only a single valid HTML string. No explanations, no markdown formatting.
        ${sessionSummary}`
    
        const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: 'You only return inline CSS-compatible React JSX snippets.' },
            { role: 'user', content: prompt }
        ]
        })
    
        return response.choices[0].message.content.trim()
    }

    // Store the LLM suggestions in the database (Supabase - UI_Variant table)
    async function saveSuggestionToSupabase(suggestion) {
        const { error } = await supabase.from('UI_Variant').insert([
        {
            Person_id: posthogPersonId,
            Suggestions: suggestion,
            variant_count: 0
        },
        ])
    
        if (error) {
        console.error('Error saving suggestion:', error.message)
        } else {
        console.log('Suggestion saved successfully.')
        }
    }

    // Run the function
    try {
        const sessions = await getPostHogSession()
        const summary = summarizeSession(sessions)
        const html = await suggestUIChanges(summary)
        await saveSuggestionToSupabase(html)

        return res.status(200).json({ status: 'success', html })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'LLM pipeline failed.' })
    }
}