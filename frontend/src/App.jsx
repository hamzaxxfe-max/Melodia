import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import Login from './pages/Login'
import Album from './pages/Album'
import Playlist from './pages/Playlist'

export default function App() {
  return (
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
            </Routes>
          </div>
        </main>
      </div>
      <Player />
    </div>
  )
}
