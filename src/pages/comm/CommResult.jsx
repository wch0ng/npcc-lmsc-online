import { useState } from 'react'
import { Navigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Save, Radio, Ear, Lightbulb } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { COMM_TEST, COMM_DEBRIEF } from '../../data/commtest'
import Paper from '../../components/comm/Paper'
import { Page, PageHeader, Button, SectionLabel } from '../../components/ui'

export default function CommResult() {
  const { progress, saveCommDebrief } = useProgress()
  const [params] = useSearchParams()
  const idx = Number(params.get('i') ?? 0)
  const r = progress.commtest[idx]
  const [notes, setNotes] = useState(() => r?.debrief ?? {})
  const [saved, setSaved] = useState(false)
  if (!r) return <Navigate to="/activities/comm-test" replace />

  const actions = r.extraStrokes + r.extraTexts + r.extraTicks.length
  const checks = [
    { ok: r.sawEnd, label: 'Read all the way to instruction 20', detail: r.sawEnd ? (r.readFirst ? 'Before doing anything. Exactly what instruction 1 asked.' : 'But only after you had already started marking the paper.') : 'You never reached the last instruction.' },
    { ok: r.followedOnly2, label: 'Did only instruction 2', detail: r.followedOnly2 ? 'No unnecessary marks or ticks.' : describeExtras(r) },
    { ok: r.nameDone, label: 'Wrote name and squad in the top-right corner', detail: r.nameDone ? (r.nameAndSquad ? 'Done.' : 'Name found. Did you include your squad too?') : 'Nothing written in the top-right corner.' },
    { ok: !r.timedOut, label: 'Handed in within 2½ minutes', detail: r.timedOut ? 'Time ran out.' : `Used ${fmt(r.elapsed)} of 2:30.` },
  ]

  return (
    <Page>
      <PageHeader back="/activities/comm-test" eyebrow="2½ Minutes Test · Result" title={r.passed ? 'Good receiver!' : 'Caught out!'} />

      {/* The reveal */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`card overflow-hidden ${r.passed ? 'border-good!' : 'border-bad!'}`}>
        <div className={`p-5 ${r.passed ? 'bg-good-soft' : 'bg-bad-soft'}`}>
          <div className="flex items-center gap-3">
            {r.passed ? <CheckCircle2 className="text-good shrink-0" size={34} /> : <XCircle className="text-bad shrink-0" size={34} />}
            <p className="font-semibold text-[17px] leading-snug">
              {r.passed
                ? 'You read everything first and did only what was asked.'
                : actions > 0
                  ? `You carried out ${actions} action${actions > 1 ? 's' : ''} that the paper never needed.`
                  : 'You didn’t complete the one instruction that mattered.'}
            </p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <p className="eyebrow text-muted">The trick</p>
          <Instruction n={1} text={COMM_TEST.instructions[0].text} />
          <Instruction n={20} text={COMM_TEST.instructions[19].text} />
          <p className="text-[15px] leading-relaxed text-muted">The only thing to do was instruction 2: write your name and squad in the top-right corner. Everything from 3 to 19 was a test of whether you <b className="text-ink">received the whole message before acting</b>.</p>
        </div>
      </motion.section>

      {/* Checklist */}
      <SectionLabel className="mt-8">How you did</SectionLabel>
      <ul className="card divide-y divide-line">
        {checks.map((c) => (
          <li key={c.label} className="flex gap-3 p-4">
            {c.ok ? <CheckCircle2 className="text-good shrink-0" size={22} /> : <XCircle className="text-bad shrink-0" size={22} />}
            <div><p className="font-semibold">{c.label}</p><p className="text-sm text-muted">{c.detail}</p></div>
          </li>
        ))}
      </ul>

      {/* Their paper */}
      <SectionLabel className="mt-8">Your paper</SectionLabel>
      <div className="rounded-2xl bg-[#d9d4c7] dark:bg-[#0b1220] p-3 sm:p-5">
        <Paper readOnly strokes={r.paper.strokes} texts={r.paper.texts} ticks={r.paper.ticks} />
      </div>

      {/* Lesson */}
      <SectionLabel className="mt-8">Link to Effective Communication</SectionLabel>
      <div className="grid sm:grid-cols-3 gap-3">
        <Lesson icon={Radio} title="A two-way process" text="Communication is effective only when messages are sent clearly, received and understood by both parties. The sender was clear. Instruction 1 told you what to do." />
        <Lesson icon={Ear} title="Active listening" text="Pay attention, interpret and make sense of the whole message before acting. Acknowledge, or seek clarification. It overcomes assumptions." />
        <Lesson icon={Lightbulb} title="As a leader" text="Cadets act on what they think you said. Brief completely, check for understanding, and when you receive orders, take in the full brief first." />
      </div>
      <Link to="/learn/communication" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">Effective Communication module <ArrowRight size={16} /></Link>

      {/* Debrief */}
      <SectionLabel className="mt-9">Self-reflection</SectionLabel>
      <div className="card p-5 space-y-5">
        <p className="text-sm text-muted">Use the debrief questions from the Reflection module to draw out your learning points.</p>
        {COMM_DEBRIEF.map((d) => (
          <label key={d.id} className="block">
            <span className="display uppercase text-xl">{d.label}</span>
            <span className="block text-sm text-muted">{d.hint}</span>
            <textarea
              rows={3} value={notes[d.id] ?? ''}
              onChange={(e) => { setNotes({ ...notes, [d.id]: e.target.value }); setSaved(false) }}
              className="mt-2 w-full rounded-xl border border-line bg-bg p-3 text-[15px] outline-none focus:border-gold resize-y"
            />
          </label>
        ))}
        <Button onClick={() => { saveCommDebrief(idx, notes); setSaved(true) }} variant={saved ? 'soft' : 'primary'} className="w-full">
          <Save size={18} /> {saved ? 'Saved' : 'Save reflection'}
        </Button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button to="/activities/comm-test/run" variant="ghost" className="flex-1"><RotateCcw size={18} /> Try again</Button>
        <Button to="/activities" className="flex-1">More activities <ArrowRight size={18} /></Button>
      </div>
    </Page>
  )
}

function Instruction({ n, text }) {
  return (
    <div className="flex gap-3 rounded-xl bg-surface-2 p-3">
      <span className="display text-2xl text-gold w-7 shrink-0 text-right">{n}.</span>
      <p className="text-[15px] font-medium leading-snug">{text}</p>
    </div>
  )
}

function Lesson({ icon: Icon, title, text }) {
  return (
    <div className="card p-4">
      <Icon size={20} className="text-gold" />
      <p className="font-semibold mt-2">{title}</p>
      <p className="text-sm text-muted mt-1 leading-relaxed">{text}</p>
    </div>
  )
}

function describeExtras(r) {
  const parts = []
  if (r.extraTicks.length) parts.push(`ticked off instruction${r.extraTicks.length > 1 ? 's' : ''} ${r.extraTicks.join(', ')}`)
  if (r.extraStrokes) parts.push(`drew ${r.extraStrokes} mark${r.extraStrokes > 1 ? 's' : ''} on the paper`)
  if (r.extraTexts) parts.push(`wrote ${r.extraTexts} thing${r.extraTexts > 1 ? 's' : ''} outside the top-right corner`)
  const s = parts.join('; ')
  return `You ${s}.`
}

function fmt(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }
