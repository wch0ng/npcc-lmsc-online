export default function QuizTimer({ timeLeft, total }) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const pct = timeLeft / total
  const dash = circumference * pct
  const isUrgent = timeLeft <= 5

  return (
    <div className="flex items-center gap-2">
      <svg width="60" height="60" className="-rotate-90">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" />
        <circle
          cx="30" cy="30" r={radius}
          fill="none"
          stroke={isUrgent ? '#ef4444' : '#1e3a5f'}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`text-2xl font-bold tabular-nums ${isUrgent ? 'text-red-500' : 'text-[#1e3a5f]'}`}>
        {timeLeft}s
      </span>
    </div>
  )
}
