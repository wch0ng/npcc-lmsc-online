import { Navigate, useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Camera, RotateCcw, Home } from 'lucide-react'
import { useProgress } from '../../hooks/useProgress'
import { ALL_QUESTIONS } from '../../data/final'
import { moduleById } from '../../data/modules'
import { VAK_STYLES, analyseVak } from '../../data/vak'
import Logo from '../../components/Logo'
import Watermark from '../../components/Watermark'
import { Ring, Button } from '../../components/ui'

// Built to fit one phone screen so students can screenshot it for submission.
export default function FinalResult() {
  const { progress } = useProgress()
  const [params] = useSearchParams()
  const r = (progress.final ?? [])[Number(params.get('i') ?? 0)]
  if (!r) return <Navigate to="/final" replace />

  const { modules, activities, scenarios } = r.snapshot
  const pct = Math.round((r.score / r.total) * 100)
  const modsDone = modules.filter((m) => m.done).length
  const actsDone = activities.filter((a) => a.done).length
  const scenDone = scenarios.reduce((n, g) => n + g.done, 0)
  const scenTotal = scenarios.reduce((n, g) => n + g.total, 0)
  const when = new Date(r.date).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="mx-auto w-full max-w-md px-3 pb-16 safe-top">
      {/* ── Submission card (screenshot area) ── */}
      <div className="mt-3 card overflow-hidden">
        <div className="bg-navy text-on-navy px-4 py-3 flex items-center gap-3">
          <Logo size={38} className="ring-1 ring-white/15" />
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-gold text-[10px]!">Final Quiz · Completion record</p>
            <p className="display uppercase text-xl leading-tight truncate">{r.name}</p>
            <p className="text-xs text-on-navy/75">Squad {r.squad} · Attempt {r.attempt}</p>
          </div>
          <Ring value={r.score} max={r.total} size={62} stroke={6}>
            <span className="text-on-navy text-sm font-bold">{pct}%</span>
          </Ring>
        </div>

        <div className="px-4 py-2.5 flex items-center justify-between border-b border-line text-sm">
          <span><b className="text-lg">{r.score}</b><span className="text-muted">/{r.total} correct</span></span>
          <span className="text-xs text-muted text-right">{when}</span>
        </div>

        <Section title="Modules" count={`${modsDone}/${modules.length}`} complete={modsDone === modules.length}>
          <div className="space-y-1">
            {modules.map((m) => <Item key={m.id} done={m.done} label={`${m.num}. ${m.title}`} detail={m.done ? 'Read' : 'Not read'} />)}
          </div>
        </Section>

        <Section title="Activities" count={`${actsDone}/${activities.length}`} complete={actsDone === activities.length}>
          <div className="space-y-1">
            {activities.map((a) => (
              <Item key={a.id} done={a.done} label={a.title}
                detail={a.id === 'vak' && a.counts ? analyseVak(a.counts).blend.map((s) => VAK_STYLES[s].name).join(' + ') : a.detail} />
            ))}
          </div>
        </Section>

        <Section title="Scenarios" count={`${scenDone}/${scenTotal}`} complete={scenDone === scenTotal}>
          <div className="space-y-1">
            {scenarios.map((g) => <Item key={g.id} done={g.done === g.total} label={g.title} detail={`${g.done}/${g.total}`} />)}
          </div>
        </Section>

        <p className="px-4 py-2 text-[10px] text-faint text-center border-t border-line">HS NPCC · Leadership &amp; Mentoring Skills Course 2026 · lmsc2026.hsnpcc.com</p>
      </div>

      <p className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gold-soft px-3 py-2 text-sm font-semibold">
        <Camera size={16} /> Take a screenshot of this page to submit
      </p>

      {/* ── Below the screenshot area ── */}
      <div className="mt-10">
        <p className="eyebrow text-muted mb-1">Review your answers</p>
        <p className="text-xs text-faint mb-3">Watermarked with your name. Don’t share these answers.</p>
        <Watermark className="card rounded-[1.25rem]" lines={[`${r.name} · ${r.squad}`, `Attempt ${r.attempt} · ${new Date(r.date).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`]}>
        <ol className="divide-y divide-line">
          {r.answers.map((a, n) => {
            const q = ALL_QUESTIONS[a.id]
            if (!q) return null
            return (
              <li key={a.id} className="flex gap-3 p-3.5">
                {a.ok ? <CheckCircle2 size={18} className="text-good shrink-0 mt-0.5" /> : <XCircle size={18} className="text-bad shrink-0 mt-0.5" />}
                <div>
                  <p className="text-sm font-medium">{n + 1}. {q.question}</p>
                  {!a.ok && <p className="text-xs text-muted mt-1">{q.explanation}</p>}
                  <p className="text-[11px] text-faint mt-0.5">{moduleById[q.module].title}</p>
                </div>
              </li>
            )
          })}
        </ol>
        </Watermark>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" to="/final" className="flex-1"><RotateCcw size={18} /> Final quiz</Button>
          <Button to="/" className="flex-1"><Home size={18} /> Home</Button>
        </div>
        <p className="mt-3 text-center text-xs text-faint">
          Missing something? Complete it, then <Link to="/final" className="underline">retake the final quiz</Link> for an updated record.
        </p>
      </div>
    </div>
  )
}

function Section({ title, count, complete, children }) {
  return (
    <div className="px-4 py-2.5 border-b border-line last:border-b-0">
      <div className="flex items-center justify-between mb-1.5">
        <p className="eyebrow text-[11px]! text-ink">{title}</p>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${complete ? 'bg-good-soft text-good' : 'bg-surface-2 text-muted'}`}>{count}{complete ? ' ✓' : ''}</span>
      </div>
      {children}
    </div>
  )
}

function Item({ done, label, detail }) {
  return (
    <div className="flex items-center gap-1.5 text-[12.5px] leading-tight min-w-0">
      {done ? <CheckCircle2 size={14} className="text-good shrink-0" /> : <XCircle size={14} className="text-bad shrink-0" />}
      <span className={`flex-1 truncate ${done ? '' : 'text-muted'}`}>{label}</span>
      {detail && <span className={`shrink-0 text-[11px] ${done ? 'text-good font-semibold' : 'text-faint'}`}>{detail}</span>}
    </div>
  )
}
