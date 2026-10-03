import { Link } from 'react-router-dom'
import { ArrowRight, User, Users, Plus } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { GOAL_TYPES, SMART_STEPS, GOAL_STATUS, formatDate } from '../../data/goals'
import { Page, PageHeader, SectionLabel } from '../../components/ui'

const TYPE_ICON = { personal: User, squad: Users }

const STATUS_CLS = {
  planned: 'bg-surface-2 text-muted',
  progress: 'bg-gold-soft text-ink',
  achieved: 'bg-good-soft text-good',
}

export default function GoalsHome() {
  const { progress } = useProgress()
  const goals = progress.goals ?? []

  return (
    <Page>
      <PageHeader back="/activities" eyebrow="Activity · Basic Teamwork" title="Goal setting" subtitle="Let’s try! Set a SMART goal for yourself and one for your squad." />

      {/* SMART strip */}
      <div className="grid grid-cols-5 gap-1.5">
        {SMART_STEPS.map((s) => (
          <div key={s.key} className="rounded-xl bg-navy text-on-navy px-1 py-3 text-center">
            <p className="display text-3xl text-gold leading-none">{s.letter}</p>
            <p className="text-[10px] sm:text-xs font-semibold mt-1 leading-tight">{s.name}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {Object.values(GOAL_TYPES).map((t) => {
          const Icon = TYPE_ICON[t.id]
          return (
            <Link key={t.id} to={`/activities/goals/new?type=${t.id}`} className="card p-5 group hover:-translate-y-0.5 transition">
              <div className="flex items-center justify-between">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-gold-soft text-ink"><Icon size={21} /></span>
                <Plus className="text-faint group-hover:text-ink transition" />
              </div>
              <h2 className="display uppercase text-2xl mt-4">New {t.label.toLowerCase()}</h2>
              <p className="text-sm text-muted mt-1">{t.blurb}</p>
            </Link>
          )
        })}
      </div>

      {goals.length > 0 && (
        <>
          <SectionLabel className="mt-10">My goals</SectionLabel>
          <div className="card divide-y divide-line overflow-hidden">
            {goals.map((g) => {
              const Icon = TYPE_ICON[g.type]
              const status = GOAL_STATUS.find((s) => s.id === g.status)
              return (
                <Link key={g.id} to={`/activities/goals/${g.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-2">
                  <span className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-surface-2 text-muted"><Icon size={18} /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold truncate">{g.title}</span>
                    <span className="block text-xs text-muted">
                      {GOAL_TYPES[g.type].label}{g.squad ? ` · ${g.squad}` : ''}{g.deadline ? ` · by ${formatDate(g.deadline)}` : ''}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLS[g.status]}`}>{status?.label}</span>
                  <ArrowRight size={16} className="text-faint shrink-0" />
                </Link>
              )
            })}
          </div>
        </>
      )}
    </Page>
  )
}
