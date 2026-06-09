import { useRef, useEffect, useCallback } from 'react'
import { usePlayer } from '../store/playerStore'

function fmt(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function Player() {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const { currentSong, isPlaying, volume, progress, duration, togglePlay, playNext, playPrev, setVolume, seek, setAudioRef, setProgress, setDuration, setPlaying, queue } = usePlayer()

  useEffect(() => {
    setAudioRef(audioRef.current)
  }, [setAudioRef])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTime = () => setProgress(el.currentTime)
    const onDur = () => setDuration(el.duration || 0)
    const onEnd = () => playNext()
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onDur)
    el.addEventListener('ended', onEnd)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onDur)
      el.removeEventListener('ended', onEnd)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [setProgress, setDuration, playNext, setPlaying])

  const handleSeek = useCallback((e) => {
    const rect = progressRef.current.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    seek(pct * duration)
  }, [duration, seek])

  if (!currentSong) return null

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0

  return (
    <div className="h-20 bg-surface-900 border-t border-surface-800 px-4 flex items-center gap-4">
      <audio ref={audioRef} preload="metadata" />

      <div className="flex items-center gap-3 w-64">
        <img src={currentSong.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{currentSong.title}</p>
          <p className="text-xs text-surface-400 truncate">{currentSong.artist}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-1">
          <button onClick={playPrev} className="text-surface-400 hover:text-white transition-colors w-11 h-11 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button onClick={togglePlay} className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button onClick={playNext} className="text-surface-400 hover:text-white transition-colors w-11 h-11 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
        <div className="w-full flex items-center gap-2 text-xs text-surface-400">
          <span className="w-8 text-right">{fmt(progress)}</span>
          <div ref={progressRef} className="flex-1 h-1 bg-surface-700 rounded-full cursor-pointer group" onClick={handleSeek}>
            <div className="h-full bg-white rounded-full relative transition-all group-hover:bg-brand-400" style={{ width: `${progressPct}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
            </div>
          </div>
          <span className="w-8">{fmt(duration)}</span>
        </div>
      </div>

      <div className="w-32 flex items-center gap-2 justify-end">
        <svg className="w-4 h-4 text-surface-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-20 h-1 accent-brand-500 cursor-pointer" />
      </div>
    </div>
  )
}
