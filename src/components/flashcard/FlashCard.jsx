import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

export default function FlashCard({ card, onKnow, onReview }) {
  const [flipped, setFlipped] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const knowOpacity = useTransform(x, [0, 100], [0, 1])
  const reviewOpacity = useTransform(x, [-100, 0], [1, 0])

  function handleDragEnd(_, info) {
    if (info.offset.x > 100) {
      animate(x, 400, { duration: 0.3 }).then(onKnow)
    } else if (info.offset.x < -100) {
      animate(x, -400, { duration: 0.3 }).then(onReview)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 })
    }
  }

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: 320 }}>
      {/* Swipe hint labels */}
      <motion.div
        style={{ opacity: reviewOpacity }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10 pointer-events-none"
      >
        Review
      </motion.div>
      <motion.div
        style={{ opacity: knowOpacity }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10 pointer-events-none"
      >
        Know!
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, opacity }}
        onDragEnd={handleDragEnd}
        className="perspective absolute w-11/12 cursor-grab active:cursor-grabbing"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`transform-style-3d relative transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}
          style={{ height: 280 }}
        >
          {/* Front */}
          <div className="backface-hidden absolute inset-0 bg-white rounded-2xl shadow-lg flex flex-col justify-between p-6 select-none">
            <span className="text-xs font-semibold text-[#c9a227] tracking-wider uppercase">{card.category}</span>
            <p className="text-xl font-semibold text-[#1e3a5f] text-center leading-snug">{card.front}</p>
            <p className="text-xs text-gray-400 text-center">Tap to flip • Swipe to answer</p>
          </div>
          {/* Back */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 bg-[#1e3a5f] rounded-2xl shadow-lg flex flex-col justify-center p-6 select-none">
            <p className="text-base text-white text-center leading-relaxed">{card.back}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
