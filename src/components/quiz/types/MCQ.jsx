import { useState } from 'react'

export default function MCQ({ question, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null)

  function handleSelect(opt) {
    if (disabled || selected) return
    setSelected(opt)
    onAnswer(opt)
  }

  return (
    <div className="space-y-3">
      {question.options.map((opt) => {
        const isSelected = selected === opt
        const isCorrect = opt === question.answer
        let style = 'border-gray-200 bg-white text-gray-800'
        if (disabled && selected) {
          if (isCorrect) style = 'border-green-400 bg-green-50 text-green-800'
          else if (isSelected) style = 'border-red-400 bg-red-50 text-red-800'
        } else if (isSelected) {
          style = 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
        }

        return (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={disabled && !!selected}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${style}`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
