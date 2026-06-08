import { create } from 'zustand'
import { useRef } from 'react'

export const usePlayer = create((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  audioRef: null,

  setAudioRef: (ref) => set({ audioRef: ref }),

  play: (song, queue = []) => {
    const audio = get().audioRef
    if (!audio) return
    set({ currentSong: song, queue: queue.length > 0 ? queue : [song], isPlaying: true })
    audio.src = song.audio_url
    audio.play().catch(() => {})
  },

  togglePlay: () => {
    const audio = get().audioRef
    const { isPlaying } = get()
    if (!audio || !get().currentSong) return
    if (isPlaying) { audio.pause(); set({ isPlaying: false }) }
    else { audio.play().catch(() => {}); set({ isPlaying: true }) }
  },

  playNext: () => {
    const { queue, currentSong } = get()
    if (queue.length === 0) return
    const idx = queue.findIndex(s => s.id === currentSong?.id)
    const next = queue[idx + 1] || queue[0]
    if (next) get().play(next)
  },

  playPrev: () => {
    const { queue, currentSong } = get()
    if (queue.length === 0) return
    const idx = queue.findIndex(s => s.id === currentSong?.id)
    const prev = queue[idx - 1] || queue[queue.length - 1]
    if (prev) get().play(prev)
  },

  setVolume: (v) => {
    const audio = get().audioRef
    if (audio) { audio.volume = v }
    set({ volume: v })
  },

  seek: (t) => {
    const audio = get().audioRef
    if (audio) audio.currentTime = t
  },

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setPlaying: (isPlaying) => set({ isPlaying }),
}))
