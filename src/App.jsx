import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Feedback from './pages/feedback'
// import OnboardingForm from './pages/onboarding'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback/:courseId" element={<Feedback />} />
        {/* <Route path="/onboarding" element={<OnboardingForm />} /> */}
      </Routes>
    </Router>
  )
}

export default App
