import { Link } from 'react-router-dom'
import { ArrowRight, Timer, Target } from 'lucide-react'
import { SMART_STEPS } from '../data/goals'
import { useProgress } from '../hooks/useProgress'
import { VAK_STYLES, analyseVak } from '../data/vak'
import { VAK_THEME } from '../components/vakTheme'
import { MiniBars } from './vak/VakIntro'
import { Page, PageHeader } from '../components/ui'

export default function Activities() {
  const { progress } = useProgress()
  const vak = progress.vak[0]
  const comm = progress.commtest[0]
  const goals = progress.goals ?? []

  return (
    <Page>
      <PageHeader eyebrow="Hands-on" title="Activities" subtitle="Course activities, digitalised. Do them on your own or in class." />

      <div className="space-y-5">
        <Link to="/activities/vak" className="card block overflow-hidden group">
          <div className="grid grid-cols-3 h-24">
            {['v', 'a', 'k'].map((k) => {
              const Icon = VAK_THEME[k].icon
              return (
                <div key={k} className={`flex items-end justify-between p-3 ${VAK_THEME[k].soft}`}>
                  <span className="display uppercase text-lg leading-none">{VAK_STYLES[k].name}</span>
                  <Icon size={22} />
                </div>
              )
            })}
          </div>
          <div className="p-5">
            <p className="eyebrow text-gold">Lesson Planning · 10 min</p>
            <h2 className="display uppercase text-3xl mt-1">VAK Learning Styles Questionnaire</h2>
            <p className="text-muted mt-1">30 questions about how you behave. Then see your Visual, Auditory and Kinesthetic breakdown, with feedback from the VAK Guide.</p>
            <div className="mt-4 flex items-center justify-between">
              {vak ? (
                <span className="flex items-center gap-3 text-sm">
                  <MiniBars counts={vak.counts} />
                  <span>Last result: <b>{analyseVak(vak.counts).blend.map((s) => VAK_STYLES[s].name).join(' + ')}</b></span>
                </span>
              ) : <span className="text-sm text-faint">Not taken yet</span>}
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        <Link to="/activities/comm-test" className="card block overflow-hidden group">
          <div className="h-24 bg-navy text-on-navy flex items-center justify-between px-5">
            <span className="display text-6xl text-gold">2½</span>
            <Timer size={40} className="opacity-70" />
          </div>
          <div className="p-5">
            <p className="eyebrow text-gold">Effective Communication · 2½ min</p>
            <h2 className="display uppercase text-3xl mt-1">Are you a good receiver?</h2>
            <p className="text-muted mt-1">A timed test paper you can write, draw and tick on, followed by a guided debrief.</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-faint">{comm ? `${progress.commtest.length} attempt${progress.commtest.length > 1 ? 's' : ''}` : 'Not attempted yet'}</span>
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>
        <Link to="/activities/goals" className="card block overflow-hidden group">
          <div className="h-24 bg-gold-soft grid grid-cols-5">
            {SMART_STEPS.map((s) => (
              <div key={s.key} className="flex flex-col items-center justify-center">
                <span className="display text-4xl text-ink leading-none">{s.letter}</span>
                <span className="text-[10px] font-semibold text-ink/60 mt-0.5">{s.name}</span>
              </div>
            ))}
          </div>
          <div className="p-5">
            <p className="eyebrow text-gold">Basic Teamwork · 10 min</p>
            <h2 className="display uppercase text-3xl mt-1">SMART goal setting</h2>
            <p className="text-muted mt-1">Build a personal goal and a squad goal step by step, then track progress with check-ins.</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-faint flex items-center gap-1.5"><Target size={16} />{goals.length ? `${goals.length} goal${goals.length > 1 ? 's' : ''} · ${goals.filter((g) => g.status === 'achieved').length} achieved` : 'No goals yet'}</span>
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>
      </div>
    </Page>
  )
}
