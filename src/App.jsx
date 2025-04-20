import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Feedback from './pages/feedback'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback/:courseId" element={<Feedback />} />
      </Routes>
    </Router>
  )
}

export default App
