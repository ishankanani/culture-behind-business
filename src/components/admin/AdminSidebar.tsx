'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { href: '/manage-episodes', label: 'Episodes', icon: 'video' },
  { href: '/manage-episodes/new', label: 'New episode', icon: 'plus' },
  { href: '/categories', label: 'Categories', icon: 'tag' },
  { href: '/subscribers', label: 'Subscribers', icon: 'users' },
  { href: '/contacts', label: 'Messages', icon: 'mail' },
  { href: '/newsletter', label: 'Newsletter', icon: 'send' },
  { href: '/site-settings', label: 'Site settings', icon: 'image' },
  { href: '/settings', label: 'Account', icon: 'settings' },
]

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="1" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
    video: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 5l3 2-3 2V5z" fill="currentColor"/></svg>,
    plus: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    tag: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M1 1h5.5l6 6-5.5 5.5-6-6V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="4" cy="4" r="1" fill="currentColor"/></svg>,
    users: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    mail: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    send: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6h6M4 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    image: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="4.5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 9l3-3 2.5 2.5L9 6l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    settings: <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1v1.5M7 11.5V13M13 7h-1.5M2.5 7H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  }
  return <>{icons[name]}</>
}

export default function AdminSidebar() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <aside className="w-52 bg-[#04342C] flex flex-col min-h-screen flex-shrink-0">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-[#0F6E56] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#9FE1CB]"/>
          </div>
          <span className="text-white text-xs font-medium">Admin Panel</span>
        </div>
        <p className="text-white/40 text-[10px]">The Culture Behind Business</p>
      </div>

      <nav className="p-2 flex-1">
        {nav.map(item => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs mb-0.5 transition-colors text-white/60 hover:text-white hover:bg-white/5">
            <Icon name={item.icon} />{item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors mb-1">
          <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M6 1L1 6l5 5M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          View site
        </Link>
        <button onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-red-300 hover:bg-white/5 transition-colors w-full">
          <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M8 2h2a1 1 0 011 1v6a1 1 0 01-1 1H8M5 9l3-3-3-3M1 6h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Log out
        </button>
      </div>
    </aside>
  )
}