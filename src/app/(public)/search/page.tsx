import { PrismaClient } from '@prisma/client'
import EpisodeCard from '@/components/ui/EpisodeCard'
import type { Metadata } from 'next'

const db = new PrismaClient()
export const metadata: Metadata = { title: 'Search' }

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() || ''
  const results = q.length >= 2 ? await db.episode.findMany({
    where: { published: true, OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { guestName: { contains: q, mode: 'insensitive' } },
    ]},
    orderBy: { score: 'desc' },
  }) : []

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Search episodes</h1>
      <form method="get" action="/search" className="mb-8 flex gap-3">
        <input name="q" defaultValue={q} placeholder="Search by title, guest, topic..." className="input flex-1 text-base" autoFocus />
        <button type="submit" className="btn-primary px-6">Search</button>
      </form>
      {q.length >= 2 ? (
        results.length > 0 ? (
          <>
            <p className="text-sm text-stone-500 mb-6">{results.length} result{results.length !== 1 ? 's' : ''} for &quot;{q}&quot;</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
            </div>
          </>
        ) : <p className="text-stone-400 text-center py-16">No episodes found for &quot;{q}&quot;</p>
      ) : <p className="text-stone-400 text-center py-16">Type at least 2 characters to search.</p>}
    </div>
  )
}
