import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import EpisodeActions from '@/components/admin/EpisodeActions'

const db = new PrismaClient()

export default async function AdminEpisodesPage() {
  const episodes = await db.episode.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium">Episodes ({episodes.length})</h1>
        <Link href="/manage-episodes/new" className="btn-primary text-xs px-4 py-2">+ New episode</Link>
      </div>
      <div className="p-6">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_80px_70px_60px_130px] gap-3 px-4 py-3 bg-stone-50 border-b border-stone-200 text-[10px] font-medium text-stone-500 uppercase tracking-wider">
            <span>#</span><span>Title</span><span>Type</span><span>Status</span><span>Score</span><span>Actions</span>
          </div>
          {episodes.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">No episodes yet. <Link href="/manage-episodes/new" className="text-[#0F6E56]">Create your first episode.</Link></div>
          ) : episodes.map((ep, i) => (
            <div key={ep.id} className="grid grid-cols-[40px_1fr_80px_70px_60px_130px] gap-3 px-4 py-3 border-b border-stone-50 last:border-0 items-center">
              <span className="text-xs text-stone-400">{episodes.length - i}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-stone-800 truncate">{ep.title}</p>
                <p className="text-[10px] text-stone-400">{ep.guestName || '—'}</p>
              </div>
              <span className={ep.type === 'VIDEO' ? 'ep-type-video' : 'ep-type-audio'}>{ep.type}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${ep.published ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-stone-100 text-stone-400'}`}>{ep.published ? 'Live' : 'Draft'}</span>
              <span className="text-xs text-stone-500">{ep.score}</span>
              <EpisodeActions slug={ep.slug} published={ep.published} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
