import Hero from '../components/Hero'
import LearningGoals from '../components/LearningGoals'
import WeeksSection from '../components/WeeksSection'
import LabsSection from '../components/LabsSection'
import AssignmentsSection from '../components/AssignmentsSection'
import Prerequisites from '../components/Prerequisites'
import FellowSection from '../components/FellowSection'
import SetupSection from '../components/SetupSection'
import Footer from '../components/Footer'
import { labsEnabled, assignmentsEnabled } from '../courseConfig'

export default function Home() {
  return (
    <>
      <Hero />
      <LearningGoals />
      <WeeksSection />
      {labsEnabled && <LabsSection />}
      {assignmentsEnabled && <AssignmentsSection />}
      <Prerequisites />
      <FellowSection />
      <SetupSection />
      <Footer />
    </>
  )
}
