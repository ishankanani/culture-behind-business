'use client'
import { useRouter } from 'next/navigation'
export default function DeleteSubscriberBtn({ id }: { id: string }) {
  const router = useRouter()
  async function del() {
    if (!confirm('Remove this subscriber?')) return
    await fetch(`/api/subscribers/${id}`, { method: 'DELETE' })
    router.refresh()
  }
  return <button onClick={del} className="text-[10px] px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition-colors">Remove</button>
}
