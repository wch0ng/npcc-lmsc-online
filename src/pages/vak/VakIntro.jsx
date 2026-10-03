import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MousePointerClick, ListOrdered } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { VAK_QUESTIONS, VAK_STYLES, analyseVak } from '../../data/vak'
import { VAK_THEME } from '../../components/vakTheme'
import { Page, PageHeader, Button, SectionLabel } from '../../components/ui'
import { loadDraft } from './draft'

export default function VakIntro() {
  const { progress } = useProgress()
  const draft = loadDraft()
  const answered = draft ? draft.filter(Boolean).length : 0

  return (
    <Page>
      <PageHeader back="/activities" eyebrow="Activity · Lesson Planning" title="VAK Questionnaire" subtitle="Learning Styles Self-Assessment. Discover whether you learn best by seeing, listening or doing." />

      <div className="grid grid-cols-3 gap-3">
        {['v', 'a', 'k'].map((k) => {
          const Icon = VAK_THEME[k].icon
          return (
            <div key={k} className={`rounded-2xl p-4 ${VAK_THEME[k].soft}`}>
              <Icon size={22} />
              <p className="display text-xl uppercase mt-3 leading-none">{VAK_STYLES[k].name}</p>
              <p className="text-xs mt-1 opacity-80">{VAK_STYLES[k].by}</p>
            </div>
          )
        })}
      </div>

      <div className="card p-5 mt-5 space-y-4">
        <Row icon={MousePointerClick} title="Pick the answer that most represents how you generally behave." text="Go with your first instinct. There are no right or wrong answers." />
        <Row icon={ListOrdered} title={`${VAK_QUESTIONS.length} questions, three options each`} text="You can go back and change an answer at any time." />
        <Row icon={Clock} title="About 10 minutes" text="Your answers are saved on this device as you go." />
      </div>
      <p className="text-sm text-muted mt-4 px-1">Tip from the questionnaire: it’s best to complete it <b>before</b> reading the explanation of each style.</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button to="/activities/vak/run" className="flex-1" variant="primary">
          {answered > 0 ? `Resume (${answered}/${VAK_QUESTIONS.length})` : 'Begin questionnaire'} <ArrowRight size={18} />
        </Button>
        {answered > 0 && <Button to="/activities/vak/run?fresh=1" variant="ghost" className="flex-1">Start over</Button>}
      </div>

      {progress.vak.length > 0 && (
        <>
          <SectionLabel className="mt-10">Your past results</SectionLabel>
          <div className="card divide-y divide-line overflow-hidden">
            {progress.vak.map((r, i) => {
              const p = analyseVak(r.counts)
              return (
                <Link key={r.date} to={`/activities/vak/result?i=${i}`} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-2">
                  <MiniBars counts={r.counts} />
                  <span className="flex-1">
                    <span className="block font-semibold">{p.blend.map((s) => VAK_STYLES[s].name).join(' + ')}</span>
                    <span className="block text-xs text-muted">{new Date(r.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </span>
                  <ArrowRight size={16} className="text-faint" />
                </Link>
              )
            })}
          </div>
        </>
      )}
    </Page>
  )
}

function Row({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-surface-2 text-ink"><Icon size={18} /></span>
      <div><p className="font-semibold text-[15px]">{title}</p><p className="text-sm text-muted">{text}</p></div>
    </div>
  )
}

export function MiniBars({ counts }) {
  return (
    <span className="flex items-end gap-1 h-8">
      {['v', 'a', 'k'].map((k) => (
        <span key={k} className="w-2.5 rounded-sm" style={{ height: `${Math.max(8, (counts[k] / 30) * 100)}%`, background: VAK_THEME[k].hex }} />
      ))}
    </span>
  )
}
