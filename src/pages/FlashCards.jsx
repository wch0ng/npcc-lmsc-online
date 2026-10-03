import { useMemo, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Check, RotateCcw, Shuffle, X } from 'lucide-react'
import { FLASHCARDS } from '../data/flashcards'
import { MODULES, moduleById } from '../data/modules'
import { useProgress } from '../hooks/useProgress'
import { Page, PageHeader, Button, Bar, ConfirmButton } from '../components/ui'

function shuffle(a) {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] }
  return x
}

export default function FlashCards() {
  const { progress, markFlashcard, resetFlashcards } = useProgress()
  const [filter, setFilter] = useState('all')
  const [deck, setDeck] = useState(null) // active session queue
  const [tally, setTally] = useState({ known: 0, review: 0 })

  const pool = useMemo(() => {
    if (filter === 'all') return FLASHCARDS
    if (filter === 'review') return FLASHCARDS.filter((c) => progress.flashcards[c.id] !== 'known')
    return FLASHCARDS.filter((c) => c.module === filter)
  }, [filter, progress.flashcards])

  const known = FLASHCARDS.filter((c) => progress.flashcards[c.id] === 'known').length

  function start(random) {
    setDeck(random ? shuffle(pool) : pool)
    setTally({ known: 0, review: 0 })
  }
  function answer(status) {
    markFlashcard(deck[0].id, status)
    setTally((t) => ({ ...t, [status]: t[status] + 1 }))
    setDeck((d) => d.slice(1))
  }

  // Session finished
  if (deck && deck.length === 0) {
    return (
      <Page>
        <PageHeader eyebrow="Flash cards" title="Deck complete" />
        <div className="card p-6 text-center">
          <div className="flex justify-center gap-10">
            <div><p className="display text-6xl text-good">{tally.known}</p><p className="text-sm text-muted">Knew it</p></div>
            <div><p className="display text-6xl text-gold">{tally.review}</p><p className="text-sm text-muted">To review</p></div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {tally.review > 0 && <Button className="flex-1" onClick={() => { setFilter('review'); setDeck(null) }}>Review the tricky ones</Button>}
            <Button variant="ghost" className="flex-1" onClick={() => setDeck(null)}>Back to decks</Button>
          </div>
        </div>
      </Page>
    )
  }

  // Active session
  if (deck) {
    const total = tally.known + tally.review + deck.length
    const done = total - deck.length
    return (
      <Page>
        <PageHeader eyebrow="Flash cards" title={filter === 'all' ? 'All cards' : filter === 'review' ? 'To review' : moduleById[filter].title}
          right={<button onClick={() => setDeck(null)} className="mt-7 grid place-items-center h-10 w-10 rounded-full hover:bg-surface-2" aria-label="End session"><X /></button>} />
        <div className="flex items-center gap-3 mb-4">
          <Bar value={done} max={total} className="flex-1" />
          <span className="text-sm text-muted tabular-nums">{done}/{total}</span>
        </div>
        <div className="relative h-[22rem]">
          {deck.slice(0, 2).reverse().map((c, i, arr) => (
            <Card key={c.id} card={c} top={i === arr.length - 1} onKnow={() => answer('known')} onReview={() => answer('review')} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button variant="ghost" onClick={() => answer('review')} className="border-gold! text-ink"><RotateCcw size={18} /> Review later</Button>
          <Button onClick={() => answer('known')} className="bg-good! text-white!"><Check size={18} /> I know it</Button>
        </div>
        <p className="text-center text-xs text-faint mt-3">Tap the card to flip · swipe right if you know it, left to review</p>
      </Page>
    )
  }

  // Deck picker
  const filters = [
    { id: 'all', label: `All · ${FLASHCARDS.length}` },
    { id: 'review', label: `Not yet known · ${FLASHCARDS.length - known}` },
    ...MODULES.map((m) => ({ id: m.id, label: m.title })),
  ]
  return (
    <Page>
      <PageHeader back="/practice" eyebrow="Practice" title="Flash cards" subtitle={`${known} of ${FLASHCARDS.length} cards marked as known.`} />
      <Bar value={known} max={FLASHCARDS.length} className="mb-6" color="var(--good)" />
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`rounded-full px-3.5 py-2 text-sm font-semibold border transition ${filter === f.id ? 'bg-navy text-on-navy border-navy' : 'border-line text-muted hover:text-ink bg-surface'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="card p-5 mt-6">
        <p className="display uppercase text-2xl">{pool.length} card{pool.length !== 1 && 's'}</p>
        <p className="text-sm text-muted">{pool.length ? 'Ready when you are.' : 'Nothing here. Every card in this set is known!'}</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" disabled={!pool.length} onClick={() => start(false)}>Start in order</Button>
          <Button variant="ghost" className="flex-1" disabled={!pool.length} onClick={() => start(true)}><Shuffle size={18} /> Shuffle</Button>
        </div>
      </div>
      <div className="mt-8 text-center">
        <ConfirmButton label="Reset flash-card progress" onConfirm={resetFlashcards} className="text-xs text-faint underline underline-offset-4" />
      </div>
    </Page>
  )
}

function Card({ card, top, onKnow, onReview }) {
  const [flipped, setFlipped] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-14, 14])
  const knowO = useTransform(x, [20, 110], [0, 1])
  const reviewO = useTransform(x, [-110, -20], [1, 0])
  const mod = moduleById[card.module]

  function end(_, info) {
    if (info.offset.x > 110) animate(x, 500, { duration: 0.25 }).then(onKnow)
    else if (info.offset.x < -110) animate(x, -500, { duration: 0.25 }).then(onReview)
    else animate(x, 0, { type: 'spring', stiffness: 320, damping: 26 })
  }

  return (
    <motion.div
      drag={top ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.9}
      style={{ x, rotate }} onDragEnd={end}
      initial={top ? false : { scale: 0.95, y: 12 }} animate={{ scale: top ? 1 : 0.95, y: top ? 0 : 12 }}
      className={`absolute inset-0 perspective ${top ? 'cursor-grab active:cursor-grabbing z-10' : 'pointer-events-none'}`}
      onTap={() => top && setFlipped((f) => !f)}
    >
      <div className={`relative h-full preserve-3d transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}>
        <div className="backface-hidden absolute inset-0 card p-6 flex flex-col ruled">
          <p className="eyebrow text-gold">Module {mod.num} · {mod.title}</p>
          <p className="display text-[2.1rem] leading-tight my-auto text-center normal-case font-semibold!">{card.front}</p>
          <p className="text-xs text-faint text-center">Tap to flip</p>
        </div>
        <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-[1.25rem] bg-navy text-on-navy p-6 flex flex-col">
          <p className="eyebrow text-gold">Answer</p>
          <p className="text-lg leading-relaxed my-auto text-center">{card.back}</p>
        </div>
      </div>
      <motion.span style={{ opacity: knowO }} className="absolute top-5 right-5 rounded-lg border-2 border-good text-good bg-surface px-2 py-0.5 display uppercase text-xl rotate-6 z-10">Know it</motion.span>
      <motion.span style={{ opacity: reviewO }} className="absolute top-5 left-5 rounded-lg border-2 border-gold text-gold bg-surface px-2 py-0.5 display uppercase text-xl -rotate-6 z-10">Review</motion.span>
    </motion.div>
  )
}
