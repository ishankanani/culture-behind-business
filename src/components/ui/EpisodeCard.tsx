import Link from 'next/link'
import Image from 'next/image'
import { getYouTubeThumbnail } from '@/lib/utils'

type Episode = {
  id: string; title: string; slug: string; type: string
  youtubeUrl?: string | null; guestName?: string | null
  category?: string | null; description: string; createdAt: Date
}

export default function EpisodeCard({ episode }: { episode: Episode }) {
  const thumb = episode.youtubeUrl ? getYouTubeThumbnail(episode.youtubeUrl) : null
  return (
    <Link href={`/episode/${episode.slug}`} className="card group hover:shadow-md transition-shadow overflow-hidden block">
      <div className="relative h-44 bg-[#085041] overflow-hidden">
        {thumb ? (
          <Image src={thumb} alt={episode.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              {episode.type === 'VIDEO'
                ? <path d="M15 12l14 8-14 8V12z" fill="rgba(255,255,255,0.5)"/>
                : <><rect x="17" y="8" width="6" height="18" rx="3" fill="rgba(255,255,255,0.5)"/><path d="M10 18v4a10 10 0 0020 0v-4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/></>
              }
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={episode.type === 'VIDEO' ? 'ep-type-video' : 'ep-type-audio'}>{episode.type}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-[#0F6E56] font-medium mb-1">{episode.category || 'Episode'}</p>
        <h3 className="font-medium text-stone-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#0F6E56] transition-colors">{episode.title}</h3>
        {episode.guestName && <p className="text-xs text-stone-500">with {episode.guestName}</p>}
        <p className="text-xs text-stone-400 mt-1">{new Date(episode.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
    </Link>
  )
}
