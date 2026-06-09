const BASE = import.meta.env.VITE_MELODIA_API_URL || '/api'

function getToken() {
  try {
    const stored = sessionStorage.getItem('melodia_token') || localStorage.getItem('melodia_token')
    return stored || ''
  } catch { return '' }
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(`${BASE}${path}`, { ...options, headers, signal: controller.signal })

    if (res.status === 401) {
      sessionStorage.removeItem('melodia_token')
      localStorage.removeItem('melodia_token')
      sessionStorage.removeItem('melodia_user')
      localStorage.removeItem('melodia_user')
      window.location.href = '/login'
      throw new Error('Session expired')
    }

    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Request failed')
    return data
  } finally {
    clearTimeout(timeout)
  }
}

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),

  // songs
  getSongs: (q = '') => request(`/songs${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  getSong: (id) => request(`/songs/${id}`),

  // albums
  getAlbums: () => request('/albums'),
  getAlbum: (id) => request(`/albums/${id}`),

  // playlists
  getPlaylists: () => request('/playlists'),
  getPlaylist: (id) => request(`/playlists/${id}`),
  createPlaylist: (name, description = '') => request('/playlists', { method: 'POST', body: JSON.stringify({ name, description }) }),
  addToPlaylist: (plId, songId) => request(`/playlists/${plId}/songs/${songId}`, { method: 'POST' }),
  removeFromPlaylist: (plId, songId) => request(`/playlists/${plId}/songs/${songId}`, { method: 'DELETE' }),
  deletePlaylist: (id) => request(`/playlists/${id}`, { method: 'DELETE' }),

  // favorites
  getFavorites: () => request('/favorites'),
  addFavorite: (songId) => request(`/favorites/${songId}`, { method: 'POST' }),
  removeFavorite: (songId) => request(`/favorites/${songId}`, { method: 'DELETE' }),
}
