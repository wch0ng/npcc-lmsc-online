import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { VAK_QUESTIONS, OPTION_STYLE } from '../../data/vak'
import { useProgress } from '../../hooks/useProgress'
import { Button } from '../../components/ui'
import { loadDraft, saveDraft, clearDraft } from './draft'

const N = VAK_QUESTIONS.length
const LETTERS = ['a', 'b', 'c']

export default function VakRun() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { recordVak } = useProgress()

  const [answers, setAnswers] = useState(() => {
    if (params.get('fresh')) { clearDraft(); return Array(N).fill(null) }
    const d = loadDraft()
    return Array.isArray(d) && d.length === N ? d : Array(N).fill(null)
  })
  const [i, setI] = useState(() => { const f = answers.indexOf(null); return f === -1 ? N - 1 : f })
  const [dir, setDir] = useState(1)
  const [phase, setPhase] = useState('questions') // 'questions' | 'tally'
  const advanceTimer = useRef(null)

  useEffect(() => { saveDraft(answers) }, [answers])
  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  const go = useCallback((to) => {
    clearTimeout(advanceTimer.current)
    if (to < 0) return
    if (to >= N) { setPhase('tally'); return }
    setDir(to > i ? 1 : -1)
    setI(to)
  }, [i])

  const choose = useCallback((letter) => {
    setAnswers((prev) => { const next = [...prev]; next[i] = letter; return next })
    clearTimeout(advanceTimer.current)
    // Brief pause so the selection registers visually before moving on.
    advanceTimer.current = setTimeout(() => {
      const nextUnanswered = answers.findIndex((a, idx) => idx > i && a === null)
      if (i === N - 1 || nextUnanswered === -1) {
        const allDone = answers.every((a, idx) => idx === i || a !== null)
        if (allDone) { setPhase('tally'); return }
      }
      go(i + 1)
    }, 320)
  }, [i, answers, go])

  // Keyboard: 1/2/3 or a/b/c to answer, arrows to move.
  useEffect(() => {
    if (phase !== 'questions') return
    const onKey = (e) => {
      const k = e.key.toLowerCase()
      const idx = ['1', '2', '3'].indexOf(k)
      if (idx >= 0) choose(LETTERS[idx])
      else if (LETTERS.includes(k)) choose(k)
      else if (e.key === 'ArrowRight' && answers[i]) go(i + 1)
      else if (e.key === 'ArrowLeft') go(i - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, choose, go, i, answers])

  function finish() {
    const counts = { v: 0, a: 0, k: 0 }
    answers.forEach((a) => { if (a) counts[OPTION_STYLE[a]] += 1 })
    recordVak(answers, counts)
    clearDraft()
    navigate('/activities/vak/result?new=1', { replace: true })
  }

  const done = answers.filter(Boolean).length

  if (phase === 'tally') {
    const missing = answers.map((a, idx) => (a ? null : idx)).filter((x) => x !== null)
    return <Tally answers={answers} missing={missing} onFix={(idx) => { setPhase('questions'); setI(idx) }} onReveal={finish} onBack={() => { setPhase('questions'); setI(N - 1) }} />
  }

  const q = VAK_QUESTIONS[i]
  return (
    <div className="min-h-dvh flex flex-col bg-bg safe-top">
      {/* Top bar */}
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/activities/vak')} className="grid place-items-center h-10 w-10 -ml-2 rounded-full hover:bg-surface-2" aria-label="Save and exit"><X size={22} /></button>
          <p className="eyebrow text-muted">VAK Questionnaire</p>
          <p className="text-sm font-semibold tabular-nums w-10 text-right">{done}/{N}</p>
        </div>
        {/* Segmented progress: one tick per question, tap to jump */}
        <div className="mt-3 flex gap-[3px]">
          {answers.map((a, idx) => (
            <button
              key={idx} onClick={() => go(idx)} aria-label={`Question ${idx + 1}`}
              className={`h-1.5 flex-1 rounded-full transition ${idx === i ? 'bg-gold' : a ? 'bg-navy-2' : 'bg-line'}`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 pt-8 pb-6 flex flex-col">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={i} custom={dir}
            initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <p className="display text-6xl text-gold leading-none">{String(i + 1).padStart(2, '0')}</p>
            <h1 className="display text-[2rem] sm:text-4xl leading-tight mt-3 normal-case font-semibold!">{q.q}</h1>
            <div className="mt-7 space-y-3" role="radiogroup">
              {LETTERS.map((l) => {
                const sel = answers[i] === l
                return (
                  <button
                    key={l} role="radio" aria-checked={sel} onClick={() => choose(l)}
                    className={`w-full flex items-center gap-4 text-left rounded-2xl border-2 px-4 py-4 transition active:scale-[0.99] ${sel ? 'border-navy bg-navy text-on-navy' : 'border-line bg-surface hover:border-faint'}`}
                  >
                    <span className={`grid place-items-center h-9 w-9 shrink-0 rounded-full font-bold uppercase text-sm ${sel ? 'bg-gold text-navy' : 'bg-surface-2 text-muted'}`}>
                      {sel ? <Check size={18} strokeWidth={3} /> : l}
                    </span>
                    <span className="text-[16px] leading-snug font-medium">{q[l]}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-auto pt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => go(i - 1)} disabled={i === 0} className="px-4"><ChevronLeft size={18} /> Back</Button>
          {done === N ? (
            <Button variant="gold" onClick={() => setPhase('tally')}>Add up my answers <ChevronRight size={18} /></Button>
          ) : (
            <Button variant="ghost" onClick={() => go(i + 1)} disabled={!answers[i]} className="px-4">Next <ChevronRight size={18} /></Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Mirrors the paper form’s last step: “Now add up how many A’s, B’s and C’s you selected.”
function Tally({ answers, missing, onFix, onReveal, onBack }) {
  const counts = { a: 0, b: 0, c: 0 }
  answers.forEach((x) => { if (x) counts[x] += 1 })
  const [shown, setShown] = useState({ a: 0, b: 0, c: 0 })

  useEffect(() => {
    let frame = 0
    const id = setInterval(() => {
      frame += 1
      const t = Math.min(1, frame / 30)
      setShown({ a: Math.round(counts.a * t), b: Math.round(counts.b * t), c: Math.round(counts.c * t) })
      if (t === 1) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [counts.a, counts.b, counts.c])

  return (
    <div className="min-h-dvh bg-navy text-on-navy flex flex-col safe-top">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-6 flex-1 flex flex-col">
        <button onClick={onBack} className="self-start -ml-1 inline-flex items-center gap-1 text-sm text-on-navy/70"><ChevronLeft size={18} /> Review answers</button>
        <p className="eyebrow text-gold mt-8">Step 2 of 2</p>
        <h1 className="display uppercase text-5xl mt-2">Add up your answers</h1>
        <p className="text-on-navy/70 mt-2">How many A’s, B’s and C’s did you select?</p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          {LETTERS.map((l) => (
            <div key={l} className="rounded-2xl bg-white/8 border border-white/10 p-4 text-center">
              <p className="eyebrow text-on-navy/60">{l.toUpperCase()}’s</p>
              <p className="display text-6xl tabular-nums mt-1">{shown[l]}</p>
            </div>
          ))}
        </div>

        {missing.length > 0 ? (
          <div className="mt-8 rounded-2xl bg-white/8 p-4">
            <p className="font-semibold">{missing.length} question{missing.length > 1 ? 's' : ''} still unanswered</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {missing.map((idx) => (
                <button key={idx} onClick={() => onFix(idx)} className="rounded-lg bg-gold text-navy px-3 py-1.5 text-sm font-bold">Q{idx + 1}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-auto pb-10 pt-10">
            <Button variant="gold" className="w-full text-lg py-4" onClick={onReveal}>Reveal my learning style</Button>
          </div>
        )}
      </div>
    </div>
  )
}
