import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set) => ({
  user: (() => {
    try { return JSON.parse(sessionStorage.getItem('melodia_user') || localStorage.getItem('melodia_user') || 'null') }
    catch { return null }
  })(),
  loading: false,

  login: async (username, password, remember = false) => {
    set({ loading: true })
    try {
      const data = await api.login(username, password)
      const user = { username: data.username }
      const storage = remember ? localStorage : sessionStorage
      storage.setItem('melodia_token', data.access_token)
      storage.setItem('melodia_user', JSON.stringify(user))
      set({ user, loading: false })
      return true
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },

  register: async (username, email, password) => {
    set({ loading: true })
    try {
      const data = await api.register(username, email, password)
      const user = { username: data.username }
      sessionStorage.setItem('melodia_token', data.access_token)
      sessionStorage.setItem('melodia_user', JSON.stringify(user))
      set({ user, loading: false })
      return true
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },

  logout: () => {
    sessionStorage.removeItem('melodia_token')
    sessionStorage.removeItem('melodia_user')
    localStorage.removeItem('melodia_token')
    localStorage.removeItem('melodia_user')
    set({ user: null })
  },
}))
