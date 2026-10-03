import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider } from './components/ProgressProvider'
import AppShell from './components/AppShell'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Module from './pages/Module'
import Practice from './pages/Practice'
import FlashCards from './pages/FlashCards'
import Quiz from './pages/Quiz'
import Scenarios from './pages/Scenarios'
import Scenario from './pages/Scenario'
import Activities from './pages/Activities'
import VakIntro from './pages/vak/VakIntro'
import VakRun from './pages/vak/VakRun'
import VakResult from './pages/vak/VakResult'
import CommIntro from './pages/comm/CommIntro'
import CommRun from './pages/comm/CommRun'
import CommResult from './pages/comm/CommResult'

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="learn" element={<Learn />} />
            <Route path="learn/:id" element={<Module />} />
            <Route path="practice" element={<Practice />} />
            <Route path="practice/flashcards" element={<FlashCards />} />
            <Route path="practice/quiz" element={<Quiz />} />
            <Route path="practice/scenarios" element={<Scenarios />} />
            <Route path="practice/scenarios/:id" element={<Scenario />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activities/vak" element={<VakIntro />} />
            <Route path="activities/vak/run" element={<VakRun />} />
            <Route path="activities/vak/result" element={<VakResult />} />
            <Route path="activities/comm-test" element={<CommIntro />} />
            <Route path="activities/comm-test/run" element={<CommRun />} />
            <Route path="activities/comm-test/result" element={<CommResult />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}
