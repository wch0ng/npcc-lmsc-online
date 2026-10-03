import { useState } from 'react'
import Header from '../components/layout/Header'
import allCases from '../data/casestudies.json'

function MCQQuestion({ q, onAnswer, savedAnswer }) {
  const [selected, setSelected] = useState(savedAnswer ?? null)

  function handleSelect(opt) {
    if (selected) return
    setSelected(opt)
    onAnswer(q.id, opt)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{q.question}</p>
      {q.options.map((opt) => {
        let style = 'border-gray-200 bg-white text-gray-700'
        if (selected) {
          if (opt === q.answer) style = 'border-green-400 bg-green-50 text-green-800'
          else if (opt === selected) style = 'border-red-400 bg-red-50 text-red-800'
        }
        return (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={!!selected}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors ${style}`}
          >
            {opt}
          </button>
        )
      })}
      {selected && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
    </div>
  )
}

function OpenQuestion({ q, onAnswer, savedAnswer }) {
  const [text, setText] = useState(savedAnswer ?? '')
  const [saved, setSaved] = useState(!!savedAnswer)

  function handleSave() {
    setSaved(true)
    onAnswer(q.id, text)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{q.question}</p>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false) }}
        placeholder="Write your response here…"
        rows={4}
        className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
      />
      <button
        onClick={handleSave}
        disabled={!text.trim() || saved}
        className="px-4 py-2 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium disabled:opacity-40"
      >
        {saved ? 'Saved ✓' : 'Save Response'}
      </button>
    </div>
  )
}

function CaseDetail({ cs, savedProgress, onComplete, onBack }) {
  const [answers, setAnswers] = useState(savedProgress?.openAnswers ?? {})

  function handleAnswer(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const allAnswered = cs.questions.every((q) => answers[q.id])

  return (
    <div>
      <Header title={cs.title} subtitle={cs.category} />
      <div className="p-4 space-y-6">
        <button onClick={onBack} className="text-sm text-[#1e3a5f] font-medium">← Back</button>

        {/* Scenario */}
        <div className="bg-[#1e3a5f] rounded-2xl p-5 text-white">
          <p className="text-xs font-semibold text-[#f0c94d] uppercase tracking-wider mb-2">Scenario</p>
          <p className="text-sm leading-relaxed whitespace-pre-line">{cs.scenario}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reflection Questions</p>
          {cs.questions.map((q) =>
            q.type === 'mcq' ? (
              <MCQQuestion key={q.id} q={q} onAnswer={handleAnswer} savedAnswer={answers[q.id]} />
            ) : (
              <OpenQuestion key={q.id} q={q} onAnswer={handleAnswer} savedAnswer={answers[q.id]} />
            )
          )}
        </div>

        {allAnswered && !savedProgress?.completed && (
          <button
            onClick={() => onComplete(cs.id, answers)}
            className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold"
          >
            Mark as Complete
          </button>
        )}

        {savedProgress?.completed && (
          <div className="text-center text-sm text-green-600 font-semibold">✅ Completed</div>
        )}
      </div>
    </div>
  )
}

export default function CaseStudies({ progressApi }) {
  const { progress, markCaseStudy } = progressApi
  const [selected, setSelected] = useState(null)

  if (selected) {
    return (
      <CaseDetail
        cs={selected}
        savedProgress={progress.casestudies[selected.id]}
        onComplete={(id, answers) => {
          markCaseStudy(id, answers)
          setSelected(null)
        }}
        onBack={() => setSelected(null)}
      />
    )
  }

  const completedCount = Object.values(progress.casestudies).filter((c) => c.completed).length

  return (
    <div>
      <Header title="Case Studies" subtitle="Leadership & Mentoring" />
      <div className="p-4 space-y-4">
        {/* Progress summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#1e3a5f]">{completedCount}</p>
            <p className="text-xs text-gray-500">completed</p>
          </div>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a227] rounded-full transition-all"
              style={{ width: `${(completedCount / allCases.length) * 100}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-300">{allCases.length}</p>
            <p className="text-xs text-gray-400">total</p>
          </div>
        </div>

        {/* Case list */}
        {allCases.map((cs) => {
          const done = progress.casestudies[cs.id]?.completed
          return (
            <button
              key={cs.id}
              onClick={() => setSelected(cs)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm text-left flex items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100' : 'bg-[#1e3a5f]/10'}`}>
                <span className="text-xl">{done ? '✅' : '📖'}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{cs.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{cs.category} · {cs.duration} · {cs.questions.length} questions</p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {done ? 'Completed' : 'Not started'}
                </span>
              </div>
              <span className="text-gray-300 text-lg self-center">›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
