import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const db = new PrismaClient()

export default async function DashboardPage() {
  const [epCount, subCount, contactCount, topEps, recentEps, recentSubs] = await Promise.all([
    db.episode.count(),
    db.subscriber.count(),
    db.contact.count({ where: { read: false } }),
    db.episode.findMany({ orderBy: { score: 'desc' }, take: 5, select: { id: true, title: true, type: true, published: true, slug: true, score: true } }),
    db.episode.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    db.subscriber.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium text-stone-900">Dashboard</h1>
        <Link href="/manage-episodes/new" className="btn-primary text-xs px-4 py-2">+ New episode</Link>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total episodes', val: epCount, href: '/manage-episodes' },
            { label: 'Subscribers', val: subCount.toLocaleString(), href: '/subscribers' },
            { label: 'Unread messages', val: contactCount, href: '/contacts' },
            { label: 'Published', val: topEps.filter(e => e.published).length, href: '/manage-episodes' },
          ].map(s => (
            <Link key={s.label} href={s.href} className="bg-white border border-stone-200 rounded-xl p-5 hover:border-[#0F6E56] transition-colors">
              <p className="text-xs text-stone-400 mb-2">{s.label}</p>
              <p className="text-3xl font-semibold text-stone-900">{s.val}</p>
            </Link>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-sm font-medium text-stone-900">Recent episodes</h2>
              <Link href="/manage-episodes" className="text-xs text-[#0F6E56]">View all</Link>
            </div>
            {recentEps.map(ep => (
              <div key={ep.id} className="flex items-center gap-3 px-5 py-3 border-b border-stone-50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-[#085041] flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M4 3l5 3-5 3V3z" fill="rgba(255,255,255,0.7)"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-800 truncate">{ep.title}</p>
                  <p className="text-[10px] text-stone-400">{ep.guestName || 'No guest'}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${ep.published ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-stone-100 text-stone-400'}`}>
                  {ep.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-sm font-medium text-stone-900">Recent subscribers</h2>
              <Link href="/subscribers" className="text-xs text-[#0F6E56]">View all</Link>
            </div>
            {recentSubs.map(sub => (
              <div key={sub.id} className="flex items-center gap-3 px-5 py-3 border-b border-stone-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center text-xs font-medium text-[#085041] flex-shrink-0">
                  {(sub.name || sub.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-800 truncate">{sub.email}</p>
                  {sub.name && <p className="text-[10px] text-stone-400">{sub.name}</p>}
                </div>
                <span className="text-[10px] text-stone-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
