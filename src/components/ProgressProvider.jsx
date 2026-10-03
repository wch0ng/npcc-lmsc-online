import { useState, useCallback } from 'react'
import { ProgressContext } from '../hooks/useProgress'

const KEY = 'npcc_lmsc_v2'

const defaults = () => ({
  modules: {},     // { [moduleId]: true } — module marked as read
  flashcards: {},  // { [cardId]: 'known' | 'review' }
  quiz: [],        // [{ date, score, total }] newest first
  scenarios: {},   // { [scenarioId]: { notes: {[promptId]: string}, done } }
  vak: [],         // [{ date, answers: ['a'|'b'|'c' …30], counts: {v,a,k} }] newest first
  commtest: [],    // [{ date, …result }] newest first
  final: [],       // [{ date, name, squad, score, total, answers: [{id, ok}], snapshot }] newest first
  profile: {},     // { name, squad } remembered for the final quiz
  goals: [],       // [{ id, type, title, squad, s, m, a, r, t, deadline, roles, status, checkins: [{date, note}], created, updated }]
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...defaults(), ...JSON.parse(raw) } : defaults()
  } catch {
    return defaults()
  }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* storage unavailable: keep in memory */ }
}

function useProgressState() {
  const [progress, setProgress] = useState(load)

  const update = useCallback((updater) => {
    setProgress((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const api = {
    progress,
    markModuleRead: useCallback((id) => update((p) => ({ ...p, modules: { ...p.modules, [id]: true } })), [update]),
    markFlashcard: useCallback((id, status) => update((p) => ({ ...p, flashcards: { ...p.flashcards, [id]: status } })), [update]),
    resetFlashcards: useCallback(() => update((p) => ({ ...p, flashcards: {} })), [update]),
    recordQuiz: useCallback((score, total) => update((p) => ({
      ...p, quiz: [{ date: new Date().toISOString(), score, total }, ...p.quiz].slice(0, 30),
    })), [update]),
    saveScenario: useCallback((id, notes, done) => update((p) => ({
      ...p, scenarios: { ...p.scenarios, [id]: { notes, done } },
    })), [update]),
    recordVak: useCallback((answers, counts) => update((p) => ({
      ...p, vak: [{ date: new Date().toISOString(), answers, counts }, ...p.vak].slice(0, 10),
    })), [update]),
    recordCommTest: useCallback((result) => update((p) => ({
      ...p, commtest: [{ date: new Date().toISOString(), ...result }, ...p.commtest].slice(0, 10),
    })), [update]),
    saveCommDebrief: useCallback((index, debrief) => update((p) => ({
      ...p, commtest: p.commtest.map((r, i) => (i === index ? { ...r, debrief } : r)),
    })), [update]),
    saveGoal: useCallback((goal) => update((p) => {
      const g = { ...goal, updated: new Date().toISOString() }
      const exists = p.goals.some((x) => x.id === g.id)
      return { ...p, goals: exists ? p.goals.map((x) => (x.id === g.id ? g : x)) : [g, ...p.goals] }
    }), [update]),
    deleteGoal: useCallback((id) => update((p) => ({ ...p, goals: p.goals.filter((g) => g.id !== id) })), [update]),
    recordFinal: useCallback((attempt) => update((p) => ({
      ...p,
      profile: { name: attempt.name, squad: attempt.squad },
      final: [{ date: new Date().toISOString(), attempt: (p.final?.[0]?.attempt ?? 0) + 1, ...attempt }, ...(p.final ?? [])].slice(0, 20),
    })), [update]),
    resetAll: useCallback(() => { const fresh = defaults(); save(fresh); setProgress(fresh) }, []),
  }
  return api
}

export function ProgressProvider({ children }) {
  const api = useProgressState()
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}
