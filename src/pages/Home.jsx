import { Link } from 'react-router-dom'
import { ArrowRight, Timer, BookOpen, Layers, ListChecks, Target } from 'lucide-react'
import { VAK_THEME } from '../components/vakTheme'
import { useProgress } from '../hooks/useProgress'
import { MODULES } from '../data/modules'
import { FLASHCARDS } from '../data/flashcards'
import { VAK_STYLES, analyseVak } from '../data/vak'
import { Page, Ring, SectionLabel, ConfirmButton } from '../components/ui'

export default function Home() {
  const { progress, resetAll } = useProgress()
  const read = MODULES.filter((m) => progress.modules[m.id]).length
  const known = FLASHCARDS.filter((c) => progress.flashcards[c.id] === 'known').length
  const best = progress.quiz.length ? Math.max(...progress.quiz.map((r) => Math.round((r.score / r.total) * 100))) : null
  const next = MODULES.find((m) => !progress.modules[m.id]) ?? MODULES[0]
  const vak = progress.vak[0]
  const vakProfile = vak && analyseVak(vak.counts)
  const comm = progress.commtest[0]
  const goals = progress.goals ?? []

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-on-navy safe-top relative overflow-hidden">
        <div aria-hidden className="absolute -right-16 -top-10 h-64 w-64 rounded-full border-[28px] border-gold/15" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 pb-14 relative">
          <p className="eyebrow text-gold">National Police Cadet Corps</p>
          <h1 className="display uppercase text-[3.2rem] sm:text-6xl mt-5">
            Leadership &amp;<br />Mentoring Skills
          </h1>
          <p className="mt-3 text-on-navy/75 max-w-md">Your course companion: six modules, practice drills, and three hands-on activities.</p>
          <Link to={`/learn/${next.id}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold text-navy font-semibold px-5 py-3 active:scale-[0.98] transition">
            {read === 0 ? 'Start module 1' : read === MODULES.length ? 'Review modules' : `Continue: ${next.title}`} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Page className="-mt-6 relative">
        {/* Progress strip */}
        <div className="card p-4 grid grid-cols-3 divide-x divide-line">
          <Stat to="/learn" icon={BookOpen} value={`${read}/${MODULES.length}`} label="Modules read" ring={[read, MODULES.length]} />
          <Stat to="/practice/flashcards" icon={Layers} value={`${known}/${FLASHCARDS.length}`} label="Cards known" ring={[known, FLASHCARDS.length]} />
          <Stat to="/practice/quiz" icon={ListChecks} value={best === null ? '—' : `${best}%`} label="Best quiz" ring={[best ?? 0, 100]} />
        </div>

        {/* Activities */}
        <SectionLabel className="mt-9">Activities</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to={vak ? '/activities/vak/result' : '/activities/vak'} className="card p-5 group hover:-translate-y-0.5 transition">
            <div className="flex gap-1.5">
              {['v', 'a', 'k'].map((k) => {
                const Icon = VAK_THEME[k].icon
                return <span key={k} className={`grid place-items-center h-9 w-9 rounded-lg ${VAK_THEME[k].soft}`}><Icon size={18} /></span>
              })}
            </div>
            <h3 className="display text-2xl uppercase mt-4">VAK Questionnaire</h3>
            {vakProfile ? (
              <p className="text-sm text-muted mt-1">
                Your style: <b className="text-ink">{vakProfile.blend.map((s) => VAK_STYLES[s].name).join(' + ')}</b> · see feedback
              </p>
            ) : (
              <p className="text-sm text-muted mt-1">30 quick questions to discover how you learn best.</p>
            )}
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">{vak ? 'View my result' : 'Start'} <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" /></span>
          </Link>

          <Link to="/activities/comm-test" className="card p-5 group hover:-translate-y-0.5 transition">
            <span className="grid place-items-center h-9 w-9 rounded-lg bg-gold-soft text-ink"><Timer size={18} /></span>
            <h3 className="display text-2xl uppercase mt-4">2½ Minutes Test</h3>
            {comm ? (
              <p className="text-sm text-muted mt-1">Last attempt: <b className="text-ink">{comm.passed ? 'Good receiver ✓' : 'Caught out'}</b></p>
            ) : (
              <p className="text-sm text-muted mt-1">Are you a good receiver? A timed communication challenge.</p>
            )}
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">{comm ? 'Try again' : 'Start'} <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" /></span>
          </Link>

          <Link to="/activities/goals" className="card p-5 group hover:-translate-y-0.5 transition sm:col-span-2">
            <span className="grid place-items-center h-9 w-9 rounded-lg bg-gold-soft text-ink"><Target size={18} /></span>
            <h3 className="display text-2xl uppercase mt-4">SMART Goal Setting</h3>
            <p className="text-sm text-muted mt-1">
              {goals.length ? <>You have <b className="text-ink">{goals.length}</b> goal{goals.length > 1 ? 's' : ''}, with <b className="text-ink">{goals.filter((g) => g.status === 'achieved').length}</b> achieved.</> : 'Set a personal goal and a squad goal, the SMART way.'}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">{goals.length ? 'View my goals' : 'Start'} <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" /></span>
          </Link>
        </div>

        {/* Module list */}
        <SectionLabel className="mt-9">Course modules</SectionLabel>
        <ol className="card divide-y divide-line overflow-hidden">
          {MODULES.map((m) => (
            <li key={m.id}>
              <Link to={`/learn/${m.id}`} className="flex items-center gap-4 px-4 py-3.5 hover:bg-surface-2 transition">
                <span className={`display text-2xl w-7 text-center ${progress.modules[m.id] ? 'text-gold' : 'text-faint'}`}>{m.num}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold">{m.title}</span>
                  <span className="block text-sm text-muted truncate">{m.tagline}</span>
                </span>
                {progress.modules[m.id] && <span className="text-xs font-semibold text-good">Read</span>}
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <ConfirmButton label="Reset all progress" confirmLabel="Tap again to erase everything" onConfirm={resetAll} className="text-xs text-faint underline underline-offset-4" />
        </div>
      </Page>
    </div>
  )
}

function Stat({ to, icon: Icon, value, label, ring }) {
  return (
    <Link to={to} className="flex flex-col items-center text-center gap-2 px-1">
      <Ring value={ring[0]} max={ring[1]} size={44} stroke={5}><Icon size={16} className="text-muted" /></Ring>
      <span className="display text-2xl leading-none">{value}</span>
      <span className="text-[11px] font-medium text-muted leading-tight">{label}</span>
    </Link>
  )
}
