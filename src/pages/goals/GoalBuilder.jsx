import { useState } from 'react'
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Lightbulb, X, Save } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { GOAL_TYPES, SMART_STEPS, formatDate } from '../../data/goals'
import { Button } from '../../components/ui'

const blank = (type) => ({
  id: `g${Date.now().toString(36)}`, type, title: '', squad: '',
  s: '', m: '', a: '', r: '', t: '', deadline: '', roles: '',
  checks: {}, status: 'planned', checkins: [], created: new Date().toISOString(),
})

export default function GoalBuilder() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { progress } = useProgress()
  const existing = id && (progress.goals ?? []).find((g) => g.id === id)
  const type = existing?.type ?? params.get('type')
  if (id && !existing) return <Navigate to="/activities/goals" replace />
  if (!GOAL_TYPES[type]) return <Navigate to="/activities/goals" replace />
  return <Wizard initial={existing ?? blank(type)} isEdit={!!existing} />
}

function Wizard({ initial, isEdit }) {
  const navigate = useNavigate()
  const { saveGoal } = useProgress()
  const [g, setG] = useState(initial)
  const type = GOAL_TYPES[g.type]
  const isSquad = g.type === 'squad'

  // Steps: intro → S M A R T → (squad: plan & roles) → review
  const steps = ['intro', ...SMART_STEPS.map((s) => s.key), ...(isSquad ? ['roles'] : []), 'review']
  const [i, setI] = useState(isEdit ? steps.length - 1 : 0)
  const [dir, setDir] = useState(1)
  const step = steps[i]
  const set = (patch) => setG((x) => ({ ...x, ...patch }))

  const canNext =
    step === 'intro' ? g.title.trim() && (!isSquad || g.squad.trim())
      : SMART_STEPS.some((s) => s.key === step) ? g[step].trim() && (step !== 't' || g.deadline)
        : true

  function go(n) { setDir(n > i ? 1 : -1); setI(n) }
  function save() {
    saveGoal(g)
    navigate(`/activities/goals/${g.id}`, { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pb-32 md:pb-16">
      {/* Header + progress */}
      <div className="pt-6 safe-top flex items-center gap-3">
        <button onClick={() => navigate(isEdit ? `/activities/goals/${g.id}` : '/activities/goals')} className="grid place-items-center h-9 w-9 -ml-2 rounded-full hover:bg-surface-2" aria-label="Cancel"><X size={20} /></button>
        <p className="eyebrow text-muted flex-1">{isEdit ? 'Edit' : 'New'} {type.label.toLowerCase()}</p>
      </div>
      <div className="mt-3 flex gap-1">
        {steps.map((s, n) => {
          const letter = SMART_STEPS.find((x) => x.key === s)?.letter
          return (
            <button key={s} onClick={() => n < i && go(n)} disabled={n >= i}
              className={`h-7 flex-1 rounded-md text-xs font-bold transition ${n === i ? 'bg-gold text-navy' : n < i ? 'bg-navy text-on-navy' : 'bg-surface-2 text-faint'}`}>
              {letter ?? (s === 'intro' ? '•' : s === 'roles' ? 'P' : '✓')}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -30 }} transition={{ duration: 0.2 }} className="mt-7">
          {step === 'intro' && (
            <div>
              <p className="eyebrow text-gold">{type.label}</p>
              <h1 className="display uppercase text-4xl mt-1">{type.prompt}</h1>
              <p className="text-muted mt-2">{type.blurb} Write it in your own words first. The SMART steps will sharpen it.</p>
              {isSquad && (
                <Field label="Squad name">
                  <input value={g.squad} onChange={(e) => set({ squad: e.target.value })} placeholder="e.g. Alpha Squad" className={inputCls} />
                </Field>
              )}
              <Field label="My goal in one line">
                <textarea rows={2} value={g.title} onChange={(e) => set({ title: e.target.value })} placeholder={type.placeholder} className={inputCls} />
              </Field>
            </div>
          )}

          {SMART_STEPS.filter((s) => s.key === step).map((s) => (
            <SmartStep key={s.key} s={s} g={g} set={set} />
          ))}

          {step === 'roles' && (
            <div>
              <p className="eyebrow text-gold">Forming · Planning &amp; role allocation</p>
              <h1 className="display uppercase text-4xl mt-1">Plan &amp; roles</h1>
              <p className="text-muted mt-2">Who will do what? Agreeing roles early helps the squad through Forming, and avoids conflict later (Storming).</p>
              <Field label="Roles and first steps (optional)">
                <textarea rows={5} value={g.roles} onChange={(e) => set({ roles: e.target.value })} className={inputCls}
                  placeholder={'e.g.\nCaptain: Wei Jie (plans trainings)\nVice-captain: Priya (equipment checks)\nEveryone: train every Friday'} />
              </Field>
            </div>
          )}

          {step === 'review' && <Review g={g} onJump={(k) => go(steps.indexOf(k))} />}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => go(i - 1)} disabled={i === 0} className="px-4"><ChevronLeft size={18} /> Back</Button>
        {step === 'review'
          ? <Button variant="gold" onClick={save}><Save size={18} /> Save goal</Button>
          : <Button onClick={() => go(i + 1)} disabled={!canNext}>Next <ChevronRight size={18} /></Button>}
      </div>
    </div>
  )
}

const inputCls = 'mt-1.5 w-full rounded-xl border border-line bg-surface p-3 text-[16px] outline-none focus:border-gold resize-y'

function Field({ label, children }) {
  return (
    <label className="block mt-5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  )
}

function SmartStep({ s, g, set }) {
  const [showEx, setShowEx] = useState(false)
  const checks = g.checks?.[s.key] ?? []
  const toggle = (n) => {
    const next = [...checks]; next[n] = !next[n]
    set({ checks: { ...g.checks, [s.key]: next } })
  }
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="display text-7xl text-gold leading-none">{s.letter}</span>
        <div>
          <h1 className="display uppercase text-4xl leading-none">{s.name}</h1>
          <p className="text-muted mt-1">{s.desc}</p>
        </div>
      </div>
      <p className="mt-5 font-semibold text-[17px]">{s.question}</p>

      <textarea rows={3} value={g[s.key]} onChange={(e) => set({ [s.key]: e.target.value })} className={inputCls}
        placeholder={s.key === 't' ? 'e.g. 3 months, before the competition in March' : 'Type your answer…'} />

      {s.key === 't' && (
        <Field label="Deadline">
          <input type="date" value={g.deadline} onChange={(e) => set({ deadline: e.target.value })} className={inputCls} />
        </Field>
      )}

      <button onClick={() => setShowEx((x) => !x)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        <Lightbulb size={16} className="text-gold" /> {showEx ? 'Hide example' : 'Show an example'}
      </button>
      {showEx && (
        <div className="mt-2 rounded-xl bg-gold-soft p-3 text-[15px]">
          <span className="eyebrow text-ink/60 block">{g.type === 'squad' ? 'Campcraft Competition example' : 'Personal example'}</span>
          {s.examples[g.type]}
        </div>
      )}

      <div className="mt-5 rounded-xl border border-line p-3">
        <p className="eyebrow text-muted mb-1.5">Quick check</p>
        {s.checks.map((c, n) => (
          <button key={c} onClick={() => toggle(n)} className="w-full flex items-center gap-3 py-1.5 text-left text-[15px]">
            <span className={`grid place-items-center h-5 w-5 shrink-0 rounded-md border-2 transition ${checks[n] ? 'bg-good border-good text-white' : 'border-line'}`}>{checks[n] && <Check size={14} strokeWidth={3} />}</span>
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

function Review({ g, onJump }) {
  const unchecked = SMART_STEPS.filter((s) => (g.checks?.[s.key] ?? []).filter(Boolean).length < s.checks.length)
  return (
    <div>
      <p className="eyebrow text-gold">Review</p>
      <h1 className="display uppercase text-4xl mt-1">Your SMART goal</h1>
      <GoalCard g={g} onJump={onJump} />
      {unchecked.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          Not every quick check is ticked yet for <b className="text-ink">{unchecked.map((s) => s.name).join(', ')}</b>. Tap a letter to strengthen that part, or save it as it is.
        </p>
      )}
    </div>
  )
}

export function GoalCard({ g, onJump }) {
  return (
    <div className="mt-4 card overflow-hidden">
      <div className="bg-navy text-on-navy p-5">
        <p className="eyebrow text-gold">{GOAL_TYPES[g.type].label}{g.squad ? ` · ${g.squad}` : ''}</p>
        <p className="display text-3xl mt-1 normal-case font-semibold! leading-tight">{g.title}</p>
      </div>
      <div className="divide-y divide-line">
        {SMART_STEPS.map((s) => (
          <button key={s.key} onClick={() => onJump?.(s.key)} disabled={!onJump} className="w-full flex gap-4 p-4 text-left enabled:hover:bg-surface-2">
            <span className="display text-3xl text-gold w-6 shrink-0 leading-none">{s.letter}</span>
            <span className="flex-1 min-w-0">
              <span className="eyebrow text-muted">{s.name}</span>
              <span className="block text-[15px] whitespace-pre-wrap">{g[s.key] || <i className="text-faint">Not filled in</i>}</span>
              {s.key === 't' && g.deadline && <span className="block text-sm font-semibold mt-0.5">Deadline: {formatDate(g.deadline)}</span>}
            </span>
          </button>
        ))}
        {g.type === 'squad' && g.roles?.trim() && (
          <button onClick={() => onJump?.('roles')} disabled={!onJump} className="w-full flex gap-4 p-4 text-left enabled:hover:bg-surface-2">
            <span className="display text-3xl text-gold w-6 shrink-0 leading-none">P</span>
            <span className="flex-1"><span className="eyebrow text-muted">Plan &amp; roles</span><span className="block text-[15px] whitespace-pre-wrap">{g.roles}</span></span>
          </button>
        )}
      </div>
    </div>
  )
}
