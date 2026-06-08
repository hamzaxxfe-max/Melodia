import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import SongRow from '../components/SongRow'
import Loading from '../components/Loading'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    const timer = setTimeout(() => {
      api.getSongs(query).then(setResults).catch(() => {}).finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            type="text"
            placeholder="Search songs or artists..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-800 border border-surface-700 rounded-full text-white placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            autoFocus
          />
        </div>
      </div>

      {loading && <Loading />}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-20 text-surface-400">
          <p className="text-lg">No results found for "{query}"</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-sm text-surface-400 mb-4">{results.length} results</p>
          <div className="space-y-1">
            {results.map(s => <SongRow key={s.id} song={s} queue={results} />)}
          </div>
        </div>
      )}

      {!query && (
        <div className="text-center py-20 text-surface-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <p>Start typing to search</p>
        </div>
      )}
    </div>
  )
}
