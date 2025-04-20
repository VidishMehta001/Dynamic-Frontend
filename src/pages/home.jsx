import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import posthog from 'posthog-js'

// export default function Home() {
//     return (
//       <div>
//         <h1>Hello from Home</h1>
//       </div>
//     )
//   }

const PERSON_ID = '01964b9e-5625-70cc-84dc-7909fee44b8d'

export default function Home() {
    const courses = ['Advanced Strategic Analysis', 'Financial Management', 
        'Corporate Finance', 'Mergers and Acquisitions', 
        'Behavioural Economics', 'Venture Capital',
        'Microeconomics', 'Macroeconomics', 'Accounting', 'SQL', 'Designing Data Products',
        'Marketing Management', 'Operations Management']
    
    const navigate = useNavigate()
    
    const selectCourse = (course) => {
        posthog.capture('course_selected', { course })
        navigate(`/feedback/${course.toLowerCase().replace(/\s+/g, '-')}`)
    }
    
    // useEffect(() => {
    //     const fetchUIChanges = async () => {
    //         const { data, error } = await supabase
    //         .from('UI_Variant')
    //         .select('Suggestions')
    //         .eq('Person_id', PERSON_ID)
    //         .limit(1)

    //     if (error) {
    //         console.error('Error fetching UI changes:', error.message)
    //         return
    //     }

    //     if (data && data.length > 0) {
    //         const html = extractCodeFromMarkdown(data[0].Suggestions)
    //         setVariantHTML(html)
    //     }
    // }

    // fetchUIChanges()
    // }, [])

    // const extractCodeFromMarkdown = (markdown) => {
    //     const match = markdown.match(/```html\s*([\s\S]*?)\s*```/m)
    //     return match ? match[1] : null
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex flex-col items-center p-8">
            <div className="w-full max-w-4xl">
            <header className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-indigo-800 tracking-tight mb-2 flex justify-center items-center gap-2">
                <span>🎓</span> <span>Cornell MBA Class Pulse</span>
                </h1>
                <p className="text-gray-600 text-lg" style={{marginTop: '50px'}}>
                <ul className="text-left list-disc pl-6 text-gray-700 space-y-2">
                <li className="mb-2">
                    Share feedback on your courses to help instructors improve learning experiences.
                </li>
                <li className="mb-2">
                    Please note that the feedback is anonymous.
                </li>
                <li className="mb-2">
                    If you have any questions, please contact me at <a href="mailto:vpm28@cornell.edu" className="text-indigo-700 hover:text-indigo-800">email</a>.
                </li>
                </ul>
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {courses.map((course) => (
                <button
                key={course}
                onClick={() => selectCourse(course)}
                className="bg-white hover:bg-indigo-50 text-indigo-700 font-medium px-6 py-4 rounded-xl shadow transition-all duration-200 border border-indigo-100 hover:scale-[1.02]"
                >
                {course}
                </button>
            ))}
            </div>
            </div>
        </div>
        )

    }

