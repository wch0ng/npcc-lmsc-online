import { useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortItem({ id, label, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 text-sm font-medium select-none ${
        isDragging ? 'border-[#1e3a5f] shadow-lg z-10' : 'border-gray-200'
      } ${disabled ? 'opacity-60' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <span className="text-gray-400 text-lg">≡</span>
      {label}
    </div>
  )
}

export default function SortOrder({ question, onAnswer, disabled }) {
  const [items, setItems] = useState(() => [...question.items].sort(() => Math.random() - 0.5))
  const [submitted, setSubmitted] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    setItems((prev) => {
      const from = prev.indexOf(active.id)
      const to = prev.indexOf(over.id)
      return arrayMove(prev, from, to)
    })
  }

  function handleSubmit() {
    if (submitted || disabled) return
    setSubmitted(true)
    const correct = JSON.stringify(items) === JSON.stringify(question.answer)
    onAnswer(correct ? question.answer[0] : '__wrong__')
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortItem key={item} id={item} label={item} disabled={submitted || disabled} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!submitted && !disabled && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[#1e3a5f] text-white font-semibold text-sm"
        >
          Submit Order
        </button>
      )}

      {submitted && (
        <div className="space-y-1 text-xs text-gray-500">
          <p className="font-semibold">Correct order:</p>
          {question.answer.map((a, i) => (
            <p key={i}>{i + 1}. {a}</p>
          ))}
        </div>
      )}
    </div>
  )
}
