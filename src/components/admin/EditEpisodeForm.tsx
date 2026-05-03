'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Episode } from '@prisma/client'
const CATS = ['Leadership', 'Culture', 'Startups', 'Marketing', 'Finance', 'Personal Growth', 'Technology']
export default function EditEpisodeForm({ episode }: { episode: Episode }) {
  const router = useRouter()
  const [form, setForm] = useState({ ...episode, youtubeUrl: episode.youtubeUrl || '', audioUrl: episode.audioUrl || '', guestName: episode.guestName || '', guestTitle: episode.guestTitle || '', guestBio: episode.guestBio || '', subtitles: episode.subtitles || '', category: episode.category || 'Leadership' })
  const [status, setStatus] = useState<'idle'|'saving'>('idle')
  const [error, setError] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: k === 'score' ? parseInt(e.target.value) || 0 : e.target.value }))
  async function save() {
    setStatus('saving'); setError('')
    const res = await fetch(`/api/episodes/${episode.slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, youtubeUrl: form.youtubeUrl || null, audioUrl: form.audioUrl || null }) })
    const d = await res.json()
    if (res.ok) router.push('/episodes')
    else { setError(d.error || 'Failed'); setStatus('idle') }
  }
  return (
    <div className="bg-white border border-stone-200 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
        <div className="md:col-span-2"><label className="label">Title *</label><input value={form.title} onChange={set('title')} className="input" /></div>
        <div><label className="label">Type</label><select value={form.type} onChange={set('type')} className="input"><option value="VIDEO">Video</option><option value="AUDIO">Audio</option></select></div>
        <div><label className="label">Category</label><select value={form.category} onChange={set('category')} className="input">{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="md:col-span-2"><label className="label">YouTube URL</label><input value={form.youtubeUrl} onChange={set('youtubeUrl')} className="input" placeholder="https://youtube.com/watch?v=..." /></div>
        <div className="md:col-span-2"><label className="label">Audio URL</label><input value={form.audioUrl} onChange={set('audioUrl')} className="input" /></div>
        <div><label className="label">Guest name</label><input value={form.guestName} onChange={set('guestName')} className="input" /></div>
        <div><label className="label">Guest title</label><input value={form.guestTitle} onChange={set('guestTitle')} className="input" /></div>
        <div className="md:col-span-2"><label className="label">Description *</label><textarea value={form.description} onChange={set('description')} className="input h-28 resize-none" /></div>
        <div className="md:col-span-2"><label className="label">Guest bio</label><textarea value={form.guestBio} onChange={set('guestBio')} className="input h-20 resize-none" /></div>
        <div><label className="label">Score</label><input type="number" min={0} max={100} value={form.score} onChange={set('score')} className="input" /></div>
        <div><label className="label">Subtitles URL</label><input value={form.subtitles} onChange={set('subtitles')} className="input" /></div>
      </div>
      {error && <div className="mx-6 mb-4 p-3 bg-red-50 rounded-lg text-sm text-red-600">{error}</div>}
      <div className="flex gap-3 justify-end p-6 border-t border-stone-100">
        <button onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button onClick={save} disabled={status !== 'idle'} className="btn-primary disabled:opacity-50">{status === 'saving' ? 'Saving...' : 'Save changes'}</button>
      </div>
    </div>
  )
}
