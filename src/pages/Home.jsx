import { useNavigate } from 'react-router-dom'
import allCards from '../data/flashcards.json'
import allQuestions from '../data/quiz.json'
import allCases from '../data/casestudies.json'

export default function Home({ progressApi }) {
  const { progress, resetAll } = progressApi
  const navigate = useNavigate()

  const knownCards = Object.values(progress.flashcards).filter((v) => v === 'known').length
  const cardPct = allCards.length ? Math.round((knownCards / allCards.length) * 100) : 0

  const avgQuiz = progress.quiz.length
    ? Math.round(progress.quiz.reduce((s, r) => s + r.score / r.total, 0) / progress.quiz.length * 100)
    : null

  const completedCases = Object.values(progress.casestudies).filter((c) => c.completed).length

  const stats = [
    {
      label: 'Cards Mastered',
      value: `${cardPct}%`,
      sub: `${knownCards}/${allCards.length} cards`,
      color: 'bg-blue-50 text-[#1e3a5f]',
      accent: '#1e3a5f',
      to: '/flashcards',
      icon: '🃏',
      pct: cardPct,
    },
    {
      label: 'Quiz Average',
      value: avgQuiz !== null ? `${avgQuiz}%` : '—',
      sub: avgQuiz !== null ? `${progress.quiz.length} attempt${progress.quiz.length !== 1 ? 's' : ''}` : 'Not attempted',
      color: 'bg-amber-50 text-amber-800',
      accent: '#c9a227',
      to: '/quiz',
      icon: '📝',
      pct: avgQuiz ?? 0,
    },
    {
      label: 'Case Studies',
      value: `${completedCases}/${allCases.length}`,
      sub: completedCases === allCases.length ? 'All done!' : `${allCases.length - completedCases} remaining`,
      color: 'bg-green-50 text-green-800',
      accent: '#22c55e',
      to: '/cases',
      icon: '📚',
      pct: allCases.length ? Math.round((completedCases / allCases.length) * 100) : 0,
    },
  ]

  return (
    <div>
      {/* Hero header */}
      <div className="bg-[#1e3a5f] px-5 pt-12 pb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#f0c94d] mb-1">NPCC</p>
        <h1 className="text-2xl font-bold text-white leading-tight">Leadership &amp;</h1>
        <h1 className="text-2xl font-bold text-white leading-tight">Mentoring Skills</h1>
        <p className="text-blue-200 text-sm mt-2">Your interactive study companion</p>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Stat cards */}
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => navigate(s.to)}
            className="w-full bg-white rounded-2xl p-5 shadow-sm text-left flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-2xl flex-shrink-0`}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${s.pct}%`, backgroundColor: s.accent }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
            <span className="text-gray-300 text-lg flex-shrink-0">›</span>
          </button>
        ))}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Flash\nCards', to: '/flashcards', icon: '🃏', bg: 'bg-[#1e3a5f]' },
            { label: 'Take\nQuiz', to: '/quiz', icon: '📝', bg: 'bg-[#c9a227]' },
            { label: 'Case\nStudies', to: '/cases', icon: '📚', bg: 'bg-green-600' },
          ].map((a) => (
            <button
              key={a.to}
              onClick={() => navigate(a.to)}
              className={`${a.bg} rounded-2xl p-4 text-white text-center`}
            >
              <div className="text-2xl mb-1">{a.icon}</div>
              <p className="text-xs font-semibold leading-tight whitespace-pre-line">{a.label}</p>
            </button>
          ))}
        </div>

        {/* Reset */}
        <div className="pt-2 text-center">
          <button
            onClick={() => { if (window.confirm('Reset all progress?')) resetAll() }}
            className="text-xs text-gray-400 underline"
          >
            Reset all progress
          </button>
        </div>
      </div>
    </div>
  )
}
