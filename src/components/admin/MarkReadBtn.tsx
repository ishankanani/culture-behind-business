'use client'
import { useRouter } from 'next/navigation'
export default function MarkReadBtn({ id }: { id: string }) {
  const router = useRouter()
  async function mark() {
    await fetch(`/api/contacts/${id}`, { method: 'PATCH' })
    router.refresh()
  }
  return <button onClick={mark} className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 text-stone-500 hover:bg-stone-50 transition-colors">Mark read</button>
}
