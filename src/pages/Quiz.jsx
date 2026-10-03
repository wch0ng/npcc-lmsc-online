import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, X } from 'lucide-react'
import { QUIZ } from '../data/quiz'
import { moduleById } from '../data/modules'
import { useProgress } from '../hooks/useProgress'
import { TYPES } from '../components/quiz/types'
import { Page, PageHeader, Button, Bar, SectionLabel } from '../components/ui'

const LEN = 10

function pick() {
  const x = [...QUIZ]
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] }
  return x.slice(0, LEN)
}

export default function Quiz() {
  const { progress, recordQuiz } = useProgress()
  const [qs, setQs] = useState(null)
  const [i, setI] = useState(0)
  const [results, setResults] = useState([])
  const [locked, setLocked] = useState(false)

  function start() { setQs(pick()); setI(0); setResults([]); setLocked(false) }
  function submit(ok) { setResults((r) => [...r, ok]); setLocked(true) }
  function next() {
    if (i + 1 >= qs.length) { recordQuiz(results.filter(Boolean).length, qs.length); setI(qs.length); return }
    setI(i + 1); setLocked(false)
  }

  // Results
  if (qs && i >= qs.length) {
    const score = results.filter(Boolean).length
    const pct = Math.round((score / qs.length) * 100)
    return (
      <Page>
        <PageHeader eyebrow="Quiz complete" title={pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good effort' : 'Keep practising'} />
        <div className="card p-6 flex items-center gap-6 bg-navy! text-on-navy border-navy!">
          <p className="display text-7xl text-gold">{pct}%</p>
          <p className="text-on-navy/80">{score} of {qs.length} correct</p>
        </div>
        <SectionLabel className="mt-8">Review</SectionLabel>
        <ul className="card divide-y divide-line">
          {qs.map((q, n) => (
            <li key={q.id} className="flex gap-3 p-4">
              {results[n] ? <CheckCircle2 className="text-good shrink-0" size={20} /> : <XCircle className="text-bad shrink-0" size={20} />}
              <div>
                <p className="text-[15px] font-medium">{q.question}</p>
                {!results[n] && <p className="text-sm text-muted mt-1">{q.explanation}</p>}
                <p className="text-xs text-faint mt-1">Module {moduleById[q.module].num}: {moduleById[q.module].title}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={start}>New quiz</Button>
          <Button variant="ghost" className="flex-1" onClick={() => setQs(null)}>Done</Button>
        </div>
      </Page>
    )
  }

  // In progress
  if (qs) {
    const q = qs[i]
    const { label, C } = TYPES[q.type]
    const ok = results[i]
    return (
      <Page>
        <div className="flex items-center gap-3 pt-6 safe-top">
          <button onClick={() => setQs(null)} className="grid place-items-center h-9 w-9 -ml-2 rounded-full hover:bg-surface-2" aria-label="Quit quiz"><X size={20} /></button>
          <Bar value={i + (locked ? 1 : 0)} max={qs.length} className="flex-1" />
          <span className="text-sm text-muted tabular-nums">{i + 1}/{qs.length}</span>
        </div>
        <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <p className="eyebrow text-gold">{label} · {moduleById[q.module].title}</p>
          <h1 className="display text-[1.9rem] sm:text-4xl leading-tight mt-2 font-semibold! normal-case">{q.question}</h1>
          <div className="mt-6"><C key={q.id} q={q} onSubmit={submit} locked={locked} /></div>
        </motion.div>
        {locked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 rounded-2xl p-4 ${ok ? 'bg-good-soft' : 'bg-bad-soft'}`}>
            <p className={`font-bold flex items-center gap-2 ${ok ? 'text-good' : 'text-bad'}`}>{ok ? <CheckCircle2 size={20} /> : <XCircle size={20} />}{ok ? 'Correct!' : 'Not quite'}</p>
            <p className="text-[15px] mt-1">{q.explanation}</p>
            <Button className="w-full mt-4" onClick={next}>{i + 1 >= qs.length ? 'See results' : 'Next question'} <ArrowRight size={18} /></Button>
          </motion.div>
        )}
      </Page>
    )
  }

  // Start screen
  const best = progress.quiz.length ? Math.max(...progress.quiz.map((r) => Math.round((r.score / r.total) * 100))) : null
  return (
    <Page>
      <PageHeader back="/practice" eyebrow="Practice" title="Quiz" subtitle={`${LEN} random questions from a bank of ${QUIZ.length}, covering all seven modules.`} />
      <div className="grid grid-cols-2 gap-3">
        {Object.values(TYPES).map((t) => <div key={t.label} className="card px-4 py-3 text-sm font-semibold">{t.label}</div>)}
      </div>
      {best !== null && (
        <div className="card p-5 mt-5 flex items-center justify-between">
          <div><p className="text-sm text-muted">Best score</p><p className="display text-5xl">{best}%</p></div>
          <div className="text-right"><p className="text-sm text-muted">Attempts</p><p className="display text-5xl">{progress.quiz.length}</p></div>
        </div>
      )}
      <Button className="w-full mt-6 py-4 text-lg" onClick={start}>Start quiz <ArrowRight size={18} /></Button>
    </Page>
  )
}
