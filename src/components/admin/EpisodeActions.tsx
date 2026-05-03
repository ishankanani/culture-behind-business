'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EpisodeActions({ slug, published }: { slug: string; published: boolean }) {
  const router = useRouter()

  async function del() {
    if (!confirm('Delete this episode?')) return
    await fetch(`/api/episodes/${slug}`, { method: 'DELETE' })
    router.refresh()
  }

  async function togglePublish() {
    await fetch(`/api/episodes/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    router.refresh()
  }

  return (
    <div className="flex gap-1 flex-wrap">
      <Link
        href={`/manage-episodes/${slug}`}
        className="text-[10px] px-2 py-1 rounded border border-[#0F6E56] text-[#0F6E56] hover:bg-[#E1F5EE] transition-colors">
        Edit
      </Link>
      <button
        onClick={togglePublish}
        className={`text-[10px] px-2 py-1 rounded border transition-colors ${
          published
            ? 'border-amber-400 text-amber-600 hover:bg-amber-50'
            : 'border-[#0F6E56] bg-[#0F6E56] text-white hover:bg-[#085041]'
        }`}>
        {published ? 'Unpublish' : 'Publish'}
      </button>
      <button
        onClick={del}
        className="text-[10px] px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition-colors">
        Del
      </button>
    </div>
  )
}