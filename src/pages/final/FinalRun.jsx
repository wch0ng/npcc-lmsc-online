import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgress } from '../../hooks/useProgress'
import { buildFinalQuiz, completionSnapshot } from '../../data/final'
import { moduleById } from '../../data/modules'
import { TYPES } from '../../components/quiz/types'
import { Bar, ConfirmButton } from '../../components/ui'

// Exam mode: no per-question feedback; answering moves straight on.
export default function FinalRun() {
  const { state } = useLocation()
  if (!state?.name) return <Navigate to="/final" replace />
  return <Run name={state.name} squad={state.squad} />
}

function Run({ name, squad }) {
  const navigate = useNavigate()
  const { progress, recordFinal } = useProgress()
  const [qs] = useState(buildFinalQuiz)
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])

  function submit(ok) {
    const next = [...answers, { id: qs[i].id, ok }]
    setAnswers(next)
    if (i + 1 < qs.length) { setI(i + 1); return }
    recordFinal({
      name, squad,
      score: next.filter((a) => a.ok).length,
      total: qs.length,
      answers: next,
      snapshot: completionSnapshot(progress),
    })
    navigate('/final/result?i=0&new=1', { replace: true })
  }

  const q = qs[i]
  const { label, C } = TYPES[q.type]
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 pb-16 min-h-dvh">
      <div className="flex items-center gap-3 pt-6 safe-top">
        <ConfirmButton label="Quit" confirmLabel="Tap again to quit" onConfirm={() => navigate('/final')}
          className="-ml-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink" />
        <Bar value={i} max={qs.length} className="flex-1" />
        <span className="text-sm text-muted tabular-nums">{i + 1}/{qs.length}</span>
      </div>
      <p className="eyebrow text-muted mt-4">Final quiz · {name} · {squad}</p>
      <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
        <p className="eyebrow text-gold">{label} · {moduleById[q.module].title}</p>
        <h1 className="display text-[1.9rem] sm:text-4xl leading-tight mt-2 font-semibold! normal-case">{q.question}</h1>
        <div className="mt-6"><C key={q.id} q={q} onSubmit={submit} locked={false} /></div>
      </motion.div>
    </div>
  )
}
