'use client'
import { useState, useEffect, useRef } from 'react'

type Host = { id: string; name: string; role: string; bio: string; image?: string; order: number }

export default function SiteSettingsPage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [settings, setSettings] = useState({ hero_title: '', hero_subtitle: '', hero_image: '' })
  const [editingHost, setEditingHost] = useState<Host | null>(null)
  const [newHost, setNewHost] = useState({ name: '', role: '', bio: '', order: 0 })
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [hostImageFiles, setHostImageFiles] = useState<Record<string, File>>({})
  const [newHostImageFile, setNewHostImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const heroFileRef = useRef<HTMLInputElement>(null)
  const newHostFileRef = useRef<HTMLInputElement>(null)

  async function load() {
    try {
      const [hostsRes, settingsRes] = await Promise.all([
        fetch('/api/hosts').then(r => r.ok ? r.json() : []),
        fetch('/api/settings').then(r => r.ok ? r.json() : {}),
      ])
      setHosts(Array.isArray(hostsRes) ? hostsRes : [])
      setSettings({
        hero_title: settingsRes.hero_title || '',
        hero_subtitle: settingsRes.hero_subtitle || '',
        hero_image: settingsRes.hero_image || '/both.jpeg',
      })
    } catch (err) {
      console.error('Load error:', err)
    }
  }

  useEffect(() => { load() }, [])

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const d = await res.json()
    return d.url
  }

  async function saveSettings() {
    setSaving(true); setMsg('')
    try {
      let heroImage = settings.hero_image
      if (heroImageFile) heroImage = await uploadImage(heroImageFile)
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, hero_image: heroImage }),
      })
      if (res.ok) {
        setMsg('Hero settings saved!')
        setHeroImageFile(null)
        load()
      } else {
        setMsg('Failed to save settings')
      }
    } catch (err) {
      console.error(err)
      setMsg('Error saving settings')
    }
    setSaving(false)
  }

  async function saveHost() {
    if (!editingHost) return
    setSaving(true); setMsg('')
    try {
      let image = editingHost.image
      // Check if this host has a new image file
      if (hostImageFiles[editingHost.id]) {
        image = await uploadImage(hostImageFiles[editingHost.id])
      }
      const res = await fetch(`/api/hosts/${editingHost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingHost, image }),
      })
      if (res.ok) {
        setMsg(`${editingHost.name} updated successfully!`)
        setEditingHost(null)
        setHostImageFiles(prev => {
          const next = { ...prev }
          delete next[editingHost.id]
          return next
        })
        load()
      } else {
        setMsg('Failed to update host')
      }
    } catch (err) {
      console.error(err)
      setMsg('Error updating host')
    }
    setSaving(false)
  }

  async function addHost() {
    if (!newHost.name) return
    setSaving(true)
    try {
      let image = '/both.jpeg'
      if (newHostImageFile) image = await uploadImage(newHostImageFile)
      const res = await fetch('/api/hosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newHost, image }),
      })
      if (res.ok) {
        setMsg(`${newHost.name} added!`)
        setNewHost({ name: '', role: '', bio: '', order: 0 })
        setNewHostImageFile(null)
        load()
      }
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  async function deleteHost(id: string, name: string) {
    if (!confirm(`Delete host "${name}"?`)) return
    await fetch(`/api/hosts/${id}`, { method: 'DELETE' })
    setMsg(`${name} deleted.`)
    load()
  }

  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center">
        <h1 className="text-base font-medium">Site settings</h1>
      </div>

      <div className="p-6 max-w-3xl space-y-6">
        {msg && (
          <div className={`p-3 rounded-lg text-sm ${msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('error') ? 'bg-red-50 text-red-600' : 'bg-[#E1F5EE] text-[#085041]'}`}>
            ✓ {msg}
          </div>
        )}

        {/* Hero settings */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-medium text-stone-900">Homepage hero</h2>
            <p className="text-xs text-stone-400 mt-0.5">Controls the headline, subtitle, and hero image on the homepage</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="label">Hero title</label>
              <input value={settings.hero_title}
                onChange={e => setSettings(s => ({ ...s, hero_title: e.target.value }))}
                className="input" placeholder="Your destination for..." />
            </div>
            <div>
              <label className="label">Hero subtitle</label>
              <textarea value={settings.hero_subtitle}
                onChange={e => setSettings(s => ({ ...s, hero_subtitle: e.target.value }))}
                className="input h-20 resize-none" />
            </div>
            <div>
              <label className="label">Hero image (homepage right side)</label>
              <div className="flex gap-4 items-start mt-2">
                {settings.hero_image && (
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                    <img src={settings.hero_image} alt="Hero" className="w-full h-full object-cover object-top" />
                  </div>
                )}
                <div>
                  <input type="file" accept="image/*" ref={heroFileRef} className="hidden"
                    onChange={e => setHeroImageFile(e.target.files?.[0] || null)} />
                  <button onClick={() => heroFileRef.current?.click()} className="btn-secondary text-xs px-4 py-2">
                    {heroImageFile ? `✓ ${heroImageFile.name}` : 'Change hero image'}
                  </button>
                  {heroImageFile && (
                    <button onClick={() => setHeroImageFile(null)} className="ml-2 text-xs text-red-500 hover:underline">Remove</button>
                  )}
                  <p className="text-xs text-stone-400 mt-1">This image appears on the homepage hero section only.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button onClick={saveSettings} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : 'Save hero settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Host profiles */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-medium text-stone-900">Host profiles</h2>
            <p className="text-xs text-stone-400 mt-0.5">Each host has their own separate image — shown on the About us page</p>
          </div>

          <div className="divide-y divide-stone-50">
            {hosts.length === 0 && (
              <div className="p-8 text-center text-stone-400 text-sm">
                No hosts added yet. Add your first host below.
              </div>
            )}
            {hosts.map(host => (
              <div key={host.id} className="p-5">
                {editingHost?.id === host.id ? (
                  // Edit form
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Name</label>
                        <input value={editingHost.name}
                          onChange={e => setEditingHost(h => h ? { ...h, name: e.target.value } : h)}
                          className="input" />
                      </div>
                      <div>
                        <label className="label">Role / title</label>
                        <input value={editingHost.role}
                          onChange={e => setEditingHost(h => h ? { ...h, role: e.target.value } : h)}
                          className="input" placeholder="Co-Host, Producer..." />
                      </div>
                    </div>
                    <div>
                      <label className="label">Bio</label>
                      <textarea value={editingHost.bio}
                        onChange={e => setEditingHost(h => h ? { ...h, bio: e.target.value } : h)}
                        className="input h-24 resize-none" />
                    </div>

                    {/* Individual host image upload */}
                    <div>
                      <label className="label">Profile photo (this host only)</label>
                      <div className="flex gap-3 items-center mt-1">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-stone-200">
                          <img
                            src={hostImageFiles[editingHost.id] ? URL.createObjectURL(hostImageFiles[editingHost.id]) : (editingHost.image || '/both.jpeg')}
                            alt={editingHost.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            id={`host-img-${editingHost.id}`}
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) setHostImageFiles(prev => ({ ...prev, [editingHost.id]: file }))
                            }}
                          />
                          <label htmlFor={`host-img-${editingHost.id}`}
                            className="btn-secondary text-xs px-3 py-1.5 cursor-pointer">
                            {hostImageFiles[editingHost.id] ? `✓ ${hostImageFiles[editingHost.id].name}` : 'Change photo'}
                          </label>
                          <p className="text-xs text-stone-400 mt-1">Only changes this host's photo.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button onClick={saveHost} disabled={saving}
                        className="btn-primary text-xs px-4 py-2 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save changes'}
                      </button>
                      <button onClick={() => { setEditingHost(null) }}
                        className="btn-secondary text-xs px-4 py-2">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display row
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-stone-200">
                      <img
                        src={host.image || '/both.jpeg'}
                        alt={host.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900">{host.name}</p>
                      <p className="text-xs text-[#0F6E56]">{host.role}</p>
                      <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{host.bio}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setEditingHost(host)}
                        className="text-xs px-3 py-1.5 rounded border border-[#0F6E56] text-[#0F6E56] hover:bg-[#E1F5EE] transition-colors">
                        Edit
                      </button>
                      <button onClick={() => deleteHost(host.id, host.name)}
                        className="text-xs px-3 py-1.5 rounded border border-red-300 text-red-500 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add new host */}
          <div className="p-5 border-t border-stone-100 bg-stone-50">
            <p className="text-xs font-medium text-stone-600 mb-3">Add new host</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label">Name *</label>
                <input value={newHost.name}
                  onChange={e => setNewHost(h => ({ ...h, name: e.target.value }))}
                  className="input" placeholder="Full name" />
              </div>
              <div>
                <label className="label">Role *</label>
                <input value={newHost.role}
                  onChange={e => setNewHost(h => ({ ...h, role: e.target.value }))}
                  className="input" placeholder="Co-Host, Producer..." />
              </div>
            </div>
            <div className="mb-3">
              <label className="label">Bio</label>
              <textarea value={newHost.bio}
                onChange={e => setNewHost(h => ({ ...h, bio: e.target.value }))}
                className="input h-16 resize-none" placeholder="Short bio..." />
            </div>

            {/* New host photo */}
            <div className="mb-4">
              <label className="label">Profile photo</label>
              <div className="flex items-center gap-3 mt-1">
                {newHostImageFile && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-stone-200">
                    <img src={URL.createObjectURL(newHostImageFile)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <input type="file" accept="image/*" ref={newHostFileRef} className="hidden"
                    onChange={e => setNewHostImageFile(e.target.files?.[0] || null)} />
                  <button onClick={() => newHostFileRef.current?.click()}
                    className="btn-secondary text-xs px-3 py-1.5">
                    {newHostImageFile ? `✓ ${newHostImageFile.name}` : 'Upload photo'}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={addHost} disabled={!newHost.name || !newHost.role || saving}
              className="btn-primary text-xs px-5 py-2 disabled:opacity-50">
              {saving ? 'Adding...' : 'Add host'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}