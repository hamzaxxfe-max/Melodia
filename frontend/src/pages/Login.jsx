import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

export default function Login() {
  const { login, register, loading } = useAuth()
  const nav = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      let ok
      if (isLogin) ok = await login(username, password, remember)
      else ok = await register(username, email, password)
      if (ok) nav('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-brand-400">Melodia</span>
          </h1>
          <p className="text-surface-400">{isLogin ? 'Welcome back' : 'Create your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-surface-400 block mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-400 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Enter username" />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-medium text-surface-400 block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-400 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Enter email" />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-surface-400 block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-400 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Enter password" />
          </div>

          {isLogin && (
            <label className="flex items-center gap-2 text-sm text-surface-400 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-brand-500" />
              Remember me
            </label>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50">
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-sm text-surface-400 hover:text-white transition-colors">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {isLogin && (
          <div className="mt-4 p-3 bg-surface-900 rounded-lg border border-surface-700 text-center">
            <p className="text-xs text-surface-400">Demo account: <span className="text-white font-medium">demo</span> / <span className="text-white font-medium">demo123</span></p>
          </div>
        )}
      </div>
    </div>
  )
}
