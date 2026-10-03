import { useState } from 'react'
import { Navigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, MessageSquareQuote, Sparkles, GraduationCap, Info, ChevronDown, ArrowRight } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { VAK_QUESTIONS, VAK_STYLES, VAK_GUIDE_INTRO, VAK_GUIDE_NOTES, OPTION_STYLE, analyseVak } from '../../data/vak'
import { VAK_THEME } from '../../components/vakTheme'
import { Page, PageHeader, Button, SectionLabel } from '../../components/ui'

const HEADLINE = {
  strong: (p) => `A strong ${VAK_STYLES[p.primary].name} learner`,
  clear: (p) => `Mostly ${VAK_STYLES[p.primary].name}`,
  blend: (p) => `${VAK_STYLES[p.blend[0]].name}–${VAK_STYLES[p.blend[1]].name} blend`,
  even: () => 'An even mix of all three',
}

const SUMMARY = {
  strong: 'You have a very strong preference for one style.',
  clear: 'You have a clear main preference, as part of a blend of all three.',
  blend: 'Your learning style is a blend of two styles. Read about both below.',
  even: 'You have a fairly even mixture of all three styles, which is less common.',
}

export default function VakResult() {
  const { progress } = useProgress()
  const [params] = useSearchParams()
  const idx = Number(params.get('i') ?? 0)
  const result = progress.vak[idx]
  const [filter, setFilter] = useState(null)
  if (!result) return <Navigate to="/activities/vak" replace />

  const { counts, answers } = result
  const p = analyseVak(counts)
  const isNew = params.get('new') === '1'
  const others = ['v', 'a', 'k'].filter((s) => !p.blend.includes(s))

  return (
    <Page>
      <PageHeader back="/activities/vak" eyebrow={`VAK result · ${new Date(result.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`} title="Your learning style" />

      {/* Hero result */}
      <motion.section
        initial={isNew ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="card overflow-hidden"
      >
        <div className="p-5 sm:p-6">
          <div className="flex gap-2">
            {p.blend.map((s) => {
              const Icon = VAK_THEME[s].icon
              return <span key={s} className={`grid place-items-center h-12 w-12 rounded-xl ${VAK_THEME[s].solid}`}><Icon size={24} /></span>
            })}
          </div>
          <h2 className="display uppercase text-4xl sm:text-5xl mt-4">{HEADLINE[p.strength](p)}</h2>
          <p className="text-muted mt-2">{SUMMARY[p.strength]}</p>

          {/* Breakdown bars */}
          <div className="mt-6 space-y-3">
            {p.order.map((s, n) => {
              const Icon = VAK_THEME[s].icon
              const pct = Math.round((counts[s] / 30) * 100)
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className={`grid place-items-center h-8 w-8 shrink-0 rounded-lg ${VAK_THEME[s].soft}`}><Icon size={16} /></span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{VAK_STYLES[s].name} <span className="text-faint font-normal">({VAK_STYLES[s].option}’s)</span></span>
                      <span className="tabular-nums text-muted"><b className="text-ink">{counts[s]}</b> / 30</span>
                    </div>
                    <div className="h-3 mt-1 rounded-full bg-surface-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full" style={{ background: VAK_THEME[s].hex }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.15 * n, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="border-t border-line bg-surface-2/60 px-5 py-3 text-sm text-muted">
          {VAK_GUIDE_INTRO.map((l) => <p key={l}>{l}</p>)}
        </div>
      </motion.section>

      {/* Detailed feedback for each style in the profile */}
      <SectionLabel className="mt-9">Feedback from the VAK Guide</SectionLabel>
      <div className="space-y-4">
        {p.blend.map((s) => <StyleCard key={s} s={s} open />)}
      </div>

      {others.length > 0 && (
        <>
          <SectionLabel className="mt-8">Your other style{others.length > 1 ? 's' : ''}</SectionLabel>
          <div className="space-y-3">
            {others.map((s) => <StyleCard key={s} s={s} />)}
          </div>
        </>
      )}

      {/* Guide notes */}
      <section className="card p-5 mt-8 space-y-3 text-[15px] leading-relaxed">
        <p><b>No right or wrong.</b> {VAK_GUIDE_NOTES.noRightOrWrong}</p>
        <p>{VAK_GUIDE_NOTES.blend}</p>
        <p>{VAK_GUIDE_NOTES.why}</p>
        <p className="flex gap-2 text-sm text-muted pt-1"><Info size={16} className="shrink-0 mt-0.5" />{VAK_GUIDE_NOTES.disclaimer}</p>
      </section>

      {/* Teaching others: link back to Lesson Planning */}
      <section className="card p-5 mt-4 bg-navy! text-on-navy border-navy!">
        <p className="eyebrow text-gold flex items-center gap-2"><GraduationCap size={16} /> When you plan a lesson</p>
        <p className="mt-2 text-[15px] leading-relaxed">Your cadets have learning styles too. A lesson that <b>shows</b> (demonstration), <b>tells</b> (explanation) and lets them <b>do</b> (practice) reaches visual, auditory and kinesthetic learners alike. That’s why MOI includes all three.</p>
        <Link to="/learn/lesson-planning" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold">Lesson Planning module <ArrowRight size={16} /></Link>
      </section>

      {/* Answer review */}
      <SectionLabel className="mt-9">Your answers</SectionLabel>
      <div className="flex gap-2 mb-3 flex-wrap">
        <FilterChip active={!filter} onClick={() => setFilter(null)}>All 30</FilterChip>
        {['v', 'a', 'k'].map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)} cls={VAK_THEME[s]}>{VAK_STYLES[s].name} · {counts[s]}</FilterChip>
        ))}
      </div>
      <ol className="card divide-y divide-line overflow-hidden">
        {VAK_QUESTIONS.map((q, n) => {
          const a = answers[n]
          const s = OPTION_STYLE[a]
          if (filter && s !== filter) return null
          return (
            <li key={n} className="flex gap-3 px-4 py-3">
              <span className="display text-xl text-faint w-6 shrink-0">{n + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted">{q.q}</p>
                <p className="font-medium text-[15px] mt-0.5">{q[a]}</p>
              </div>
              <span className={`self-center shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${VAK_THEME[s].soft}`}>{VAK_STYLES[s].letter}</span>
            </li>
          )
        })}
      </ol>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button to="/activities/vak/run?fresh=1" variant="ghost" className="flex-1"><RotateCcw size={18} /> Retake questionnaire</Button>
        <Button to="/activities" className="flex-1">More activities <ArrowRight size={18} /></Button>
      </div>
    </Page>
  )
}

function FilterChip({ active, onClick, children, cls }) {
  return (
    <button onClick={onClick} className={`rounded-full px-3 py-1.5 text-sm font-semibold border transition ${active ? (cls ? `${cls.solid} border-transparent` : 'bg-navy text-on-navy border-navy') : 'border-line text-muted hover:text-ink'}`}>
      {children}
    </button>
  )
}

function StyleCard({ s, open: initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen)
  const st = VAK_STYLES[s]
  const th = VAK_THEME[s]
  const Icon = th.icon
  return (
    <section className={`card overflow-hidden border-l-4 ${th.border}`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 p-5 text-left" aria-expanded={open}>
        <span className={`grid place-items-center h-10 w-10 rounded-xl ${th.soft}`}><Icon size={20} /></span>
        <span className="flex-1">
          <span className={`eyebrow ${th.text}`}>Mostly {st.option}’s</span>
          <span className="block display uppercase text-2xl leading-none mt-0.5">{st.name} learner</span>
        </span>
        <ChevronDown size={20} className={`text-faint transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-5">
          <p className="text-[15px] leading-relaxed">{st.guide}</p>

          <div>
            <p className="eyebrow text-muted flex items-center gap-1.5"><MessageSquareQuote size={14} /> You might say</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {st.phrases.map((ph) => <span key={ph} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${th.soft}`}>“{ph}”</span>)}
            </div>
          </div>

          <div>
            <p className="eyebrow text-muted">You learn best through</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {st.learnsBest.map((x) => <span key={x} className="rounded-lg border border-line px-2.5 py-1 text-sm">{x}</span>)}
            </div>
          </div>

          <div className="rounded-xl bg-surface-2 p-4">
            <p className="eyebrow text-muted flex items-center gap-1.5"><Sparkles size={14} /> Study tips</p>
            <ul className="mt-2 space-y-1.5">
              {st.tips.map((t) => <li key={t} className="flex gap-2 text-[15px]"><span className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0`} style={{ background: th.hex }} />{t}</li>)}
            </ul>
            <p className="text-sm text-muted mt-3"><b className="text-ink">As a Cadet Leader:</b> {st.asLeader}</p>
          </div>
        </div>
      )}
    </section>
  )
}
