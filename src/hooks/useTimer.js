import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(seconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const reset = useCallback((s) => setTimeLeft(s ?? seconds), [seconds])

  useEffect(() => {
    setTimeLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current?.()
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft])

  return { timeLeft, reset }
}
