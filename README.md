# 🧠 LLM Powered Dynamic Websites

This MVP demonstrates the use of Large Language Models (LLMs) to power fully dynamic, behavior-driven websites. At its core is a self-improving agent that learns users' preferences and regenerates UI layouts, designs and interaction models based on how users engage with the website. It leverages session tracking information and prompt-engineered LLM agents to constantly learn and evolve - a proof-of-concept for truly adaptive frontends focused on high user conversion and retention.

# 📈 MBA Class Pulse - A simple app for our prototype 

MBA Class Pulse is a simple lightweight application designed to help current and incoming MBA students make informed course selections based on feedback provided by the seniors. It features two pages - Course selection and Feedback form. In view of a simple demonstration, the dynamic UI changes are tagged to the feedback form. A quick snapshot of each of these pages is provided below for reference. 




Our goal is to perform mini A/B experimentations on UI that learns with each iteration of user sessions and interaction and recommends a UI that best fit each individaul preferences.  

# 📌 Mini Adaptive A/B Experimentation



# 🛠️ Tech Stack

- Frontend: React + Vite + Tailwind (inline CSS used for dynamic rendering compatibility)
- Backend Data Layer: Supabase (DB + auth)
- Tracking: PostHog (event & session replay)
- Agentic & Adaptive LLM: Built on OpenAI (GPT-4)
- Deployment: Vercel + GitHub

# 🔭 Future Work
- Plan to upgrade the UI, collaborate with student union & run experimentations on adaptive UI
- Render & perform mini A/B experimentation on artifacts based on user preference - for instance analyze individual user preferences between video and text content formats using PostHog session data and dynamically adjust the UI to surface more of the content type that leads to higher engagement or conversion.
- Create an administrator UI for monitoring hyper personalized UI for each unique user - compute & drive metrics at each individual user level leveraging agentic systems
- Explore gamification in UI/UX changes for driving user retention

# 🚀 Go Live!
- Deployed at [Link](https://dynamic-frontend-pysrry2xw-vidish-mehtas-projects.vercel.app/)
- Please note LLM functionality is diabled currently to save cost💰 but am happy to discuss if you found this project interesting. 

📬 Contact
- Built by [Vidish Mehta](mailto:vpm28@cornell.edu) as an exploration in adaptive, AI-driven UX design.
