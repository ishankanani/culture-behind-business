'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = { id: string; name: string }

export default function NewEpisodePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '', description: '', type: 'VIDEO',
    category: '', score: 50,
    guestName: '', guestTitle: '', guestBio: '', subtitles: '',
  })
  const [videoSource, setVideoSource] = useState<'youtube' | 'upload'>('youtube')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'publishing'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data)
        if (data.length > 0) setForm(f => ({ ...f, category: data[0].name }))
      })
  }, [])

  function set(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [k]: k === 'score' ? parseInt(e.target.value) || 0 : e.target.value }))
    }
  }

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
      })
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText).url)
        else reject(new Error('Upload failed'))
      })
      xhr.addEventListener('error', () => reject(new Error('Upload failed')))
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  }

  async function save(publish: boolean) {
    if (!form.title || !form.description) { setError('Title and description are required'); return }
    setError('')
    let finalVideoUrl: string | null = null
    let finalAudioUrl: string | null = null

    try {
      if (form.type === 'VIDEO') {
        if (videoSource === 'youtube') {
          if (!youtubeUrl) { setError('Please enter a YouTube URL'); return }
          finalVideoUrl = youtubeUrl
        } else {
          if (!videoFile) { setError('Please select a video file'); return }
          setStatus('uploading')
          finalVideoUrl = await uploadFile(videoFile)
        }
      }

      if (form.type === 'AUDIO') {
        if (!audioFile) { setError('Please select an audio file'); return }
        setStatus('uploading')
        finalAudioUrl = await uploadFile(audioFile)
      }

      setStatus(publish ? 'publishing' : 'saving')

      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          score: Number(form.score),
          youtubeUrl: finalVideoUrl,
          audioUrl: finalAudioUrl,
          guestName: form.guestName || null,
          guestTitle: form.guestTitle || null,
          guestBio: form.guestBio || null,
          subtitles: form.subtitles || null,
          category: form.category || null,
          published: publish,
        }),
      })

      const d = await res.json()
      if (res.ok) { router.push('/manage-episodes'); router.refresh() }
      else { setError(d.error || 'Failed to save'); setStatus('idle') }
    } catch (err) {
      console.error(err)
      setError('Upload or save failed. Please try again.')
      setStatus('idle')
      setUploadProgress(0)
    }
  }

  const isLoading = status !== 'idle'

  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium">New episode</h1>
      </div>

      <div className="p-6 max-w-3xl">
        <div className="bg-white border border-stone-200 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="label">Episode title *</label>
              <input value={form.title} onChange={set('title')} className="input"
                placeholder="e.g. The founder mindset with Ahmed Al-Rashid" />
            </div>

            {/* Type */}
            <div>
              <label className="label">Type *</label>
              <select value={form.type} onChange={set('type')} className="input">
                <option value="VIDEO">Video</option>
                <option value="AUDIO">Audio</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="label">
                Category
                <Link href="/categories" className="ml-2 text-[10px] text-[#0F6E56] hover:underline">
                  + Manage categories
                </Link>
              </label>
              {categories.length === 0 ? (
                <div className="input flex items-center gap-2 text-stone-400 text-sm">
                  No categories yet —
                  <Link href="/categories" className="text-[#0F6E56] hover:underline">create one first</Link>
                </div>
              ) : (
                <select value={form.category} onChange={set('category')} className="input">
                  <option value="">— Select category —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* VIDEO SOURCE */}
            {form.type === 'VIDEO' && (
              <div className="md:col-span-2">
                <label className="label">Video source *</label>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setVideoSource('youtube')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${videoSource === 'youtube' ? 'bg-[#0F6E56] text-white border-[#0F6E56]' : 'border-stone-300 text-stone-600 hover:border-stone-400'}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="3" width="14" height="10" rx="2" fill={videoSource === 'youtube' ? 'rgba(255,255,255,0.3)' : '#e5e7eb'}/>
                      <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill={videoSource === 'youtube' ? 'white' : '#6b7280'}/>
                    </svg>
                    YouTube URL
                  </button>
                  <button type="button" onClick={() => setVideoSource('upload')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${videoSource === 'upload' ? 'bg-[#0F6E56] text-white border-[#0F6E56]' : 'border-stone-300 text-stone-600 hover:border-stone-400'}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 10V4M8 4L5.5 6.5M8 4L10.5 6.5" stroke={videoSource === 'upload' ? 'white' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 12h10" stroke={videoSource === 'upload' ? 'white' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Upload video
                  </button>
                </div>

                {videoSource === 'youtube' && (
                  <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                    className="input" placeholder="https://youtube.com/watch?v=..." />
                )}

                {videoSource === 'upload' && (
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${videoFile ? 'border-[#0F6E56] bg-[#E1F5EE]' : 'border-stone-300 hover:border-stone-400'}`}>
                    <input type="file" accept="video/*" id="video-upload" className="hidden"
                      onChange={e => setVideoFile(e.target.files?.[0] || null)} />
                    {videoFile ? (
                      <div>
                        <p className="text-sm font-medium text-[#085041] mb-1">✓ {videoFile.name}</p>
                        <p className="text-xs text-[#0F6E56]">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                        <button type="button" onClick={() => setVideoFile(null)}
                          className="text-xs text-red-500 mt-2 hover:underline">Remove</button>
                      </div>
                    ) : (
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                            <path d="M10 12V5M10 5L7 8M10 5L13 8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 15h12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-stone-700">Click to upload video</p>
                        <p className="text-xs text-stone-400 mt-1">MP4, MOV, AVI up to 2GB</p>
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* AUDIO SOURCE */}
            {form.type === 'AUDIO' && (
              <div className="md:col-span-2">
                <label className="label">Audio file *</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${audioFile ? 'border-[#0F6E56] bg-[#E1F5EE]' : 'border-stone-300 hover:border-stone-400'}`}>
                  <input type="file" accept="audio/*" id="audio-upload" className="hidden"
                    onChange={e => setAudioFile(e.target.files?.[0] || null)} />
                  {audioFile ? (
                    <div>
                      <p className="text-sm font-medium text-[#085041] mb-1">✓ {audioFile.name}</p>
                      <p className="text-xs text-[#0F6E56]">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>
                      <button type="button" onClick={() => setAudioFile(null)}
                        className="text-xs text-red-500 mt-2 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <label htmlFor="audio-upload" className="cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                          <rect x="8" y="3" width="4" height="9" rx="2" stroke="#6b7280" strokeWidth="1.5"/>
                          <path d="M5 9v2a5 5 0 0010 0V9" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M10 16v2M8 18h4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-stone-700">Click to upload audio</p>
                      <p className="text-xs text-stone-400 mt-1">MP3, WAV, AAC up to 500MB</p>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Upload progress bar */}
            {status === 'uploading' && (
              <div className="md:col-span-2">
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-[#0F6E56] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Guest info */}
            <div>
              <label className="label">Guest name</label>
              <input value={form.guestName} onChange={set('guestName')} className="input" placeholder="Full name" />
            </div>
            <div>
              <label className="label">Guest title / role</label>
              <input value={form.guestTitle} onChange={set('guestTitle')} className="input" placeholder="CEO, Founder, etc." />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description *</label>
              <textarea value={form.description} onChange={set('description')}
                className="input h-28 resize-none"
                placeholder="Episode summary shown on the page and in emails..." />
            </div>

            <div className="md:col-span-2">
              <label className="label">Guest bio</label>
              <textarea value={form.guestBio} onChange={set('guestBio')}
                className="input h-20 resize-none" placeholder="Short bio of the guest..." />
            </div>

            <div>
              <label className="label">Score (0–100)</label>
              <input type="number" min={0} max={100} value={form.score} onChange={set('score')} className="input" />
            </div>
            <div>
              <label className="label">Subtitles URL (optional)</label>
              <input value={form.subtitles} onChange={set('subtitles')} className="input" placeholder="https://... (.vtt)" />
            </div>

          </div>

          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end p-6 border-t border-stone-100">
            <button onClick={() => router.back()} disabled={isLoading} className="btn-secondary disabled:opacity-50">
              Cancel
            </button>
            <button onClick={() => save(false)} disabled={isLoading} className="btn-secondary disabled:opacity-50">
              {status === 'saving' ? 'Saving...' : 'Save draft'}
            </button>
            <button onClick={() => save(true)} disabled={isLoading} className="btn-primary disabled:opacity-50">
              {status === 'uploading' ? `Uploading ${uploadProgress}%...`
                : status === 'publishing' ? 'Publishing...'
                : 'Publish + send emails'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}