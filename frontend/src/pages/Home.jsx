import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import Header from '../components/Header'
import AlbumCard from '../components/AlbumCard'
import SongRow from '../components/SongRow'
import Loading from '../components/Loading'

export default function Home() {
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getAlbums(), api.getSongs()])
      .then(([a, s]) => { setAlbums(a); setSongs(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <Header title="Home" subtitle="Discover new music" />

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Featured Albums</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map(a => <AlbumCard key={a.id} album={a} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Songs</h2>
          <span className="text-sm text-surface-400">{songs.length} tracks</span>
        </div>
        <div className="space-y-1">
          {songs.map(s => <SongRow key={s.id} song={s} queue={songs} />)}
        </div>
      </section>
    </div>
  )
}
