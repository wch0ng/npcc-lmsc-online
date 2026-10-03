import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { Pencil, Copy, Check, Plus, CalendarClock } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { GOAL_STATUS, goalStatement, formatDate } from '../../data/goals'
import { GoalCard } from './GoalBuilder'
import { Page, PageHeader, Button, SectionLabel, ConfirmButton } from '../../components/ui'

export default function GoalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, saveGoal, deleteGoal } = useProgress()
  const g = (progress.goals ?? []).find((x) => x.id === id)
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)
  if (!g) return <Navigate to="/activities/goals" replace />

  const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline + 'T23:59') - new Date()) / 86400000) : null

  async function copy() {
    try { await navigator.clipboard.writeText(goalStatement(g)); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard unavailable */ }
  }
  function addCheckin() {
    if (!note.trim()) return
    saveGoal({ ...g, status: g.status === 'planned' ? 'progress' : g.status, checkins: [{ date: new Date().toISOString(), note: note.trim() }, ...(g.checkins ?? [])] })
    setNote('')
  }

  return (
    <Page>
      <PageHeader back="/activities/goals" eyebrow="Goal setting" title={g.type === 'squad' ? 'Squad goal' : 'Personal goal'}
        right={<Button variant="ghost" to={`/activities/goals/${g.id}/edit`} className="mt-7 px-3 py-2"><Pencil size={16} /> Edit</Button>} />

      {/* Status */}
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
        {GOAL_STATUS.map((s) => (
          <button key={s.id} onClick={() => saveGoal({ ...g, status: s.id })}
            className={`rounded-lg py-2 text-sm font-semibold transition ${g.status === s.id ? (s.id === 'achieved' ? 'bg-good text-white' : 'bg-navy text-on-navy') : 'text-muted'}`}>
            {s.label}
          </button>
        ))}
      </div>
      {daysLeft !== null && g.status !== 'achieved' && (
        <p className={`mt-3 flex items-center gap-2 text-sm font-semibold ${daysLeft < 0 ? 'text-bad' : 'text-muted'}`}>
          <CalendarClock size={16} />
          {daysLeft < 0 ? `Deadline passed ${-daysLeft} day${daysLeft === -1 ? '' : 's'} ago` : daysLeft === 0 ? 'Deadline is today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} to the deadline (${formatDate(g.deadline)})`}
        </p>
      )}

      <GoalCard g={g} />

      <Button variant="soft" className="w-full mt-3" onClick={copy}>
        {copied ? <><Check size={18} /> Copied</> : <><Copy size={18} /> Copy goal to share{g.type === 'squad' ? ' with your squad' : ''}</>}
      </Button>

      {/* Check-ins: “setting goals and checking progress” */}
      <SectionLabel className="mt-9">Progress check-ins</SectionLabel>
      <div className="card p-4">
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)}
          placeholder={g.type === 'squad' ? 'How is the squad doing? e.g. “Pitched the tent in 9 min, down from 12”' : 'How are you doing? e.g. “Ran 2.4 km in 12:40 today”'}
          className="w-full rounded-xl border border-line bg-bg p-3 text-[15px] outline-none focus:border-gold resize-y" />
        <Button className="w-full mt-2" onClick={addCheckin} disabled={!note.trim()}><Plus size={18} /> Add check-in</Button>
        {(g.checkins ?? []).length > 0 && (
          <ol className="mt-4 border-l-2 border-gold/40 ml-2 space-y-3">
            {g.checkins.map((c) => (
              <li key={c.date} className="pl-4 relative">
                <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-gold" />
                <p className="text-xs text-muted">{new Date(c.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="text-[15px]">{c.note}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-10 text-center">
        <ConfirmButton label="Delete this goal" confirmLabel="Tap again to delete" onConfirm={() => { deleteGoal(g.id); navigate('/activities/goals', { replace: true }) }} className="text-xs text-faint underline underline-offset-4" />
      </div>
    </Page>
  )
}
