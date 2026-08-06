import './index.css'
import { lazy, Suspense, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SlideViewer from './pages/SlideViewer'
import PresenterNotes from './pages/PresenterNotes'
import LabPage from './pages/LabPage'
import AssignmentPage from './pages/AssignmentPage'
import DemoPage from './pages/DemoPage'
import SetupPage from './pages/SetupPage'
import QuizJoin from './pages/quiz/QuizJoin'
import QuizRoom from './pages/quiz/QuizRoom'
import PresenterPicker from './pages/quiz/PresenterPicker'
import PresenterConsole from './pages/quiz/PresenterConsole'

// Phase 2 transport harness. `import.meta.env.DEV` is a compile-time constant, so
// in a production build this whole branch is dead code and the chunk is never
// emitted — the harness exists only on the dev server.
const TransportHarness = import.meta.env.DEV
  ? lazy(() => import('./pages/quiz/TransportHarness'))
  : null

// Manage scroll on navigation:
//  - with a hash (e.g. /#workshops), scroll to that section — works even when
//    coming from a sub-route like /labs/:id, where the section isn't on the page yet
//  - otherwise, reset to the top on route change
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useLayoutEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      // The target section may still be mounting after a cross-page nav — retry briefly.
      let tries = 0
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (tries++ < 10) {
          requestAnimationFrame(tryScroll)
        }
      }
      requestAnimationFrame(tryScroll)
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

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
      <ScrollManager />
      <Routes>
        {/* Full-screen pages — no navbar */}
        <Route path="/week/:weekNum" element={<SlideViewer />} />
        {/* Presenter notes for the whole week — meant for a second window/screen */}
        <Route path="/week/:weekNum/notes" element={<PresenterNotes />} />

        {/* Live quiz — reachable by URL/QR only, never linked from site nav (spec §4) */}
        <Route path="/quiz" element={<QuizJoin />} />
        <Route path="/quiz/room/:code" element={<QuizRoom />} />
        <Route path="/quiz/present" element={<PresenterPicker />} />
        <Route path="/quiz/present/:quizId" element={<PresenterConsole />} />
        {TransportHarness ? (
          <Route
            path="/quiz/dev-transport"
            element={
              <Suspense fallback={null}>
                <TransportHarness />
              </Suspense>
            }
          />
        ) : null}

        {/* Content pages with navbar */}
        <Route path="/" element={<WithNav><Home /></WithNav>} />
        <Route path="/labs/:labId" element={<WithNav><LabPage /></WithNav>} />
        <Route path="/assignment/:weekNum" element={<WithNav><AssignmentPage /></WithNav>} />
        <Route path="/demo/:demoId" element={<WithNav><DemoPage /></WithNav>} />
        <Route path="/setup" element={<WithNav><SetupPage /></WithNav>} />

        {/* Unknown paths (incl. GitHub Pages 404 fallback) → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
