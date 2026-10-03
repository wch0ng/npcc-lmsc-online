import { Link } from 'react-router-dom'
import { Layers, ListChecks, Theater, ArrowRight } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { FLASHCARDS } from '../data/flashcards'
import { QUIZ } from '../data/quiz'
import { ALL_SCENARIOS } from '../data/scenarios'
import { Page, PageHeader, Bar } from '../components/ui'

export default function Practice() {
  const { progress } = useProgress()
  const known = FLASHCARDS.filter((c) => progress.flashcards[c.id] === 'known').length
  const best = progress.quiz.length ? Math.max(...progress.quiz.map((r) => Math.round((r.score / r.total) * 100))) : 0
  const scen = ALL_SCENARIOS.filter((s) => progress.scenarios[s.id]?.done).length

  const items = [
    { to: '/practice/flashcards', icon: Layers, title: 'Flash cards', text: `${FLASHCARDS.length} cards across all seven modules. Flip, then swipe.`, value: known, max: FLASHCARDS.length, meta: `${known}/${FLASHCARDS.length} known` },
    { to: '/practice/quiz', icon: ListChecks, title: 'Quiz', text: `10 random questions from a bank of ${QUIZ.length}: multiple choice, ordering, matching and sorting.`, value: best, max: 100, meta: progress.quiz.length ? `Best ${best}%` : 'Not attempted' },
    { to: '/practice/scenarios', icon: Theater, title: 'Scenarios', text: 'Leadership situations, debriefs and self-reflection from the course.', value: scen, max: ALL_SCENARIOS.length, meta: `${scen}/${ALL_SCENARIOS.length} done` },
  ]

  return (
    <Page>
      <PageHeader eyebrow="Drills" title="Practice" subtitle="Lock in the content, then apply it to real cadet situations." />
      <div className="space-y-4">
        {items.map(({ to, icon: Icon, title, text, value, max, meta }) => (
          <Link key={to} to={to} className="card p-5 flex gap-4 items-start group hover:-translate-y-0.5 transition">
            <span className="grid place-items-center h-12 w-12 shrink-0 rounded-xl bg-navy text-gold"><Icon size={22} /></span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="display uppercase text-2xl">{title}</h2>
                <ArrowRight size={18} className="text-faint group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-muted mt-0.5">{text}</p>
              <div className="flex items-center gap-3 mt-3">
                <Bar value={value} max={max} className="flex-1" />
                <span className="text-xs font-semibold text-muted whitespace-nowrap">{meta}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Page>
  )
}
