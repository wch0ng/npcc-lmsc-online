import { useParams, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, Quote } from 'lucide-react'
import { MODULES, moduleById } from '../data/modules'
import { useProgress } from '../hooks/useProgress'
import { Page, PageHeader, Button } from '../components/ui'

export default function Module() {
  const { id } = useParams()
  const { progress, markModuleRead } = useProgress()
  const m = moduleById[id]
  if (!m) return <Navigate to="/learn" replace />
  const next = MODULES[m.num] // num is 1-based, so this is the following module
  const done = progress.modules[m.id]

  return (
    <Page>
      <PageHeader back="/learn" eyebrow={`Module ${m.num} of ${MODULES.length}`} title={m.title} subtitle={m.tagline} />

      <div className="card p-5 bg-navy! text-on-navy border-navy!">
        <p className="eyebrow text-gold">Objectives</p>
        <ul className="mt-2 space-y-1.5">
          {m.objectives.map((o) => (
            <li key={o} className="flex gap-2 text-[15px]"><Check size={18} className="text-gold shrink-0 mt-0.5" />{o}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-5">
        {m.sections.map((s, i) => <Block key={i} s={s} />)}
      </div>

      {m.activity && (
        <Link to={m.activity.to} className="mt-6 card p-5 flex items-center justify-between bg-gold-soft! border-gold/40!">
          <span>
            <span className="eyebrow text-ink/70">Activity</span>
            <span className="block display text-2xl uppercase">{m.activity.label}</span>
          </span>
          <ArrowRight />
        </Link>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button onClick={() => markModuleRead(m.id)} variant={done ? 'soft' : 'primary'} className="flex-1" disabled={done}>
          <Check size={18} /> {done ? 'Marked as read' : 'Mark as read'}
        </Button>
        {next && (
          <Button to={`/learn/${next.id}`} variant="ghost" className="flex-1">
            Next: {next.title} <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </Page>
  )
}

function H({ children }) {
  return <h2 className="display uppercase text-[1.6rem] mb-3">{children}</h2>
}

function Block({ s }) {
  switch (s.type) {
    case 'part':
      return (
        <div className="flex items-center gap-3 pt-4">
          <span className="eyebrow text-gold">{s.label}</span>
          <h2 className="display uppercase text-3xl">{s.title}</h2>
          <span className="flex-1 h-px bg-line" />
        </div>
      )
    case 'quote':
      return (
        <figure className="px-1 py-2">
          <Quote className="text-gold" size={28} />
          <blockquote className="display text-2xl sm:text-3xl normal-case leading-tight mt-2 font-semibold!">{s.text}</blockquote>
          {s.by && <figcaption className="mt-2 text-sm text-muted">— {s.by}</figcaption>}
        </figure>
      )
    case 'text':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <p className="text-[15px] leading-relaxed">{s.text}</p>
        </section>
      )
    case 'points':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <ul className="space-y-2.5">
            {s.points.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] leading-relaxed"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />{p}</li>
            ))}
          </ul>
        </section>
      )
    case 'chips':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <div className="flex flex-wrap gap-2">
            {s.items.map((c) => <span key={c} className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm font-medium">{c}</span>)}
          </div>
        </section>
      )
    case 'steps':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <ol className="space-y-3">
            {s.steps.map((p, i) => (
              <li key={p} className="flex gap-3 items-start">
                <span className="grid place-items-center h-7 w-7 shrink-0 rounded-full bg-navy text-gold text-sm font-bold">{i + 1}</span>
                <span className="text-[15px] leading-relaxed pt-0.5">{p}</span>
              </li>
            ))}
          </ol>
        </section>
      )
    case 'flow':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            {s.steps.map((p, i) => (
              <div key={p} className="flex flex-col sm:flex-row items-center gap-2 flex-1">
                <div className={`w-full text-center rounded-xl px-3 py-3 text-sm font-semibold ${i === 1 ? 'bg-gold-soft' : 'bg-navy text-on-navy'}`}>{p}</div>
                {i < s.steps.length - 1 && <ArrowRight size={18} className="text-gold rotate-90 sm:rotate-0 shrink-0" />}
              </div>
            ))}
          </div>
          <p className="text-[15px] leading-relaxed mt-4">{s.text}</p>
        </section>
      )
    case 'acrostic':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          {s.intro && <p className="text-sm text-muted mb-3">{s.intro}</p>}
          <div className="space-y-2">
            {s.items.map(([l, t]) => (
              <div key={l} className="flex items-center gap-4">
                <span className="display text-4xl w-8 text-gold">{l}</span>
                <span className="text-[15px] font-medium">{t}</span>
              </div>
            ))}
          </div>
        </section>
      )
    case 'compare':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            <div className="eyebrow text-good">{s.left}</div>
            <div className="eyebrow text-bad">{s.right}</div>
            {s.rows.map(([a, b]) => (
              <div key={a} className="contents">
                <div className="rounded-lg bg-good-soft px-3 py-2 font-medium">{a}</div>
                <div className="rounded-lg bg-bad-soft px-3 py-2 font-medium">{b}</div>
              </div>
            ))}
          </div>
        </section>
      )
    case 'terms':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <div className="divide-y divide-line -mx-5">
            {s.items.map((t, i) => <TermRow key={t.term} t={t} n={s.numbered ? i + 1 : null} />)}
          </div>
        </section>
      )
    case 'table':
      return (
        <section className="card p-5">
          <H>{s.heading}</H>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm border-collapse min-w-[30rem]">
              <thead>
                <tr>{s.cols.map((c, i) => <th key={i} className="text-left eyebrow text-muted pb-2 pr-3">{c}</th>)}</tr>
              </thead>
              <tbody>
                {s.rows.map((r) => (
                  <tr key={r[0]} className="border-t border-line align-top">
                    {r.map((c, i) => <td key={i} className={`py-2.5 pr-3 ${i === 0 ? 'font-bold whitespace-nowrap' : ''}`}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )
    default:
      return null
  }
}

// Tap-to-expand row, so long lists stay scannable on a phone.
function TermRow({ t, n }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 px-5 py-3 text-left" aria-expanded={open}>
        {n && <span className="display text-2xl text-gold w-5">{n}</span>}
        <span className="flex-1 font-semibold">{t.term}</span>
        <ChevronDown size={18} className={`text-faint transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="px-5 pb-4 space-y-1.5">
          {t.def.map((d) => (
            <li key={d} className="flex gap-2.5 text-[15px] text-muted leading-relaxed"><span className="mt-2 h-1 w-1 rounded-full bg-muted shrink-0" />{d}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
