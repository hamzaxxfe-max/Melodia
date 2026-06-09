import { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import Login from './pages/Login'
import Album from './pages/Album'
import Playlist from './pages/Playlist'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-surface-950 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-surface-400 mb-4">An unexpected error occurred</p>
            <button onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }} className="btn-primary">
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function NotFound() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-surface-600 mb-4">404</h1>
        <p className="text-surface-400 mb-6">Page not found</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-surface-950">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 pb-32">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/login" element={<Login />} />
                <Route path="/album/:id" element={<Album />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
        <Player />
      </div>
    </ErrorBoundary>
  )
}
