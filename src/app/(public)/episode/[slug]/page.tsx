import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import EpisodeCard from '@/components/ui/EpisodeCard'
import AudioPlayer from '@/components/player/AudioPlayer'
import SubscribeForm from '@/components/ui/SubscribeForm'
import { getYouTubeId } from '@/lib/utils'

const db = new PrismaClient()
type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ep = await db.episode.findUnique({ where: { slug: params.slug } })
  if (!ep) return { title: 'Episode not found' }
  return { title: ep.title, description: ep.description, openGraph: { title: ep.title, description: ep.description } }
}

export default async function EpisodePage({ params }: Props) {
  const [episode, allEpisodes] = await Promise.all([
    db.episode.findUnique({ where: { slug: params.slug, published: true } }),
    db.episode.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, slug: true, type: true, createdAt: true, category: true, guestName: true, description: true, youtubeUrl: true } }),
  ])
  if (!episode) notFound()

  const related = allEpisodes.filter(e => e.slug !== params.slug && e.category === episode.category).slice(0, 3)
  const youtubeId = episode.youtubeUrl ? getYouTubeId(episode.youtubeUrl) : null

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-72 bg-[#04342C] lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-white/10">
            <p className="text-[#9FE1CB] text-xs font-medium uppercase tracking-wider">All episodes</p>
          </div>
          {allEpisodes.map((ep, idx) => (
            <Link key={ep.id} href={`/episode/${ep.slug}`}
              className={`flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${ep.slug === params.slug ? 'bg-[#0F6E56] border-l-2 border-l-[#1D9E75]' : ''}`}>
              <span className="text-xs text-white/30 mt-0.5 flex-shrink-0 w-6">{allEpisodes.length - idx}</span>
              <div className="min-w-0">
                <p className={`text-xs leading-snug line-clamp-2 ${ep.slug === params.slug ? 'text-white font-medium' : 'text-white/70'}`}>{ep.title}</p>
                <p className="text-[10px] text-white/30 mt-1">{ep.type} · {ep.category}</p>
              </div>
            </Link>
          ))}
        </aside>

        {/* Main */}
        <div className="flex-1 max-w-3xl mx-auto px-4 py-8">
          <div className="mb-4 flex items-center gap-2">
            <Link href="/episodes" className="text-xs text-stone-400 hover:text-[#0F6E56]">Episodes</Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs text-stone-500 truncate">{episode.title}</span>
          </div>
          <span className={episode.type === 'VIDEO' ? 'ep-type-video' : 'ep-type-audio'}>{episode.type}</span>
          {episode.category && <span className="ml-2 text-xs text-[#0F6E56]">{episode.category}</span>}
          <h1 className="text-2xl font-semibold text-stone-900 mt-3 mb-2 leading-snug">{episode.title}</h1>
          {episode.guestName && <p className="text-stone-500 text-sm mb-6">with {episode.guestName}{episode.guestTitle ? ` — ${episode.guestTitle}` : ''}</p>}

          {youtubeId && (
            <div className="aspect-video mb-8 rounded-xl overflow-hidden">
              <iframe src={`https://www.youtube.com/embed/${youtubeId}`} className="w-full h-full" allowFullScreen title={episode.title} />
            </div>
          )}

          {episode.type === 'AUDIO' && episode.audioUrl && (
            <div className="mb-8"><AudioPlayer src={episode.audioUrl} title={episode.title} /></div>
          )}

          {/* Uploaded video */}
          {episode.type === 'VIDEO' && !youtubeId && episode.youtubeUrl && (
            <div className="aspect-video mb-8 rounded-xl overflow-hidden bg-black">
              <video src={episode.youtubeUrl} controls className="w-full h-full" />
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-medium text-stone-900 mb-3">About this episode</h2>
            <p className="text-stone-600 leading-relaxed">{episode.description}</p>
          </div>

          {(episode.guestName || episode.guestBio) && (
            <div className="bg-[#E1F5EE] rounded-xl p-6 mb-8">
              <h3 className="text-sm font-medium text-[#04342C] mb-1">{episode.guestName}</h3>
              {episode.guestTitle && <p className="text-xs text-[#0F6E56] mb-3">{episode.guestTitle}</p>}
              {episode.guestBio && <p className="text-sm text-[#085041] leading-relaxed">{episode.guestBio}</p>}
            </div>
          )}

          {related.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-stone-900 mb-4">Related episodes</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
              </div>
            </div>
          )}

          <div className="bg-[#04342C] rounded-xl p-6">
            <h3 className="text-white font-medium mb-1">Enjoyed this episode?</h3>
            <p className="text-white/60 text-sm mb-4">Subscribe to get notified when new episodes drop.</p>
            <SubscribeForm />
          </div>
        </div>
      </div>
    </div>
  )
}
