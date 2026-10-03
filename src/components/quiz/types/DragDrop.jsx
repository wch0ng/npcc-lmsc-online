import { useState } from 'react'
import { DndContext, useDroppable, useDraggable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'

function DraggableItem({ id, label, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled })
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` } : {}

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-3 py-2 rounded-lg border-2 text-xs font-medium select-none ${
        isDragging
          ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-xl z-50'
          : 'border-gray-300 bg-white text-gray-700'
      } ${disabled ? 'opacity-50' : 'cursor-grab active:cursor-grabbing'}`}
    >
      {label}
    </div>
  )
}

function DropZone({ id, label, items, submitted, question }) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded-xl border-2 p-3 min-h-[120px] transition-colors ${
        isOver ? 'border-[#1e3a5f] bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50'
      }`}
    >
      <p className="text-xs font-bold text-[#1e3a5f] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(({ id: itemId, label: itemLabel }) => {
          const correctZone = question.items.find((i) => i.id === itemId)?.zone
          const isCorrect = correctZone === label
          return (
            <div
              key={itemId}
              className={`px-3 py-2 rounded-lg text-xs font-medium ${
                submitted
                  ? isCorrect
                    ? 'bg-green-100 border-2 border-green-400 text-green-800'
                    : 'bg-red-100 border-2 border-red-400 text-red-800'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              {itemLabel}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DragDrop({ question, onAnswer, disabled }) {
  const [unplaced, setUnplaced] = useState(question.items.map((i) => ({ id: i.id, label: i.label })))
  const [zones, setZones] = useState(Object.fromEntries(question.zones.map((z) => [z, []])))
  const [submitted, setSubmitted] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  function handleDragEnd({ active, over }) {
    if (!over || submitted) return
    const itemId = active.id
    const targetZone = over.id

    const item = unplaced.find((i) => i.id === itemId)
      || Object.values(zones).flat().find((i) => i.id === itemId)

    if (!item) return

    // Remove from current location
    setUnplaced((prev) => prev.filter((i) => i.id !== itemId))
    setZones((prev) => {
      const next = {}
      for (const z of question.zones) next[z] = prev[z].filter((i) => i.id !== itemId)
      if (targetZone === 'unplaced') return next
      next[targetZone] = [...next[targetZone], item]
      return next
    })
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = question.items.every((item) => zones[item.zone]?.some((i) => i.id === item.id))
    onAnswer(correct ? question.items[0].label : '__wrong__')
  }

  const allPlaced = unplaced.length === 0

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {/* Unplaced items */}
        {unplaced.length > 0 && (
          <div id="unplaced" className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-xl min-h-[60px]">
            {unplaced.map((item) => (
              <DraggableItem key={item.id} id={item.id} label={item.label} disabled={submitted || disabled} />
            ))}
          </div>
        )}

        {/* Drop zones */}
        <div className="flex gap-3">
          {question.zones.map((zone) => (
            <DropZone
              key={zone}
              id={zone}
              label={zone}
              items={zones[zone]}
              submitted={submitted}
              question={question}
            />
          ))}
        </div>
      </DndContext>

      {!submitted && !disabled && allPlaced && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[#1e3a5f] text-white font-semibold text-sm"
        >
          Submit
        </button>
      )}
      {!submitted && !allPlaced && (
        <p className="text-xs text-center text-gray-400">Drag each item into the correct category</p>
      )}
    </div>
  )
}
