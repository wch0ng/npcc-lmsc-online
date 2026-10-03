import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export function Page({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-3xl px-4 sm:px-6 pb-28 md:pb-16 ${className}`}>{children}</div>
}

// Section heading used at the top of every page: eyebrow + condensed display title.
export function PageHeader({ eyebrow, title, subtitle, back, right }) {
  const navigate = useNavigate()
  return (
    <header className="pt-6 pb-5 safe-top">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {back && (
            <button
              onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))}
              className="-ml-1 mb-2 inline-flex items-center gap-0.5 text-sm font-medium text-muted hover:text-ink"
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}
          {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
          <h1 className="display text-4xl sm:text-5xl text-ink mt-1 uppercase">{title}</h1>
          {subtitle && <p className="mt-2 text-muted text-[15px] leading-relaxed max-w-prose">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  )
}

const BTN = {
  primary: 'bg-navy text-on-navy hover:bg-navy-2',
  gold: 'bg-gold text-navy hover:brightness-105',
  ghost: 'bg-transparent text-ink border border-line hover:bg-surface-2',
  soft: 'bg-surface-2 text-ink hover:brightness-95',
}

export function Button({ variant = 'primary', className = '', to, children, ...rest }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${BTN[variant]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}

export function Bar({ value, max = 100, color = 'var(--gold)', className = '' }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={`h-1.5 rounded-full bg-surface-2 overflow-hidden ${className}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function Ring({ value, max = 100, size = 56, stroke = 6, color = 'var(--gold)', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = max ? Math.min(1, value / max) : 0
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold">{children}</div>
    </div>
  )
}

export function Chip({ children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>
}

export function SectionLabel({ children, className = '' }) {
  return <h2 className={`eyebrow text-muted mb-3 ${className}`}>{children}</h2>
}

// Inline two-step confirm (the PWA may run where window.confirm is unavailable).
export function ConfirmButton({ label, confirmLabel = 'Tap again to confirm', onConfirm, className = '' }) {
  return (
    <button
      className={className}
      onClick={(e) => {
        const el = e.currentTarget
        if (el.dataset.armed) { onConfirm(); el.textContent = label; delete el.dataset.armed; return }
        el.dataset.armed = '1'
        el.textContent = confirmLabel
        setTimeout(() => { if (el.isConnected) { el.textContent = label; delete el.dataset.armed } }, 3000)
      }}
    >
      {label}
    </button>
  )
}
