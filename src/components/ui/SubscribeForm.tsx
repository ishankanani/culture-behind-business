'use client'
import { useState } from 'react'
export default function SubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (res.ok) { setStatus('success'); setMsg(data.message); setEmail(''); setName('') }
      else { setStatus('error'); setMsg(data.error || 'Something went wrong') }
    } catch { setStatus('error'); setMsg('Network error, please try again') }
  }

  if (status === 'success') return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 8l4 4 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p className="text-sm text-[#E1F5EE]">{msg}</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2 flex-col sm:flex-row">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)"
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50"/>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required type="email"
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50"/>
        <button type="submit" disabled={status === 'loading'}
          className="bg-[#1D9E75] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#0F6E56] transition-colors disabled:opacity-50 whitespace-nowrap">
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && <p className="text-red-300 text-xs mt-2">{msg}</p>}
    </form>
  )
}
