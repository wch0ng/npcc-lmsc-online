import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lightbulb, ArrowRight, Save } from 'lucide-react'
import { ALL_SCENARIOS, SCENARIO_GROUPS } from '../data/scenarios'
import { useProgress } from '../hooks/useProgress'
import { Page, PageHeader, Button } from '../components/ui'

export default function Scenario() {
  const { id } = useParams()
  const s = ALL_SCENARIOS.find((x) => x.id === id)
  if (!s) return <Navigate to="/practice/scenarios" replace />
  return <ScenarioBody key={s.id} s={s} />
}

function ScenarioBody({ s }) {
  const { progress, saveScenario } = useProgress()
  const saved = progress.scenarios[s.id]
  const [notes, setNotes] = useState(saved?.notes ?? {})
  const [reveal, setReveal] = useState(!!saved?.done)
  const group = SCENARIO_GROUPS.find((g) => g.id === s.group)
  const idx = ALL_SCENARIOS.findIndex((x) => x.id === s.id)
  const next = ALL_SCENARIOS[idx + 1]
  const filled = s.prompts.filter((p) => (notes[p.id] ?? '').trim()).length

  function done() { saveScenario(s.id, notes, true); setReveal(true) }

  return (
    <Page>
      <PageHeader back="/practice/scenarios" eyebrow={group.title} title={s.title.split(' · ')[1] ?? s.title} />
      <section className="card p-5 ruled">
        <p className="eyebrow text-gold">{s.title.split(' · ')[0]}</p>
        <p className="mt-2 text-[16px] leading-[2rem]">{s.text}</p>
      </section>

      <div className="mt-5 space-y-4">
        {s.prompts.map((p) => (
          <div key={p.id} className="card p-5">
            <p className="display uppercase text-xl">{p.label}</p>
            {p.hint && <p className="text-sm text-muted">{p.hint}</p>}
            {p.options ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {p.options.map((o) => (
                  <button key={o} onClick={() => setNotes({ ...notes, [p.id]: o })} className={`rounded-full px-3.5 py-2 text-sm font-semibold border transition ${notes[p.id] === o ? 'bg-navy text-on-navy border-navy' : 'border-line bg-surface'}`}>{o}</button>
                ))}
              </div>
            ) : (
              <textarea rows={3} value={notes[p.id] ?? ''} onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })}
                className="mt-3 w-full rounded-xl border border-line bg-bg p-3 text-[15px] outline-none focus:border-gold resize-y" placeholder="Your answer…" />
            )}
          </div>
        ))}
      </div>

      {!reveal ? (
        <Button className="w-full mt-5" disabled={filled === 0} onClick={done}><Lightbulb size={18} /> Compare with points to consider</Button>
      ) : (
        <>
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-gold-soft p-5">
            <p className="eyebrow text-ink/70 flex items-center gap-1.5"><Lightbulb size={14} /> Points to consider</p>
            <ul className="mt-2 space-y-2">
              {s.consider.map((c) => <li key={c} className="flex gap-2.5 text-[15px] leading-relaxed"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink shrink-0" />{c}</li>)}
            </ul>
            <p className="text-xs text-ink/60 mt-3">There’s no single right answer. Discuss yours with your squad and CI.</p>
          </motion.section>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => saveScenario(s.id, notes, true)}><Save size={18} /> Save my answers</Button>
            {next && <Button to={`/practice/scenarios/${next.id}`} className="flex-1">Next scenario <ArrowRight size={18} /></Button>}
          </div>
        </>
      )}
    </Page>
  )
}
