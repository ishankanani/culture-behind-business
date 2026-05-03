'use client'
import { useState } from 'react'

export default function SettingsPage() {
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'success' | 'error'>('success')
  const [loading, setLoading] = useState(false)

  async function changePw(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (pw.newPw !== pw.confirm) {
      setMsgType('error')
      setMsg('New passwords do not match')
      return
    }
    if (pw.newPw.length < 6) {
      setMsgType('error')
      setMsg('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: pw.current, newPassword: pw.newPw }),
      })
      const d = await res.json()

      if (res.ok) {
        setMsgType('success')
        setMsg('Password updated successfully!')
        setPw({ current: '', newPw: '', confirm: '' })
      } else {
        setMsgType('error')
        setMsg(d.error || 'Failed to update password')
      }
    } catch {
      setMsgType('error')
      setMsg('Network error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center">
        <h1 className="text-base font-medium">Settings</h1>
      </div>

      <div className="p-6 max-w-xl space-y-6">

        {/* Site info */}
        <div className="bg-white border border-stone-200 rounded-xl">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-medium text-stone-900">Site information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="label">Site name</label>
              <input defaultValue="The Culture Behind Business" className="input" readOnly />
            </div>
            <div>
              <label className="label">YouTube channel URL</label>
              <input defaultValue={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || ''} className="input" placeholder="https://youtube.com/@..." readOnly />
            </div>
            <p className="text-xs text-stone-400">To update these values, edit your .env file.</p>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white border border-stone-200 rounded-xl">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-medium text-stone-900">Change password</h2>
          </div>
          <div className="p-6">
            {msg && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${msgType === 'success' ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-red-50 text-red-600'}`}>
                {msg}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="label">Current password</label>
                <input
                  type="password"
                  value={pw.current}
                  onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
                  className="input"
                  placeholder="Your current password"
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="label">New password</label>
                <input
                  type="password"
                  value={pw.newPw}
                  onChange={e => setPw(p => ({ ...p, newPw: e.target.value }))}
                  className="input"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="label">Confirm new password</label>
                <input
                  type="password"
                  value={pw.confirm}
                  onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                  className="input"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </div>
              <div className="pt-2">
                <button
                  onClick={changePw}
                  disabled={loading || !pw.current || !pw.newPw || !pw.confirm}
                  className="btn-primary disabled:opacity-50">
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Environment variables reference */}
        <div className="bg-white border border-stone-200 rounded-xl">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-medium text-stone-900">Environment variables</h2>
          </div>
          <div className="p-6">
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              These must be set in your <code className="bg-stone-100 px-1 rounded">.env</code> file or Hostinger environment panel:
            </p>
            <div className="space-y-2">
              {['DATABASE_URL', 'JWT_SECRET', 'RESEND_API_KEY', 'RESEND_FROM', 'NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_YOUTUBE_CHANNEL'].map(v => (
                <div key={v} className="bg-stone-50 rounded-lg px-3 py-2 font-mono text-xs text-[#085041]">{v}</div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}