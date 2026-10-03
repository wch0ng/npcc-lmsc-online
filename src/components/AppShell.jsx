import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Home, BookOpen, Target, Sparkles } from 'lucide-react'
import Logo from './Logo'

const TABS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/activities', label: 'Activities', icon: Sparkles },
]

export default function AppShell() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  // Full-screen experiences hide the tab bar so nothing competes with them.
  const immersive = /^\/activities\/(vak|comm-test)\/run/.test(pathname) || /^\/final\/(run|result)/.test(pathname)

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Desktop / tablet top bar */}
      <header className="hidden md:block sticky top-0 z-30 bg-navy text-on-navy safe-top">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-3">
            <Logo size={36} className="ring-1 ring-white/15" />
            <span className="display text-xl uppercase tracking-wide">NPCC · LMSC</span>
          </NavLink>
          <nav className="flex gap-1 ml-auto">
            {TABS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to} to={to} end={to === '/'}
                className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-white/12 text-gold' : 'text-on-navy/75 hover:text-on-navy'}`}
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      {/* Mobile tab bar */}
      {!immersive && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-line safe-bottom">
          <div className="flex">
            {TABS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to} to={to} end={to === '/'}
                className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold tracking-wide transition ${isActive ? 'text-ink' : 'text-faint'}`}
              >
                {({ isActive }) => (
                  <>
                    <span className={`grid place-items-center h-7 w-12 rounded-full transition ${isActive ? 'bg-gold-soft text-ink' : ''}`}>
                      <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
