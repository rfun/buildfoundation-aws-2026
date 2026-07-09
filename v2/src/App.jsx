import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SlideViewer from './pages/SlideViewer'
import LabPage from './pages/LabPage'
import AssignmentPage from './pages/AssignmentPage'
import SetupPage from './pages/SetupPage'

function WithNav({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Full-screen pages — no navbar */}
        <Route path="/week/:weekNum" element={<SlideViewer />} />

        {/* Content pages with navbar */}
        <Route path="/" element={<WithNav><Home /></WithNav>} />
        <Route path="/labs/:labId" element={<WithNav><LabPage /></WithNav>} />
        <Route path="/assignment/:weekNum" element={<WithNav><AssignmentPage /></WithNav>} />
        <Route path="/setup" element={<WithNav><SetupPage /></WithNav>} />
      </Routes>
    </BrowserRouter>
  )
}
