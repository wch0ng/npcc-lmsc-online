import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Camera, ListChecks, ClipboardCheck, CheckCircle2, Circle } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { FINAL_LENGTH, completionSnapshot } from '../../data/final'
import { Page, PageHeader, Button, SectionLabel } from '../../components/ui'

export default function FinalIntro() {
  const { progress } = useProgress()
  const navigate = useNavigate()
  const [name, setName] = useState(progress.profile?.name ?? '')
  const [squad, setSquad] = useState(progress.profile?.squad ?? '')
  const snap = completionSnapshot(progress)
  const modsDone = snap.modules.filter((m) => m.done).length
  const actsDone = snap.activities.filter((a) => a.done).length
  const scenDone = snap.scenarios.reduce((n, g) => n + g.done, 0)
  const scenTotal = snap.scenarios.reduce((n, g) => n + g.total, 0)
  const ready = name.trim() && squad.trim()
  const past = progress.final ?? []

  return (
    <Page>
      <PageHeader back="/practice" eyebrow="Assessment" title="Final Quiz" subtitle="Complete the course, take the final quiz, then submit a screenshot of your results page." />

      <div className="card p-5 space-y-4">
        <Row icon={ListChecks} title={`${FINAL_LENGTH} questions across all six modules`} text="Answers are not shown during the quiz. You can review them at the end." />
        <Row icon={ClipboardCheck} title="Your course completion is recorded" text="The results page lists which modules, activities and scenarios you have completed at the time you finish." />
        <Row icon={Camera} title="Screenshot your results page for submission" text="Make sure your name, score and completion status are visible." />
      </div>

      <SectionLabel className="mt-8">Before you start: your completion</SectionLabel>
      <div className="card divide-y divide-line">
        <Status done={modsDone === snap.modules.length} label="Modules read" value={`${modsDone}/${snap.modules.length}`} to="/learn" />
        <Status done={actsDone === snap.activities.length} label="Activities" value={`${actsDone}/${snap.activities.length}`} to="/activities" />
        <Status done={scenDone === scenTotal} label="Scenarios" value={`${scenDone}/${scenTotal}`} to="/practice/scenarios" />
      </div>
      {(modsDone < snap.modules.length || actsDone < snap.activities.length || scenDone < scenTotal) && (
        <p className="text-sm text-muted mt-2 px-1">You can still take the quiz now. Anything incomplete will show as not done on your results.</p>
      )}

      <SectionLabel className="mt-8">Your details</SectionLabel>
      <div className="card p-5 grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold">Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tan Wei Ming" className="mt-1.5 w-full rounded-xl border border-line bg-bg p-3 text-[16px] outline-none focus:border-gold" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Squad</span>
          <input value={squad} onChange={(e) => setSquad(e.target.value)} placeholder="e.g. Alpha" className="mt-1.5 w-full rounded-xl border border-line bg-bg p-3 text-[16px] outline-none focus:border-gold" />
        </label>
      </div>

      <Button variant="gold" className="w-full mt-6 py-4 text-lg" disabled={!ready}
        onClick={() => navigate('/final/run', { state: { name: name.trim(), squad: squad.trim() } })}>
        Start final quiz <ArrowRight size={18} />
      </Button>

      {past.length > 0 && (
        <>
          <SectionLabel className="mt-10">Past attempts</SectionLabel>
          <div className="card divide-y divide-line overflow-hidden">
            {past.map((r, i) => (
              <Link key={r.date} to={`/final/result?i=${i}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                <span className="display text-3xl w-16">{Math.round((r.score / r.total) * 100)}%</span>
                <span className="flex-1">
                  <span className="block font-semibold">Attempt {r.attempt} · {r.score}/{r.total}</span>
                  <span className="block text-xs text-muted">{new Date(r.date).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </span>
                <ArrowRight size={16} className="text-faint" />
              </Link>
            ))}
          </div>
        </>
      )}
    </Page>
  )
}

function Row({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-gold-soft text-ink"><Icon size={18} /></span>
      <div><p className="font-semibold text-[15px]">{title}</p><p className="text-sm text-muted">{text}</p></div>
    </div>
  )
}

function Status({ done, label, value, to }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
      {done ? <CheckCircle2 size={20} className="text-good" /> : <Circle size={20} className="text-faint" />}
      <span className="flex-1 font-medium">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-muted">{value}</span>
      <ArrowRight size={16} className="text-faint" />
    </Link>
  )
}
