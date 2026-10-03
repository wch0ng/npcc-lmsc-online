import { Link } from 'react-router-dom'
import { Flag, HeartHandshake, Users, MessagesSquare, RefreshCcw, Presentation, ClipboardList, BookOpen } from 'lucide-react'
import { MODULES } from '../data/modules'
import { useProgress } from '../hooks/useProgress'
import { Page, PageHeader, Bar } from '../components/ui'

const ICONS = { Flag, HeartHandshake, Users, MessagesSquare, RefreshCcw, Presentation, ClipboardList }

export default function Learn() {
  const { progress } = useProgress()
  const read = MODULES.filter((m) => progress.modules[m.id]).length
  return (
    <Page>
      <PageHeader eyebrow="Course content" title="Learn" subtitle="Six modules from the Leadership & Mentoring Skills Course." />
      <div className="flex items-center gap-3 mb-6">
        <Bar value={read} max={MODULES.length} className="flex-1" />
        <span className="text-sm text-muted font-medium">{read}/{MODULES.length} read</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {MODULES.map((m) => {
          const Icon = ICONS[m.icon] ?? BookOpen
          const done = progress.modules[m.id]
          return (
            <Link key={m.id} to={`/learn/${m.id}`} className="card p-5 flex flex-col hover:-translate-y-0.5 transition">
              <div className="flex items-center justify-between">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-navy text-gold"><Icon size={21} /></span>
                <span className={`display text-4xl ${done ? 'text-gold' : 'text-line'}`}>0{m.num}</span>
              </div>
              <h2 className="display uppercase text-2xl mt-4">{m.title}</h2>
              <p className="text-sm text-muted mt-1 flex-1">{m.tagline}</p>
              <p className={`text-xs font-semibold mt-4 ${done ? 'text-good' : 'text-faint'}`}>{done ? '✓ Read' : `${m.sections.length} sections`}</p>
            </Link>
          )
        })}
      </div>
    </Page>
  )
}
