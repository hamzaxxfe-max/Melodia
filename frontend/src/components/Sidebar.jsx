import { NavLink } from 'react-router-dom'
import { useAuth } from '../store/authStore'

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/library', label: 'Library', icon: '📚' },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="w-64 h-full flex flex-col bg-surface-950 border-r border-surface-800/50">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-brand-400">Melodia</span>
        </h1>
        <p className="text-surface-500 text-xs mt-1">Music Streaming</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="text-lg">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="p-4 border-t border-surface-800/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium truncate">{user.username}</span>
          </div>
        </div>
      )}
    </aside>
  )
}
