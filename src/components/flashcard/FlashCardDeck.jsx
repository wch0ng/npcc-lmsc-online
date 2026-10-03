import { useState, useEffect } from 'react'
import FlashCard from './FlashCard'

export default function FlashCardDeck({ cards, onCardResult, onComplete }) {
  const [queue, setQueue] = useState(cards)
  const [known, setKnown] = useState(0)
  const [reviewed, setReviewed] = useState(0)
  const [done, setDone] = useState(false)

  const current = queue[0]

  function handleKnow() {
    onCardResult(current.id, 'known')
    const newKnown = known + 1
    setKnown(newKnown)
    const next = queue.slice(1)
    setQueue(next)
    if (next.length === 0) setDone(true)
  }

  function handleReview() {
    onCardResult(current.id, 'review')
    const newReviewed = reviewed + 1
    setReviewed(newReviewed)
    const next = queue.slice(1)
    setQueue(next)
    if (next.length === 0) setDone(true)
  }

  if (done || queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Session Complete!</h2>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">{known}</p>
            <p className="text-sm text-gray-500">Knew it</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-500">{reviewed}</p>
            <p className="text-sm text-gray-500">To review</p>
          </div>
        </div>
        <button
          onClick={onComplete}
          className="px-6 py-3 rounded-xl bg-[#1e3a5f] text-white font-semibold text-sm"
        >
          Back to Deck
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="px-4 flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1e3a5f] rounded-full transition-all"
            style={{ width: `${((cards.length - queue.length) / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{cards.length - queue.length}/{cards.length}</span>
      </div>

      <FlashCard card={current} onKnow={handleKnow} onReview={handleReview} />

      <div className="flex gap-4 px-6 mt-2">
        <button
          onClick={handleReview}
          className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm active:bg-red-50"
        >
          Review Later
        </button>
        <button
          onClick={handleKnow}
          className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm active:bg-green-600"
        >
          I Know It!
        </button>
      </div>
    </div>
  )
}
