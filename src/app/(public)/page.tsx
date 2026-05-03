import Link from 'next/link'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client'
import EpisodeCard from '@/components/ui/EpisodeCard'
import SubscribeForm from '@/components/ui/SubscribeForm'

const db = new PrismaClient()

async function getSettings() {
  try {
    const settings = await db.siteSetting.findMany()
    const map: Record<string, string> = {}
    settings.forEach(s => { map[s.key] = s.value })
    return map
  } catch {
    return {}
  }
}

export default async function HomePage() {
  const [episodes, episodeCount, subscriberCount, settings] = await Promise.all([
    db.episode.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
    db.episode.count({ where: { published: true } }),
    db.subscriber.count(),
    getSettings(),
  ])

  const heroImage = settings.hero_image || '/both.jpeg'
  const heroTitle = settings.hero_title || 'Your destination for the best in business storytelling'
  const heroSubtitle = settings.hero_subtitle || 'Deep conversations about culture, leadership, and the people who build companies that matter.'

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#04342C] py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#1D9E75] text-sm font-medium mb-3 uppercase tracking-wider">The Culture Behind Business</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-5">{heroTitle}</h1>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">{heroSubtitle}</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/episodes" className="bg-[#1D9E75] text-white px-6 py-3 rounded-full font-medium hover:bg-[#0F6E56] transition-colors">Browse episodes</Link>
              <a href={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || '#'} target="_blank" rel="noopener noreferrer"
                className="border border-white/20 text-white/80 px-6 py-3 rounded-full font-medium hover:border-white/40 hover:text-white transition-colors">YouTube channel</a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image src={heroImage} alt="The Culture Behind Business hosts" fill className="object-cover object-top" priority />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#04342C]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-xs font-medium">Your hosts</p>
                <p className="text-white/70 text-[11px]">The Culture Behind Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-stone-200">
          {[
            { val: `${episodeCount}+`, label: 'Episodes published' },
            { val: subscriberCount > 0 ? `${(subscriberCount / 1000).toFixed(1)}k+` : String(subscriberCount), label: 'Email subscribers' },
            { val: '50+', label: 'World-class guests' },
          ].map((s, i) => (
            <div key={i} className="py-8 px-6 text-center">
              <div className="text-3xl font-semibold text-[#0F6E56] mb-1">{s.val}</div>
              <div className="text-sm text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Episodes */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-stone-900">Latest episodes</h2>
          <Link href="/episodes" className="text-sm text-[#0F6E56] hover:underline">See all</Link>
        </div>
        {episodes.length === 0 ? (
          <div className="text-center py-20"><p className="text-stone-400 text-sm">No episodes yet. Check back soon!</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
          </div>
        )}
      </section>

      {/* Subscribe CTA */}
      <section className="bg-[#04342C] mx-4 md:mx-auto max-w-6xl rounded-2xl px-8 py-12 mb-16">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold text-white mb-2">Never miss an episode</h2>
          <p className="text-white/60 text-sm mb-6">Get notified the moment a new episode drops. No spam, ever.</p>
          <SubscribeForm />
        </div>
      </section>
    </div>
  )
}
