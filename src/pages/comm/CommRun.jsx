import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, PenLine, Type, Undo2, Send, X } from 'lucide-react'
import Paper from '../../components/comm/Paper'
import { COMM_TEST } from '../../data/commtest'
import { useProgress } from '../../hooks/useProgress'
import { Button } from '../../components/ui'
import { scoreCommTest } from './scoring'

const TOOLS = [
  { id: 'read', label: 'Read', icon: Hand, hint: 'Scroll the paper. Tap a number to tick it off. You can undo only once.' },
  { id: 'pen', label: 'Pen', icon: PenLine, hint: 'Draw anywhere on the paper.' },
  { id: 'text', label: 'Type', icon: Type, hint: 'Tap anywhere on the paper to type.' },
]

export default function CommRun() {
  const navigate = useNavigate()
  const { recordCommTest } = useProgress()
  const [started, setStarted] = useState(false)
  const [tool, setTool] = useState('read')
  const [strokes, setStrokes] = useState([])
  const [texts, setTexts] = useState([])
  const [ticks, setTicks] = useState([])
  const [history, setHistory] = useState([]) // for undo: 'stroke' | 'text' | ['tick', n]
  const [undoUsed, setUndoUsed] = useState(false) // only one undo per attempt
  const [left, setLeft] = useState(COMM_TEST.seconds)

  const startAt = useRef(0)
  const firstActionAt = useRef(null)
  const sawEndAt = useRef(null)
  const band = useRef(0.16)
  const finished = useRef(false)
  const latest = useRef({})
  useEffect(() => { latest.current = { strokes, texts, ticks } }, [strokes, texts, ticks])

  const now = () => Date.now() - startAt.current
  const acted = () => { if (firstActionAt.current == null) firstActionAt.current = now() }

  const handIn = useCallback((timedOut = false) => {
    if (finished.current) return
    finished.current = true
    const { strokes, texts, ticks } = latest.current
    const elapsed = Math.min(COMM_TEST.seconds, Math.round(now() / 1000))
    const result = scoreCommTest({
      strokes, texts, ticks, bandBottom: band.current,
      sawEndAt: sawEndAt.current, firstActionAt: firstActionAt.current, elapsed, timedOut,
    })
    recordCommTest({ ...result, paper: { strokes, texts, ticks } })
    navigate('/activities/comm-test/result', { replace: true })
  }, [navigate, recordCommTest])

  // Countdown
  useEffect(() => {
    if (!started) return
    startAt.current = Date.now()
    const id = setInterval(() => {
      const remaining = COMM_TEST.seconds - Math.floor((Date.now() - startAt.current) / 1000)
      setLeft(Math.max(0, remaining))
      if (remaining <= 0) { clearInterval(id); handIn(true) }
    }, 250)
    return () => clearInterval(id)
  }, [started, handIn])

  // Did they actually reach instruction 20 — and when?
  useEffect(() => {
    if (!started) return
    const el = document.getElementById('ins-20')
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && sawEndAt.current == null) sawEndAt.current = now()
    }, { threshold: 0.9 })
    io.observe(el)
    return () => io.disconnect()
  }, [started])

  const onMeasure = useCallback(({ bandBottom }) => { band.current = bandBottom }, [])

  function addStroke(s) { acted(); setStrokes((x) => [...x, s]); setHistory((h) => [...h, 'stroke']) }
  function addText(t) { acted(); setTexts((x) => [...x, t]); setHistory((h) => [...h, 'text']) }
  // Ticks are one-way; the single undo is the only way to take one back.
  function toggleTick(n) { if (ticks.includes(n)) return; acted(); setTicks((x) => [...x, n]); setHistory((h) => [...h, ['tick', n]]) }
  function undo() {
    const last = history[history.length - 1]
    if (!last || undoUsed) return
    setUndoUsed(true)
    setHistory((h) => h.slice(0, -1))
    if (last === 'stroke') setStrokes((x) => x.slice(0, -1))
    else if (last === 'text') setTexts((x) => x.slice(0, -1))
    else setTicks((x) => x.filter((k) => k !== last[1]))
  }

  const mm = Math.floor(left / 60)
  const ss = String(left % 60).padStart(2, '0')
  const urgent = left <= 30

  return (
    <div className="min-h-dvh bg-[#d9d4c7] dark:bg-[#0b1220]">
      {/* Sticky timer bar */}
      <div className="sticky top-0 z-20 bg-navy text-on-navy safe-top">
        <div className="mx-auto max-w-[680px] px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/activities/comm-test')} className="grid place-items-center h-9 w-9 -ml-2 rounded-full hover:bg-white/10" aria-label="Quit test"><X size={20} /></button>
          <div className="flex-1">
            <p className="eyebrow text-gold leading-none">Are you a good receiver?</p>
          </div>
          <span className={`display text-3xl tabular-nums ${urgent ? 'text-[#ff8a70] animate-pulse' : ''}`}>{mm}:{ss}</span>
        </div>
        <div className="h-1 bg-white/10">
          <div className="h-full bg-gold transition-[width] duration-300 ease-linear" style={{ width: `${(left / COMM_TEST.seconds) * 100}%` }} />
        </div>
      </div>

      <div className="px-3 sm:px-6 pt-5 pb-40">
        <Paper tool={tool} strokes={strokes} texts={texts} ticks={ticks} onStroke={addStroke} onText={addText} onTick={toggleTick} onMeasure={onMeasure} />
      </div>

      {/* Tool dock */}
      <div className="fixed bottom-0 inset-x-0 z-20 safe-bottom">
        <div className="mx-auto max-w-[680px] px-3 pb-3">
          <p className="mx-auto w-fit rounded-full bg-surface/95 border border-line px-3 py-1 text-center text-xs font-medium text-muted mb-2">{TOOLS.find((t) => t.id === tool).hint}</p>
          <div className="card flex items-center gap-1 p-1.5">
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id} onClick={() => setTool(id)} aria-pressed={tool === id}
                className={`flex-1 flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition ${tool === id ? 'bg-navy text-on-navy' : 'text-muted hover:bg-surface-2'}`}
              >
                <Icon size={19} /> {label}
              </button>
            ))}
            <button onClick={undo} disabled={!history.length || undoUsed} title={undoUsed ? 'Undo already used' : 'You can undo once'} className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[11px] font-semibold text-muted disabled:opacity-30">
              <Undo2 size={19} /> {undoUsed ? 'Used' : 'Undo ×1'}
            </button>
            <button onClick={() => handIn(false)} className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[11px] font-bold bg-gold text-navy">
              <Send size={19} /> Hand in
            </button>
          </div>
        </div>
      </div>

      {/* Face-down cover */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="fixed inset-0 z-40 bg-navy text-on-navy grid place-items-center px-6"
            exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
          >
            <motion.div initial={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.35 }} className="max-w-sm w-full text-center">
              <div className="mx-auto w-44 h-60 rounded-md bg-[#fffefa] shadow-2xl rotate-[-4deg] grid place-items-center">
                <span className="display text-navy text-2xl uppercase opacity-25">Face down</span>
              </div>
              <h1 className="display uppercase text-4xl mt-10">Pens ready?</h1>
              <p className="text-on-navy/75 mt-2">When you turn the paper over, your <b>2 minutes 30 seconds</b> start. Follow the instructions on the paper.</p>
              <Button variant="gold" className="w-full mt-8 text-lg py-4" onClick={() => setStarted(true)}>Turn over &amp; begin</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
