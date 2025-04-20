import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker'
import { PostHog } from 'posthog-node'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const posthogClient = new PostHog(process.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY, {
    host: process.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
})

const NUM_AGENTS = 20

const courses = ['Advanced Strategic Analysis', 'Financial Management', 
    'Corporate Finance', 'Mergers and Acquisitions', 
    'Behavioural Economics', 'Venture Capital',
    'Microeconomics', 'Macroeconomics', 'Accounting', 'SQL', 'Designing Data Products',
    'Marketing Management', 'Operations Management']

const generateFeedback = (agentId, course, group) => {
    const clarity = Math.floor(Math.random() * 6)
    const engagement = Math.floor(Math.random() * 6)
    const comments = faker.hacker.phrase()

    return {
    //agent_id: agentId,
    //group,
    Course: course,
    Clarity: clarity,
    Engagement: engagement,
    Comments: comments,
    //timestamp: new Date().toISOString()
    }
}

async function runAgents() {
    for (let i = 0; i < NUM_AGENTS; i++) {
        const agentId = `agent_${i+1}`
        const group = Math.random() < 0.5 ? 'Group 1' : 'Group 2'
        const course = courses[Math.floor(Math.random() * courses.length)]
        const feedback = generateFeedback(agentId, course, group)

        posthogClient.capture({
            distinctId: agentId,
            event: 'feedback_submitted',
            properties: {
                course: feedback.Course,
                clarity: feedback.Clarity,
                engagement: feedback.Engagement,
                comments: feedback.Comments,
                synthetic: true
            }
        })

        const { error } = await supabase.from('Feedback').insert([feedback])

        if (error) {
            console.error('Error inserting feedback:', error)
        } else {
            console.log(`Feedback inserted for ${agentId} in ${course}`)
        }
    }
}

runAgents()
