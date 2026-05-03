import { PrismaClient } from '@prisma/client'
import DeleteSubscriberBtn from '@/components/admin/DeleteSubscriberBtn'

const db = new PrismaClient()

export default async function SubscribersPage() {
  const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center justify-between">
        <h1 className="text-base font-medium">Subscribers ({subscribers.length})</h1>
      </div>
      <div className="p-6">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[36px_1fr_150px_120px_80px] gap-3 px-4 py-3 bg-stone-50 border-b border-stone-200 text-[10px] font-medium text-stone-500 uppercase tracking-wider">
            <span></span><span>Email</span><span>Name</span><span>Joined</span><span>Action</span>
          </div>
          {subscribers.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">No subscribers yet.</div>
          ) : subscribers.map(sub => (
            <div key={sub.id} className="grid grid-cols-[36px_1fr_150px_120px_80px] gap-3 px-4 py-3 border-b border-stone-50 last:border-0 items-center">
              <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center text-xs font-medium text-[#085041]">
                {(sub.name || sub.email).charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-stone-700 truncate">{sub.email}</span>
              <span className="text-xs text-stone-500">{sub.name || '—'}</span>
              <span className="text-xs text-stone-400">{new Date(sub.createdAt).toLocaleDateString('en-GB')}</span>
              <DeleteSubscriberBtn id={sub.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
