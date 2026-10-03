import { useState } from 'react'
import Header from '../components/layout/Header'
import FlashCardDeck from '../components/flashcard/FlashCardDeck'
import allCards from '../data/flashcards.json'

const categories = ['All', ...new Set(allCards.map((c) => c.category))]

export default function FlashCards({ progressApi }) {
  const { progress, markFlashcard, resetFlashcards } = progressApi
  const [activeCategory, setActiveCategory] = useState('All')
  const [sessionStarted, setSessionStarted] = useState(false)

  const filtered = activeCategory === 'All' ? allCards : allCards.filter((c) => c.category === activeCategory)
  const knownCount = filtered.filter((c) => progress.flashcards[c.id] === 'known').length
  const pct = filtered.length ? Math.round((knownCount / filtered.length) * 100) : 0

  function startSession() {
    const toStudy = filtered.filter((c) => progress.flashcards[c.id] !== 'known')
    if (toStudy.length === 0) return
    setSessionStarted(true)
  }

  const sessionCards = filtered.filter((c) => progress.flashcards[c.id] !== 'known')

  if (sessionStarted && sessionCards.length > 0) {
    return (
      <div>
        <Header title="Flash Cards" subtitle={activeCategory} />
        <div className="pt-4">
          <FlashCardDeck
            cards={sessionCards}
            onCardResult={markFlashcard}
            onComplete={() => setSessionStarted(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Flash Cards" subtitle="Leadership & Mentoring Skills" />
      <div className="p-4 space-y-5">
        {/* Category selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Progress card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-gray-500">Mastered</p>
              <p className="text-3xl font-bold text-[#1e3a5f]">{pct}%</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-gray-800">{knownCount}<span className="text-gray-400 text-base">/{filtered.length}</span></p>
              <p className="text-xs text-gray-500">cards known</p>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#c9a227] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Card list */}
        <div className="space-y-2">
          {filtered.map((card) => {
            const status = progress.flashcards[card.id]
            return (
              <div key={card.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <span className="text-lg flex-shrink-0">
                  {status === 'known' ? '✅' : status === 'review' ? '🔄' : '⬜'}
                </span>
                <p className="text-sm text-gray-700 flex-1">{card.front}</p>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => { resetFlashcards(); setSessionStarted(false) }}
            className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white"
          >
            Reset
          </button>
          <button
            onClick={startSession}
            disabled={sessionCards.length === 0}
            className="flex-1 py-3 rounded-xl bg-[#1e3a5f] text-white font-semibold text-sm disabled:opacity-40"
          >
            {sessionCards.length === 0 ? 'All Mastered!' : `Study ${sessionCards.length} card${sessionCards.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
