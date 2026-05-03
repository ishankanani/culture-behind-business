'use client'
import { useState, useRef, useEffect } from 'react'
export default function AudioPlayer({ src, title }: { src: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => { setCurrent(a.currentTime); setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0) }
    const onLoad = () => setDuration(a.duration)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onLoad)
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('loadedmetadata', onLoad) }
  }, [])

  const fmt = (s: number) => { const m = Math.floor(s/60); return `${m}:${String(Math.floor(s%60)).padStart(2,'0')}` }
  const toggle = () => { if (!audioRef.current) return; playing ? audioRef.current.pause() : audioRef.current.play(); setPlaying(!playing) }
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  return (
    <div className="bg-[#04342C] rounded-xl p-5">
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
      <p className="text-[#9FE1CB] text-xs mb-3 font-medium">{title}</p>
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="w-12 h-12 rounded-full bg-[#1D9E75] flex items-center justify-center hover:bg-[#0F6E56] transition-colors flex-shrink-0">
          {playing
            ? <svg width="18" height="18" fill="white" viewBox="0 0 18 18"><rect x="4" y="3" width="4" height="12" rx="1"/><rect x="10" y="3" width="4" height="12" rx="1"/></svg>
            : <svg width="18" height="18" fill="white" viewBox="0 0 18 18"><path d="M6 3l10 6-10 6V3z"/></svg>
          }
        </button>
        <div className="flex-1">
          <div className="h-2 bg-white/20 rounded-full cursor-pointer" onClick={seek}>
            <div className="h-2 bg-[#1D9E75] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>{fmt(current)}</span><span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
