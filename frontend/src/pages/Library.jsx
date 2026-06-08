import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/authStore'
import SongRow from '../components/SongRow'
import Loading from '../components/Loading'

export default function Library() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const [favorites, setFavorites] = useState([])
  const [tab, setTab] = useState('playlists')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    Promise.all([api.getPlaylists(), api.getFavorites()])
      .then(([p, f]) => { setPlaylists(p); setFavorites(f) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const createPlaylist = async () => {
    if (!newName.trim()) return
    try {
      const pl = await api.createPlaylist(newName, newDesc)
      setPlaylists(prev => [...prev, pl])
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
    } catch {}
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Library</h1>
        <p className="text-surface-400 mb-6">Sign in to see your playlists and favorites</p>
        <button onClick={() => nav('/login')} className="btn-primary">Sign In</button>
      </div>
    )
  }

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Library</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('playlists')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'playlists' ? 'bg-white text-black' : 'bg-surface-800 text-surface-400 hover:text-white'}`}>Playlists</button>
        <button onClick={() => setTab('favorites')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'favorites' ? 'bg-white text-black' : 'bg-surface-800 text-surface-400 hover:text-white'}`}>Favorites</button>
      </div>

      {tab === 'playlists' && (
        <div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-ghost mb-4 border border-dashed border-surface-700">
            + New Playlist
          </button>

          {showCreate && (
            <div className="bg-surface-900 rounded-xl p-4 mb-4 border border-surface-700 space-y-3">
              <input type="text" placeholder="Playlist name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-400 focus:outline-none focus:border-brand-500" />
              <input type="text" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-400 focus:outline-none focus:border-brand-500" />
              <div className="flex gap-2">
                <button onClick={createPlaylist} className="btn-primary text-sm">Create</button>
                <button onClick={() => setShowCreate(false)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {playlists.length === 0 && (
            <p className="text-surface-500 py-10 text-center">No playlists yet</p>
          )}

          <div className="grid gap-3">
            {playlists.map(pl => (
              <div key={pl.id} onClick={() => nav(`/playlist/${pl.id}`)} className="card-hover flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{pl.name}</h3>
                  <p className="text-xs text-surface-400">{pl.song_count} tracks</p>
                </div>
                <svg className="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <p className="text-surface-500 py-10 text-center">No favorites yet. Double-click a song to favorite it!</p>
          ) : (
            <div className="space-y-1">
              {favorites.map(s => <SongRow key={s.id} song={s} queue={favorites} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
