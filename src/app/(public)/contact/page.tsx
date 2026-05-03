'use client'
import { useState } from 'react'
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [msg, setMsg] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setStatus('loading')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const d = await res.json()
      if (res.ok) { setStatus('success'); setMsg(d.message); setForm({ name: '', email: '', subject: '', message: '' }) }
      else { setStatus('error'); setMsg(d.error || 'Something went wrong') }
    } catch { setStatus('error'); setMsg('Network error') }
  }
  return (
    <div>
      <section className="bg-[#04342C] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold text-white mb-3">Connect with us</h1>
          <p className="text-white/60">Pitch a guest, ask a question, or just say hello.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-medium text-stone-900 mb-6">Send a message</h2>
          {status === 'success' ? (
            <div className="bg-[#E1F5EE] rounded-xl p-6 text-[#085041]">
              <p className="font-medium mb-1">Message sent!</p>
              <p className="text-sm">{msg}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div><label className="label">Your name</label><input required value={form.name} onChange={set('name')} className="input" placeholder="Full name" /></div>
              <div><label className="label">Email address</label><input required type="email" value={form.email} onChange={set('email')} className="input" placeholder="email@example.com" /></div>
              <div><label className="label">Subject</label>
                <select value={form.subject} onChange={set('subject')} className="input">
                  <option value="">Select subject</option>
                  <option>Guest suggestion</option><option>Sponsorship</option><option>General enquiry</option><option>Media request</option>
                </select>
              </div>
              <div><label className="label">Message</label><textarea required value={form.message} onChange={set('message')} className="input h-32 resize-none" placeholder="Your message..." /></div>
              {status === 'error' && <p className="text-red-500 text-xs">{msg}</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-50">
                {status === 'loading' ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </div>
        <div>
          <h2 className="text-xl font-medium text-stone-900 mb-6">Other ways to reach us</h2>
          <div className="space-y-3">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-[#0F6E56] rounded-xl hover:bg-[#085041] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">W</div>
              <div><p className="text-white font-medium text-sm">Chat on WhatsApp</p><p className="text-white/60 text-xs">Usually replies within a few hours</p></div>
            </a>
            {[
              { label: 'YouTube', sub: 'The Culture Behind Business', color: '#FF0000', abbr: 'YT', href: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || '#' },
              { label: 'LinkedIn', sub: 'Connect professionally', color: '#0A66C2', abbr: 'in', href: '#' },
              { label: 'Instagram', sub: 'Behind-the-scenes', color: '#E1306C', abbr: 'IG', href: '#' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-stone-200 rounded-xl hover:border-stone-300 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: s.color }}>{s.abbr}</div>
                <div><p className="font-medium text-stone-900 text-sm">{s.label}</p><p className="text-stone-500 text-xs">{s.sub}</p></div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
