import { useNavigate } from 'react-router-dom'

export default function AlbumCard({ album }) {
  const nav = useNavigate()

  return (
    <div className="card-hover group" onClick={() => nav(`/album/${album.id}`)}>
      <div className="relative mb-4">
        <img src={album.image_url} alt={album.title} className="w-full aspect-square rounded-xl object-cover shadow-lg" />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-400 hover:scale-105">
          <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <h3 className="font-semibold text-sm truncate">{album.title}</h3>
      <p className="text-xs text-surface-400 truncate mt-1">{album.artist}</p>
      <p className="text-xs text-surface-500 mt-1">{album.song_count} tracks · {album.release_year}</p>
    </div>
  )
}
