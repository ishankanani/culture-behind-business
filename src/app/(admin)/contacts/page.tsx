import { PrismaClient } from '@prisma/client'
import MarkReadBtn from '@/components/admin/MarkReadBtn'

const db = new PrismaClient()

export default async function ContactsPage() {
  const contacts = await db.contact.findMany({ orderBy: { createdAt: 'desc' } })
  const unread = contacts.filter(c => !c.read).length
  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center">
        <h1 className="text-base font-medium">Messages {unread > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unread} unread</span>}</h1>
      </div>
      <div className="p-6 max-w-3xl space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-400 text-sm">No messages yet.</div>
        ) : contacts.map(c => (
          <div key={c.id} className={`bg-white border rounded-xl p-5 ${!c.read ? 'border-[#0F6E56]' : 'border-stone-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {!c.read && <div className="w-2 h-2 rounded-full bg-[#1D9E75] flex-shrink-0"/>}
                <div>
                  <p className="text-sm font-medium text-stone-900">{c.name}</p>
                  <p className="text-xs text-stone-500">{c.email}</p>
                </div>
              </div>
              <span className="text-xs text-stone-400">{new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {c.subject && <p className="text-xs font-medium text-[#0F6E56] mb-2">{c.subject}</p>}
            <p className="text-sm text-stone-600 leading-relaxed">{c.message}</p>
            <div className="flex gap-2 mt-4">
              <a href={`mailto:${c.email}?subject=Re: ${c.subject || 'Your message'}`} className="text-xs px-3 py-1.5 rounded-lg border border-[#0F6E56] text-[#0F6E56] hover:bg-[#E1F5EE] transition-colors">Reply via email</a>
              {!c.read && <MarkReadBtn id={c.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
