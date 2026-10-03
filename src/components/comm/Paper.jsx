import { useEffect, useRef, useState } from 'react'
import '@fontsource/caveat/latin-600.css'
import { COMM_TEST } from '../../data/commtest'

const INK = '#1f47b8'
const HAND = '"Caveat", "Bradley Hand", "Segoe Print", cursive'

/*
  The test sheet. All marks are stored in coordinates normalised by the paper’s
  width (x and y both ÷ width) so they survive resizes and replay at any size.

  tool: 'read' (scroll, tick numbers) | 'pen' (freehand) | 'text' (tap to type)
*/
export default function Paper({
  tool = 'read', strokes = [], texts = [], ticks = [],
  onStroke, onText, onTick, onMeasure, readOnly = false,
}) {
  const paperRef = useRef(null)
  const bandRef = useRef(null)
  const [w, setW] = useState(0)
  const [live, setLive] = useState(null) // stroke being drawn
  const [editing, setEditing] = useState(null) // { x, y, value }

  // Track paper width; report the top band’s extent (the “corners”) for scoring.
  useEffect(() => {
    const el = paperRef.current
    const ro = new ResizeObserver(() => {
      const width = el.offsetWidth
      setW(width)
      if (bandRef.current && width) onMeasure?.({ bandBottom: (bandRef.current.offsetTop + bandRef.current.offsetHeight) / width })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [onMeasure])

  function pt(e) {
    const r = paperRef.current.getBoundingClientRect()
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.width]
  }

  function down(e) {
    if (readOnly) return
    if (tool === 'pen') {
      e.currentTarget.setPointerCapture(e.pointerId)
      setLive([pt(e)])
    } else if (tool === 'text') {
      e.preventDefault() // keep focus on the new input instead of the svg
      commitText()
      const [x, y] = pt(e)
      setEditing({ x, y, value: '' })
    }
  }
  function move(e) {
    if (tool !== 'pen' || !live) return
    const p = pt(e)
    const last = live[live.length - 1]
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.003) setLive((s) => [...s, p])
  }
  function up() {
    if (tool !== 'pen' || !live) return
    onStroke?.(live.map(([x, y]) => [round(x), round(y)]))
    setLive(null)
  }
  function commitText(v = editing) {
    if (v && v.value.trim()) onText?.({ x: round(v.x), y: round(v.y), value: v.value.trim() })
    setEditing(null)
  }

  const path = (s) => s.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * w).toFixed(1)} ${(y * w).toFixed(1)}`).join(' ') + (s.length === 1 ? ' l0.1 0' : '')

  return (
    <div
      ref={paperRef}
      className="relative mx-auto w-full max-w-[640px] bg-[#fffefa] text-[#1b1b1b] shadow-[0_2px_0_rgba(0,0,0,0.04),0_18px_40px_-18px_rgba(0,0,0,0.45)] rounded-[4px] select-none"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', colorScheme: 'light' }}
    >
      {/* Top band: a blank strip whose corners are free to write in */}
      <div ref={bandRef} aria-hidden className="h-[clamp(4.5rem,16vw,6.5rem)]" />
      <div className="flex items-center justify-center px-[4%]">
        <div className="text-center leading-tight">
          <p className="text-[10px] sm:text-xs font-bold tracking-wide">NATIONAL POLICE CADET CORPS</p>
          <p className="text-[10px] sm:text-xs underline">Leadership &amp; Mentoring Skills Course</p>
        </div>
      </div>

      <div className="px-[7%] pb-[10%]">
        <h2 className="text-center text-[28px] sm:text-[36px] mt-3 leading-none">2 ½ Minutes Test</h2>
        <p className="text-center text-[17px] sm:text-xl text-[#3b5c9a] mt-3">{COMM_TEST.subtitle}</p>

        <ol className="mt-6 space-y-[0.7em] text-[14px] sm:text-[15px] leading-snug">
          {COMM_TEST.instructions.map((ins) => {
            const ticked = ticks.includes(ins.n)
            return (
              <li key={ins.n} id={`ins-${ins.n}`} className="flex gap-2.5">
                <button
                  type="button"
                  disabled={readOnly || tool !== 'read'}
                  onClick={() => onTick?.(ins.n)}
                  aria-pressed={ticked}
                  aria-label={`Tick instruction ${ins.n}`}
                  className={`relative shrink-0 w-7 h-6 -mt-0.5 rounded text-right pr-1 tabular-nums ${tool === 'read' && !readOnly ? 'hover:bg-black/5' : ''}`}
                >
                  {ins.n}.
                  {ticked && <span className="absolute -left-2 -top-2 text-[26px] leading-none" style={{ color: INK, fontFamily: HAND }}>✓</span>}
                </button>
                <span>{ins.text}</span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Ink layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: !readOnly && tool !== 'read' ? 'auto' : 'none', touchAction: tool === 'read' ? 'auto' : 'none', cursor: tool === 'pen' ? 'crosshair' : tool === 'text' ? 'text' : 'default' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      >
        {strokes.map((s, i) => <path key={i} d={path(s)} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />)}
        {live && <path d={path(live)} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>

      {/* Typed handwriting */}
      {texts.map((t, i) => (
        <span key={i} className="absolute pointer-events-none whitespace-nowrap -translate-y-1/2" style={{ left: t.x * w, top: t.y * w, color: INK, fontFamily: HAND, fontSize: Math.max(18, w * 0.038) }}>{t.value}</span>
      ))}
      {editing && (
        <input
          autoFocus
          value={editing.value}
          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
          onBlur={() => commitText()}
          onKeyDown={(e) => { if (e.key === 'Enter') commitText() }}
          className="absolute -translate-y-1/2 bg-[#fff8d6] outline-none border-b-2 px-1 rounded-sm"
          style={{ left: editing.x * w, top: editing.y * w, color: INK, fontFamily: HAND, fontSize: Math.max(18, w * 0.038), borderColor: INK, width: Math.min(w * 0.42, Math.max(120, w * (1 - editing.x) - 8)) }}
          placeholder="write…"
        />
      )}
    </div>
  )
}

function round(n) { return Math.round(n * 1000) / 1000 }
