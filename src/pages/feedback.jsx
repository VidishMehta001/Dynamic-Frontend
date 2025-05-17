import { useState } from 'react'
import {useParams} from 'react-router-dom'
import {useEffect} from 'react'
import posthog from 'posthog-js'
import {motion} from 'framer-motion'
import { supabase } from '../supabaseClient'

const PERSON_ID = import.meta.env.VITE_POSTHOG_PERSON_ID

export default function Feedback() {
    const [variantHTML, setVariantHTML] = useState(null)
    const {courseId} = useParams()
    const [clarity, setClarity] = useState(3)
    const [engagement, setEngagement] = useState(3)
    const [submitted, setSubmitted] = useState(false)
    const [comments, setComments] = useState('')

    //console.log('PERSON_ID:', PERSON_ID)

    useEffect(() => {
      async function fetchVariant() {
        const { data, error } = await supabase
          .from('UI_Variant')
          .select('Suggestions, variant_count')
          .eq('Person_id', PERSON_ID)
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Supabase fetch error:', error)
          return
        }
    
        console.log('Supabase variant fetch:', data)
    
        if (data && data.length > 0) {
          const { Suggestions, variant_count } = data[0]
          const cleanCode = extractCodeFromJSX(Suggestions)
          //console.log('Clean code:', cleanCode)
          setVariantHTML(cleanCode)
          const new_count = (variant_count || 0) + 1
          console.log(new_count)

          const {error: updateError} = await supabase
            .from('UI_Variant')
            .update({'variant_count': new_count})
            .eq('Person_id', PERSON_ID)

          if (updateError) {
            console.log("Failed to update the new count!")
          } 
          if (new_count >= 10) {
            // to run the LLM directly
            await fetch('/api/llm_trigger', {
                method: 'POST'
              })
            // localStorage.setItem(viewCountKey, 0)
        }

        } else {
          console.warn('No variant found for this person ID.')
        }

        // // Track view count in localStorage
        // const viewCountKey = `view_count_${PERSON_ID}`
        // const viewCount = parseInt(localStorage.getItem(viewCountKey) || '0', 10) + 1
        // localStorage.setItem(viewCountKey, viewCount)

      }
    
      fetchVariant()
    }, [])

    const extractCodeFromJSX = (jsx) => {
        // Remove <code> and triple backtick wrappers if present
        let cleaned = jsx.trim()
        // Remove triple backticks
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/```[a-z]*\n?/gi, '').replace(/```$/, '')
        }
        // Remove <code> wrappers if present
        if (cleaned.startsWith('<code>') && cleaned.endsWith('</code>')) {
          cleaned = cleaned.replace('<code>', '').replace('</code>', '')
        }
        return cleaned.trim()
      }

      const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'clarity') setClarity(Number(value))
        if (name === 'engagement') setEngagement(Number(value))
        if (name === 'comments') setComments(value)
      }
    
      const handleSubmit = async () => {
        posthog.capture('feedback_submitted', {
            course: courseId,
            clarity,
            engagement,
            comments
        })
        setSubmitted(true)

        const { data, error } = await supabase
            .from('Feedback')
            .insert({
                Course: courseId,
                Clarity: clarity,
                Engagement: engagement,
                Comments: comments
            })
        
            if (error) {
                console.error('Error submitting feedback:', error)
            } else {
                console.log('Feedback submitted successfully:', data)
            }
        }

        if (submitted) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-green-50">
                <h2 className="text-2xl font-semibold text-green-700">✅ Thanks for your feedback!</h2>
            </div>
            )
        }
        
      return (
        <div className="min-h-screen bg-white p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Feedback Form</h1>
      
          {variantHTML ? (
            <div
              className="mt-4"
              onInput={handleInputChange}
              dangerouslySetInnerHTML={{ __html: variantHTML }}
            />
          ) : (
            <p className="text-gray-600 text-center">Loading feedback form variant…</p>
          )}
            <div className="flex justify-center mt-6">
            <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                Submit Feedback
            </button>
            </div>
        </div>
      )
    }

//     return (
//         <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-6 px-6" style={{backgroundColor: '#f0f0f0'}}>
//         <motion.div
//         initial={{ y: 0 }}
//         animate={{ y: [0, -10, 0] }}
//         transition={{ duration: 2, ease: 'easeOut' }}
//         className="text-5xl mb-4"
//         >
//         
//         </motion.div>
//         <motion.h2
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: 'easeOut' }}
//         className="text-3xl font-bold text-indigo-700 mb-6 capitalize"
//         >
//         Feedback for {courseId.replace('-', ' ')}
//         </motion.h2>
  
//         <div className="space-y-6 w-full max-w-md">
//           <div>
//             <label className="block text-lg font-medium text-gray-700 mb-2">Clarity (0–5):</label>
//             <input
//               type="range"
//               min="0"
//               max="5"
//               value={clarity}
//               onChange={(e) => setClarity(Number(e.target.value))}
//               className="w-full"
//             />
//             <p className="text-sm text-gray-500 mt-1">Your rating: {clarity}</p>
//           </div>
  
//           <div>
//             <label className="block text-lg font-medium text-gray-700 mb-2">Engagement (0–5):</label>
//             <input
//               type="range"
//               min="0"
//               max="5"
//               value={engagement}
//               onChange={(e) => setEngagement(Number(e.target.value))}
//               className="w-full"
//             />
//             <p className="text-sm text-gray-500 mt-1">Your rating: {engagement}</p>
//           </div>
        
//         <div>
//             <label className="block text-lg font-medium text-gray-700 mb-2">
//                 Additional Comments:
//             </label>
//             <textarea
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 rows="4"
//                 placeholder="What worked well? What can be improved?"
//                 className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//             />
//         </div>

//           <button
//             onClick={handleSubmit}
//             className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all"
//           >
//             Submit Feedback
//           </button>
//         </div>
//       </div>
//     )
//       // export default function Feedback() {
// }

// export default function Feedback() {
//     const {courseId} = useParams()
//     const [clarity, setClarity] = useState(3)
//     const [engagement, setEngagement] = useState(3)
//     const [submitted, setSubmitted] = useState(false)
//     const [comments, setComments] = useState('')

//     useEffect(() => {
//         posthog.capture('feedback_page_viewed', {course: courseId})
//     }, [courseId])

//     const handleSubmit = async () => {
//         posthog.capture('feedback_submitted', {
//             course: courseId,
//             clarity,
//             engagement,
//         })
//         setSubmitted(true)

//         const { data, error } = await supabase
//             .from('Feedback')
//             .insert({
//                 Course: courseId,
//                 Clarity: clarity,
//                 Engagement: engagement,
//             })
        
//             if (error) {
//                 console.error('Error submitting feedback:', error)
//             } else {
//                 console.log('Feedback submitted successfully:', data)
//             }
//         }

//     if (submitted) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-green-50">
//             <h2 className="text-2xl font-semibold text-green-700"> Thanks for your feedback!</h2>
//           </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-6 px-6" style={{backgroundColor: '#f0f0f0'}}>
//         <motion.div
//         initial={{ y: 0 }}
//         animate={{ y: [0, -10, 0] }}
//         transition={{ duration: 2, ease: 'easeOut' }}
//         className="text-5xl mb-4"
//         >
//         
//         </motion.div>
//         <motion.h2
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: 'easeOut' }}
//         className="text-3xl font-bold text-indigo-700 mb-6 capitalize"
//         >
//         Feedback for {courseId.replace('-', ' ')}
//         </motion.h2>
  
//         <div className="space-y-6 w-full max-w-md">
//           <div>
//             <label className="block text-lg font-medium text-gray-700 mb-2">Clarity (0–5):</label>
//             <input
//               type="range"
//               min="0"
//               max="5"
//               value={clarity}
//               onChange={(e) => setClarity(Number(e.target.value))}
//               className="w-full"
//             />
//             <p className="text-sm text-gray-500 mt-1">Your rating: {clarity}</p>
//           </div>
  
//           <div>
//             <label className="block text-lg font-medium text-gray-700 mb-2">Engagement (0–5):</label>
//             <input
//               type="range"
//               min="0"
//               max="5"
//               value={engagement}
//               onChange={(e) => setEngagement(Number(e.target.value))}
//               className="w-full"
//             />
//             <p className="text-sm text-gray-500 mt-1">Your rating: {engagement}</p>
//           </div>
        
//         <div>
//             <label className="block text-lg font-medium text-gray-700 mb-2">
//                 Additional Comments:
//             </label>
//             <textarea
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 rows="4"
//                 placeholder="What worked well? What can be improved?"
//                 className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//             />
//         </div>

//           <button
//             onClick={handleSubmit}
//             className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all"
//           >
//             Submit Feedback
//           </button>
//         </div>
//       </div>
//     )
    
// }
