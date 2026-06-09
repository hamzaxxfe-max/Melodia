import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../store/authStore'

const links = [
  { to: '/', label: 'Home', icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-white' : 'text-surface-400'}`} fill={a ? 'white' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { to: '/search', label: 'Search', icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-white' : 'text-surface-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
  { to: '/library', label: 'Library', icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-white' : 'text-surface-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
]

const svgLogo = <svg className="w-8 h-8 text-brand-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>

export default function Sidebar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)} className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center text-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
      </button>

      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 h-full w-64 flex flex-col bg-surface-950 border-r border-surface-800/50 transition-transform duration-300`}>
        <div className="p-6">
          <div className="flex items-center gap-2">
            {svgLogo}
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-brand-400">Melodia</span>
            </h1>
          </div>
          <p className="text-surface-500 text-xs mt-1">Music Streaming</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              {({ isActive }) => (<>{l.icon(isActive)}<span>{l.label}</span></>)}
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
    </>
  )
}
