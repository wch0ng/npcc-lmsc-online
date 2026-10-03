import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/layout/BottomNav'
import Home from './pages/Home'
import FlashCards from './pages/FlashCards'
import Quiz from './pages/Quiz'
import CaseStudies from './pages/CaseStudies'
import { useProgress } from './hooks/useProgress'

export default function App() {
  const progressApi = useProgress()

  return (
    <BrowserRouter basename="/npcc-lms">
      <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto">
        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={<Home progressApi={progressApi} />} />
            <Route path="/flashcards" element={<FlashCards progressApi={progressApi} />} />
            <Route path="/quiz" element={<Quiz progressApi={progressApi} />} />
            <Route path="/cases" element={<CaseStudies progressApi={progressApi} />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
