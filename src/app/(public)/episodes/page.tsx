import { PrismaClient } from '@prisma/client'
import EpisodeCard from '@/components/ui/EpisodeCard'
import type { Metadata } from 'next'

const db = new PrismaClient()
export const metadata: Metadata = { title: 'Episodes' }

export default async function EpisodesPage({ searchParams }: { searchParams: { type?: string; category?: string } }) {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
  const where: Record<string, unknown> = { published: true }
  if (searchParams.type === 'video') where.type = 'VIDEO'
  if (searchParams.type === 'audio') where.type = 'AUDIO'
  if (searchParams.category && searchParams.category !== 'All') where.category = searchParams.category

  const episodes = await db.episode.findMany({ where, orderBy: [{ score: 'desc' }, { createdAt: 'desc' }] })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900 mb-2">All episodes</h1>
        <p className="text-stone-500">Explore every conversation — filter by type or topic.</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {['all', 'video', 'audio'].map(t => (
          <a key={t} href={`/episodes${t !== 'all' ? `?type=${t}` : ''}`}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${(searchParams.type === t) || (!searchParams.type && t === 'all') ? 'bg-[#0F6E56] text-white border-[#0F6E56]' : 'border-stone-300 text-stone-600 hover:border-[#0F6E56]'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </a>
        ))}
        {categories.length > 0 && <div className="w-px bg-stone-200 mx-1" />}
        {categories.map(cat => (
          <a key={cat.id} href={`/episodes?category=${cat.name}`}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${searchParams.category === cat.name ? 'bg-[#E1F5EE] text-[#085041] border-[#E1F5EE]' : 'border-stone-300 text-stone-600 hover:border-stone-400'}`}>
            {cat.name}
          </a>
        ))}
      </div>
      {episodes.length === 0 ? (
        <p className="text-stone-400 text-center py-20">No episodes found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
        </div>
      )}
    </div>
  )
}
