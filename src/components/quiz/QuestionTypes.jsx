import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Check, X, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '../ui'

function shuffle(a) {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] }
  return x
}

const optBase = 'w-full text-left rounded-xl border-2 px-4 py-3.5 text-[15px] font-medium transition'

// ── Multiple choice ─────────────────────────────────────────
export function MCQ({ q, onSubmit, locked }) {
  const [pick, setPick] = useState(null)
  const [opts] = useState(() => shuffle(q.options))
  return (
    <div className="space-y-2.5">
      {opts.map((o) => {
        let cls = 'border-line bg-surface hover:border-faint'
        if (locked) {
          if (o === q.answer) cls = 'border-good bg-good-soft'
          else if (o === pick) cls = 'border-bad bg-bad-soft'
          else cls = 'border-line bg-surface opacity-50'
        }
        return (
          <button key={o} disabled={locked} onClick={() => { setPick(o); onSubmit(o === q.answer) }} className={`${optBase} ${cls} flex items-center gap-3`}>
            <span className="flex-1">{o}</span>
            {locked && o === q.answer && <Check size={18} className="text-good" />}
            {locked && o === pick && o !== q.answer && <X size={18} className="text-bad" />}
          </button>
        )
      })}
    </div>
  )
}

// ── Put in order (drag, or use the arrows) ──────────────────
function SortRow({ id, index, locked, correct, onMove, count }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: locked })
  const state = locked ? (correct ? 'border-good bg-good-soft' : 'border-bad bg-bad-soft') : isDragging ? 'border-gold bg-surface shadow-card z-10 relative' : 'border-line bg-surface'
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`flex items-center gap-2 rounded-xl border-2 pl-2 pr-1 py-1.5 ${state}`}>
      <span {...attributes} {...listeners} className={`p-1.5 text-faint touch-none ${locked ? '' : 'cursor-grab'}`} aria-label="Drag to reorder"><GripVertical size={18} /></span>
      <span className="display text-xl text-gold w-5">{index + 1}</span>
      <span className="flex-1 text-[15px] font-medium py-1.5">{id}</span>
      {!locked && (
        <span className="flex flex-col">
          <button onClick={() => onMove(index, -1)} disabled={index === 0} className="p-0.5 text-muted disabled:opacity-20" aria-label="Move up"><ChevronUp size={18} /></button>
          <button onClick={() => onMove(index, 1)} disabled={index === count - 1} className="p-0.5 text-muted disabled:opacity-20" aria-label="Move down"><ChevronDown size={18} /></button>
        </span>
      )}
    </div>
  )
}

export function Order({ q, onSubmit, locked }) {
  const [items, setItems] = useState(() => {
    let s = shuffle(q.answer)
    while (s.every((x, i) => x === q.answer[i])) s = shuffle(q.answer)
    return s
  })
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const move = (i, d) => setItems((x) => arrayMove(x, i, i + d))
  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) setItems((x) => arrayMove(x, x.indexOf(active.id), x.indexOf(over.id)))
      }}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((it, i) => <SortRow key={it} id={it} index={i} count={items.length} locked={locked} correct={q.answer[i] === it} onMove={move} />)}
          </div>
        </SortableContext>
      </DndContext>
      {!locked && <Button className="w-full" onClick={() => onSubmit(items.every((x, i) => x === q.answer[i]))}>Check order</Button>}
      {locked && !items.every((x, i) => x === q.answer[i]) && (
        <div className="rounded-xl bg-surface-2 p-3 text-sm">
          <p className="font-semibold mb-1">Correct order</p>
          <ol className="list-decimal pl-5 space-y-0.5">{q.answer.map((a) => <li key={a}>{a}</li>)}</ol>
        </div>
      )}
    </div>
  )
}

// ── Matching (tap a term, then its partner) ─────────────────
export function Match({ q, onSubmit, locked }) {
  const [defs] = useState(() => shuffle(q.pairs.map((p) => p.definition)))
  const [sel, setSel] = useState(null) // term index
  const [map, setMap] = useState({}) // termIndex -> definition
  const used = new Set(Object.values(map))
  const complete = Object.keys(map).length === q.pairs.length

  function pickDef(d) {
    if (locked || sel === null) return
    setMap((m) => {
      const next = Object.fromEntries(Object.entries(m).filter(([, v]) => v !== d))
      next[sel] = d
      return next
    })
    const nextFree = q.pairs.findIndex((_, i) => i !== sel && map[i] === undefined)
    setSel(nextFree === -1 ? null : nextFree)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {q.pairs.map((p, i) => {
          const chosen = map[i]
          const ok = chosen === p.definition
          const cls = locked ? (ok ? 'border-good bg-good-soft' : 'border-bad bg-bad-soft') : sel === i ? 'border-gold bg-gold-soft' : 'border-line bg-surface'
          return (
            <button key={p.term} disabled={locked} onClick={() => setSel(i)} className={`${optBase} ${cls} py-2.5`}>
              <span className="block font-bold">{p.term}</span>
              <span className={`block text-sm ${chosen ? '' : 'text-faint'}`}>{chosen ?? (sel === i ? 'Now tap a description below…' : 'Tap to choose a description')}</span>
              {locked && !ok && <span className="block text-sm text-good font-semibold mt-0.5">✓ {p.definition}</span>}
            </button>
          )
        })}
      </div>
      {!locked && (
        <>
          <p className="eyebrow text-muted">Descriptions</p>
          <div className="flex flex-wrap gap-2">
            {defs.map((d) => (
              <button key={d} onClick={() => pickDef(d)} disabled={sel === null}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${used.has(d) ? 'border-line text-faint line-through decoration-1' : 'border-navy-2/40 bg-surface hover:bg-surface-2'} disabled:opacity-60`}>
                {d}
              </button>
            ))}
          </div>
          <Button className="w-full" disabled={!complete} onClick={() => onSubmit(q.pairs.every((p, i) => map[i] === p.definition))}>Check matches</Button>
        </>
      )}
    </div>
  )
}

// ── Sort into groups (tap an item, then a group) ────────────
export function SortGroups({ q, onSubmit, locked }) {
  const [items] = useState(() => shuffle(q.items))
  const [place, setPlace] = useState({}) // itemId -> zone
  const [sel, setSel] = useState(null)
  const unplaced = items.filter((it) => !place[it.id])

  function drop(zone) {
    if (locked || !sel) return
    setPlace((p) => ({ ...p, [sel]: zone }))
    const next = unplaced.find((it) => it.id !== sel)
    setSel(next ? next.id : null)
  }

  return (
    <div className="space-y-4">
      <div className="min-h-12 flex flex-wrap gap-2">
        {unplaced.map((it) => (
          <button key={it.id} onClick={() => setSel(it.id)} className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition ${sel === it.id ? 'border-gold bg-gold-soft' : 'border-line bg-surface'}`}>{it.label}</button>
        ))}
        {!unplaced.length && !locked && <p className="text-sm text-muted self-center">All placed. Tap an item in a group to move it.</p>}
      </div>
      <div className={`grid gap-2 ${q.zones.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {q.zones.map((z) => (
          <button key={z} onClick={() => drop(z)} disabled={locked}
            className={`rounded-xl border-2 border-dashed p-2.5 min-h-36 text-left align-top transition flex flex-col ${sel && !locked ? 'border-gold bg-gold-soft/40' : 'border-line bg-surface-2/50'}`}>
            <span className="eyebrow text-ink text-[11px] mb-2">{z}</span>
            <span className="flex flex-col gap-1.5">
              {items.filter((it) => place[it.id] === z).map((it) => {
                const ok = it.zone === z
                return (
                  <span key={it.id}
                    onClick={(e) => { if (locked) return; e.stopPropagation(); setPlace((p) => { const n = { ...p }; delete n[it.id]; return n }); setSel(it.id) }}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold ${locked ? (ok ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad') : 'bg-surface border border-line'}`}>
                    {it.label}{locked && !ok && <span className="block font-normal">→ {it.zone}</span>}
                  </span>
                )
              })}
            </span>
          </button>
        ))}
      </div>
      {!locked && <Button className="w-full" disabled={unplaced.length > 0} onClick={() => onSubmit(items.every((it) => place[it.id] === it.zone))}>Check groups</Button>}
    </div>
  )
}
