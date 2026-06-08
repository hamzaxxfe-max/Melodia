import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { usePlayer } from '../store/playerStore'
import SongRow from '../components/SongRow'
import Loading from '../components/Loading'

export default function Album() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const { play } = usePlayer()

  useEffect(() => {
    setLoading(true)
    api.getAlbum(id).then(setAlbum).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (!album) return <div className="text-center py-20 text-surface-400">Album not found</div>

  const totalDuration = album.songs.reduce((acc, s) => acc + s.duration, 0)
  const minutes = Math.floor(totalDuration / 60)

  return (
    <div>
      <div className="flex items-end gap-6 mb-8 pb-8 border-b border-surface-800">
        <img src={album.image_url} alt={album.title} className="w-52 h-52 rounded-2xl object-cover shadow-2xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Album</p>
          <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
          <p className="text-lg text-surface-300 mb-3">{album.artist}</p>
          <p className="text-sm text-surface-400">{album.release_year} · {album.song_count} tracks · {minutes} min</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => play(album.songs[0], album.songs)} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          Play
        </button>
      </div>

      <div className="space-y-1">
        {album.songs.map(s => <SongRow key={s.id} song={s} queue={album.songs} />)}
      </div>
    </div>
  )
}
