export default function QuizExplanation({ correct, explanation, onNext, isLast }) {
  return (
    <div className={`rounded-2xl p-5 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{correct ? '✅' : '❌'}</span>
        <p className={`font-semibold text-lg ${correct ? 'text-green-700' : 'text-red-700'}`}>
          {correct ? 'Correct!' : 'Not quite'}
        </p>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">{explanation}</p>
      <button
        onClick={onNext}
        className="w-full py-3 rounded-xl bg-[#1e3a5f] text-white font-semibold text-sm"
      >
        {isLast ? 'See Results' : 'Next Question'}
      </button>
    </div>
  )
}
