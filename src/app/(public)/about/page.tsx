import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
export const metadata: Metadata = { title: 'About Us' }

export default async function AboutPage() {
  let hosts: { id: string; name: string; role: string; bio: string; image?: string | null }[] = []
  try {
    hosts = await db.hostProfile.findMany({ orderBy: { order: 'asc' } })
  } catch (err) {
    console.error('Failed to load hosts:', err)
  }

  return (
    <div>
      <section className="bg-[#04342C] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#1D9E75] text-sm font-medium mb-3 uppercase tracking-wider">Our story</p>
          <h1 className="text-4xl font-semibold text-white leading-tight mb-4">About the show</h1>
          <p className="text-white/60 leading-relaxed text-lg">We go behind the scenes of business to find the culture that makes or breaks companies.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">What we are</h2>
            <p className="text-stone-600 leading-relaxed mb-4">The Culture Behind Business started with a simple question: what actually makes a great company? Not the strategy decks or the press releases — the real human stuff. The rituals, the values, the hard conversations.</p>
            <p className="text-stone-600 leading-relaxed mb-4">Every week we sit down with founders, operators, and cultural architects to get honest about what building really looks like from the inside.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/episodes" className="btn-primary">Browse episodes</Link>
              <Link href="/contact" className="btn-secondary">Get in touch</Link>
            </div>
          </div>
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image src="/both.jpeg" alt="The Culture Behind Business hosts" fill className="object-cover object-top" />
          </div>
        </div>
      </section>

      {/* Meet the hosts */}
      <section className="bg-stone-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#1D9E75] text-sm font-medium mb-2 uppercase tracking-wider">The team</p>
            <h2 className="text-3xl font-semibold text-stone-900">Meet your hosts</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {hosts.length > 0 ? hosts.map(host => (
              <div key={host.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-72 bg-[#085041]">
                  {host.image ? (
                    <Image src={host.image} alt={host.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[#0F6E56] flex items-center justify-center text-3xl font-semibold text-white">
                        {host.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#04342C]/80 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <p className="text-white font-semibold text-lg">{host.name}</p>
                    <p className="text-[#9FE1CB] text-sm">{host.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-stone-600 text-sm leading-relaxed">{host.bio}</p>
                </div>
              </div>
            )) : (
              [
                { name: 'Host One', role: 'Co-Host & Producer', bio: 'Add host profiles from Admin → Site Settings.' },
                { name: 'Host Two', role: 'Co-Host & Creator', bio: 'Add host profiles from Admin → Site Settings.' },
              ].map((host, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                  <div className="relative h-72 bg-[#085041]">
                    <Image src="/both.jpeg" alt={host.name} fill className="object-cover object-top" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#04342C]/80 to-transparent" />
                    <div className="absolute bottom-4 left-5">
                      <p className="text-white font-semibold text-lg">{host.name}</p>
                      <p className="text-[#9FE1CB] text-sm">{host.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-stone-600 text-sm leading-relaxed">{host.bio}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-stone-900 mb-8 text-center">Our values</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '🎙', title: 'Honest conversations', desc: 'No PR scripts. We ask the real questions and expect real answers.' },
              { icon: '🔬', title: 'Deep research', desc: 'Every guest is researched for weeks before we sit down to record.' },
              { icon: '🌱', title: 'Culture first', desc: 'We believe people and culture are the foundation of all business outcomes.' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-stone-200">
                <div className="w-10 h-10 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-lg mb-4">{v.icon}</div>
                <h3 className="font-medium text-stone-900 mb-2">{v.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
