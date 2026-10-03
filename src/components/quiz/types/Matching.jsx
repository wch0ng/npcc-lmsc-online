import { useState } from 'react'

export default function Matching({ question, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null)   // { side: 'term'|'def', index }
  const [matches, setMatches] = useState({})        // { termIndex: defIndex }
  const [submitted, setSubmitted] = useState(false)

  const terms = question.pairs.map((p) => p.term)
  const [shuffledPairs] = useState(() => [...question.pairs].sort(() => Math.random() - 0.5))
  const defs = shuffledPairs.map((p) => p.definition)

  const matchedTermIndices = Object.keys(matches).map(Number)
  const matchedDefIndices = Object.values(matches).map(Number)

  function handleTerm(i) {
    if (submitted || disabled) return
    if (selected?.side === 'term' && selected.index === i) { setSelected(null); return }
    if (selected?.side === 'def') {
      makeMatch(i, selected.index)
    } else {
      setSelected({ side: 'term', index: i })
    }
  }

  function handleDef(i) {
    if (submitted || disabled) return
    if (selected?.side === 'def' && selected.index === i) { setSelected(null); return }
    if (selected?.side === 'term') {
      makeMatch(selected.index, i)
    } else {
      setSelected({ side: 'def', index: i })
    }
  }

  function makeMatch(termIdx, defIdx) {
    setMatches((prev) => {
      const next = { ...prev }
      // remove previous pairings
      Object.keys(next).forEach((k) => { if (next[k] === defIdx) delete next[k] })
      next[termIdx] = defIdx
      return next
    })
    setSelected(null)
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = question.pairs.every((pair, ti) => {
      const di = matches[ti]
      return di !== undefined && defs[di] === pair.definition
    })
    onAnswer(correct ? question.pairs[0].term : '__wrong__')
  }

  function getTermStyle(i) {
    const isSelected = selected?.side === 'term' && selected.index === i
    const isMatched = matchedTermIndices.includes(i)
    if (submitted) {
      const matchedDef = defs[matches[i]]
      const correct = matchedDef === question.pairs[i].definition
      return correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
    }
    if (isSelected) return 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
    if (isMatched) return 'border-[#c9a227] bg-amber-50'
    return 'border-gray-200 bg-white'
  }

  function getDefStyle(i) {
    const isSelected = selected?.side === 'def' && selected.index === i
    const isMatched = matchedDefIndices.includes(i)
    if (submitted) {
      const termIdx = Object.keys(matches).find((k) => matches[k] === i)
      if (termIdx === undefined) return 'border-gray-200 bg-white opacity-50'
      const correct = defs[i] === question.pairs[Number(termIdx)].definition
      return correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
    }
    if (isSelected) return 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
    if (isMatched) return 'border-[#c9a227] bg-amber-50'
    return 'border-gray-200 bg-white'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Terms</p>
          {terms.map((term, i) => (
            <button
              key={i}
              onClick={() => handleTerm(i)}
              className={`w-full text-left px-3 py-3 rounded-xl border-2 text-xs font-medium transition-colors ${getTermStyle(i)}`}
            >
              {term}
              {matches[i] !== undefined && !submitted && (
                <span className="ml-1 text-[#c9a227]">•</span>
              )}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Definitions</p>
          {defs.map((def, i) => (
            <button
              key={i}
              onClick={() => handleDef(i)}
              className={`w-full text-left px-3 py-3 rounded-xl border-2 text-xs font-medium transition-colors ${getDefStyle(i)}`}
            >
              {def}
            </button>
          ))}
        </div>
      </div>

      {!submitted && !disabled && matchedTermIndices.length === terms.length && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[#1e3a5f] text-white font-semibold text-sm"
        >
          Submit Matches
        </button>
      )}

      {!submitted && matchedTermIndices.length < terms.length && (
        <p className="text-xs text-center text-gray-400">
          Tap a term, then tap its matching definition
        </p>
      )}
    </div>
  )
}
