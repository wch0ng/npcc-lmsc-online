import { useState, useCallback } from 'react'

const KEY = 'npcc_progress'

const defaultProgress = {
  flashcards: {},   // { [id]: 'known' | 'review' }
  quiz: [],         // [{ date, score, total }]
  casestudies: {},  // { [id]: { completed, openAnswers: { [qId]: string } } }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...defaultProgress, ...JSON.parse(raw) } : { ...defaultProgress }
  } catch {
    return { ...defaultProgress }
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  const update = useCallback((updater) => {
    setProgress((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const markFlashcard = useCallback((id, status) => {
    update((p) => ({
      ...p,
      flashcards: { ...p.flashcards, [id]: status },
    }))
  }, [update])

  const resetFlashcards = useCallback(() => {
    update((p) => ({ ...p, flashcards: {} }))
  }, [update])

  const recordQuizResult = useCallback((score, total) => {
    update((p) => ({
      ...p,
      quiz: [{ date: new Date().toISOString(), score, total }, ...p.quiz].slice(0, 20),
    }))
  }, [update])

  const markCaseStudy = useCallback((id, openAnswers) => {
    update((p) => ({
      ...p,
      casestudies: {
        ...p.casestudies,
        [id]: { completed: true, openAnswers: openAnswers || {} },
      },
    }))
  }, [update])

  const resetAll = useCallback(() => {
    const fresh = { ...defaultProgress }
    save(fresh)
    setProgress(fresh)
  }, [])

  return { progress, markFlashcard, resetFlashcards, recordQuizResult, markCaseStudy, resetAll }
}
