'use client'
import { useState } from 'react'
export default function NewsletterPage() {
  const [form, setForm] = useState({ subject: '', body: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [msg, setMsg] = useState('')
  async function send() {
    setStatus('loading')
    const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const d = await res.json()
    if (res.ok) { setStatus('success'); setMsg(d.message) }
    else { setStatus('error'); setMsg(d.error || 'Failed to send') }
  }
  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center"><h1 className="text-base font-medium">Send newsletter</h1></div>
      <div className="p-6 max-w-2xl">
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
          {status === 'success' ? (
            <div className="bg-[#E1F5EE] rounded-xl p-6 text-[#085041]"><p className="font-medium">{msg}</p></div>
          ) : (
            <>
              <div><label className="label">Subject line</label><input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="input" placeholder="e.g. New episode out now — The Founder Mindset" /></div>
              <div><label className="label">Email body</label><textarea value={form.body} onChange={e => setForm(f => ({...f, body: e.target.value}))} className="input h-48 resize-none" placeholder="Write your newsletter here. Plain text is fine." /></div>
              {status === 'error' && <p className="text-red-500 text-sm">{msg}</p>}
              <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
                <button onClick={send} disabled={status === 'loading' || !form.subject || !form.body} className="btn-primary disabled:opacity-50">
                  {status === 'loading' ? 'Sending...' : 'Send to all subscribers'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
