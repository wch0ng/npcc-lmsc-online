import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SCENARIO_GROUPS } from '../data/scenarios'
import { useProgress } from '../hooks/useProgress'
import { Page, PageHeader } from '../components/ui'

export default function Scenarios() {
  const { progress } = useProgress()
  return (
    <Page>
      <PageHeader back="/practice" eyebrow="Practice" title="Scenarios" subtitle="Situations from the course. Think it through, write your answer, then compare with the points to consider." />
      <div className="space-y-8">
        {SCENARIO_GROUPS.map((g) => (
          <section key={g.id}>
            <h2 className="display uppercase text-2xl">{g.title}</h2>
            <p className="text-sm text-muted mb-3">{g.blurb}</p>
            <div className="card divide-y divide-line overflow-hidden">
              {g.scenarios.map((s) => (
                <Link key={s.id} to={`/practice/scenarios/${s.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-2">
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold">{s.title}</span>
                    <span className="block text-sm text-muted truncate">{s.text}</span>
                  </span>
                  {progress.scenarios[s.id]?.done ? <CheckCircle2 size={20} className="text-good shrink-0" /> : <ArrowRight size={18} className="text-faint shrink-0" />}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  )
}
