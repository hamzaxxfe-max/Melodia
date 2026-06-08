import { useState } from 'react'
import { usePlayer } from '../store/playerStore'
import { useAuth } from '../store/authStore'
import { api } from '../lib/api'

function fmt(s) {
  if (!s) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function SongRow({ song, queue, onFavChange }) {
  const { play, currentSong, isPlaying } = usePlayer()
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)

  const isActive = currentSong?.id === song.id

  const handlePlay = (e) => {
    e.stopPropagation()
    play(song, queue)
  }

  const toggleFav = async (e) => {
    e.stopPropagation()
    if (!user) return
    try {
      if (liked) { await api.removeFavorite(song.id); setLiked(false) }
      else { await api.addFavorite(song.id); setLiked(true) }
      onFavChange?.()
    } catch {}
  }

  return (
    <div
      className={`group grid grid-cols-[40px_1fr_1fr_80px_80px] items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-surface-800/60'}`}
      onDoubleClick={() => play(song, queue)}
    >
      <div className="relative flex items-center justify-center">
        <span className={`group-hover:hidden ${isActive ? 'hidden' : ''}`}>{queue ? queue.findIndex(s => s.id === song.id) + 1 : ''}</span>
        <button onClick={handlePlay} className="hidden group-hover:flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
        {isActive && <span className="absolute group-hover:hidden text-brand-400">♫</span>}
      </div>
      <div className="flex items-center gap-3 min-w-0">
        <img src={song.image_url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isActive ? 'text-brand-400' : 'text-white'}`}>{song.title}</p>
          <p className="text-xs text-surface-400 truncate">{song.artist}</p>
        </div>
      </div>
      <p className="text-sm text-surface-400 truncate">{song.album_title || '-'}</p>
      <div className="flex items-center justify-end gap-2">
        {user && (
          <button onClick={toggleFav} className="text-surface-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
            <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>
        )}
      </div>
      <p className="text-sm text-surface-400 text-right">{fmt(song.duration)}</p>
    </div>
  )
}
