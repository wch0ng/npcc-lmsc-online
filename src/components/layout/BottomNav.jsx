import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/flashcards', label: 'Cards', icon: '🃏' },
  { to: '/quiz', label: 'Quiz', icon: '📝' },
  { to: '/cases', label: 'Cases', icon: '📚' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-20 safe-area-pb">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5 transition-colors ` +
            (isActive ? 'text-[#1e3a5f] font-semibold' : 'text-gray-400')
          }
        >
          <span className="text-xl leading-none">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
