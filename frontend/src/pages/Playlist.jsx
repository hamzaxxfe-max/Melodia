import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { usePlayer } from '../store/playerStore'
import { useAuth } from '../store/authStore'
import SongRow from '../components/SongRow'
import Loading from '../components/Loading'

export default function Playlist() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const { play } = usePlayer()

  useEffect(() => {
    if (!user) { nav('/login'); return }
    setLoading(true)
    api.getPlaylist(id).then(setPlaylist).catch(() => nav('/library')).finally(() => setLoading(false))
  }, [id, user, nav])

  const handleDelete = async () => {
    try {
      await api.deletePlaylist(id)
      nav('/library')
    } catch {}
  }

  if (loading) return <Loading />
  if (!playlist) return null

  return (
    <div>
      <div className="flex items-end gap-6 mb-8 pb-8 border-b border-surface-800">
        <div className="w-52 h-52 rounded-2xl bg-gradient-to-br from-brand-500/40 to-surface-800 flex items-center justify-center flex-shrink-0 shadow-2xl">
          <svg className="w-20 h-20 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Playlist</p>
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          {playlist.description && <p className="text-surface-300 mb-3">{playlist.description}</p>}
          <p className="text-sm text-surface-400">{playlist.song_count} tracks</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        {playlist.songs.length > 0 && (
          <button onClick={() => play(playlist.songs[0], playlist.songs)} className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Play
          </button>
        )}
        <button onClick={handleDelete} className="btn-ghost text-red-400 hover:text-red-300 hover:bg-surface-800">
          Delete
        </button>
      </div>

      {playlist.songs.length === 0 ? (
        <div className="text-center py-20 text-surface-500">
          <p className="text-lg">This playlist is empty</p>
          <p className="text-sm mt-2">Search for songs and add them from the player</p>
        </div>
      ) : (
        <div className="space-y-1">
          {playlist.songs.map(s => <SongRow key={s.id} song={s} queue={playlist.songs} />)}
        </div>
      )}
    </div>
  )
}
