import { useNavigate } from 'react-router-dom'

export default function Header({ title, subtitle }) {
  const nav = useNavigate()

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex gap-2">
        <button onClick={() => nav(-1)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <button onClick={() => nav(1)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
        </button>
      </div>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-surface-400 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
