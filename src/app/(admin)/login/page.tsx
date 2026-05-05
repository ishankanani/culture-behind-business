'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const d = await res.json()

      if (res.ok) {
        window.location.replace('/dashboard')
      } else {
        setError(d.error || 'Invalid credentials')
        setLoading(false)
      }
    } catch {
      setError('Network error, please try again')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#04342C] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-8">
  <div className="w-16 h-16 rounded-full overflow-hidden bg-white mx-auto mb-4 flex items-center justify-center">
    <img src="/logo.png" alt="CbB Logo" className="w-full h-full object-contain" />
  </div>
  <h1 className="text-xl font-semibold text-stone-900">Admin login</h1>
  <p className="text-stone-400 text-sm mt-1">The Culture Behind Business</p>
</div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="input"
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="input"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0F6E56] text-white w-full py-2.5 rounded-lg text-sm font-medium hover:bg-[#085041] transition-colors disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}