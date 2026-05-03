'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Connect us' },
  { href: '/legal', label: 'Legal' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#04342C] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F6E56] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#9FE1CB]" />
          </div>
          <span className="text-white font-medium text-sm hidden sm:block">The Culture Behind Business</span>
          <span className="text-white font-medium text-sm sm:hidden">TCB</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 text-sm rounded-full transition-colors text-white/60 hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/contact"
          className="hidden md:block bg-[#1D9E75] text-white text-sm px-4 py-1.5 rounded-full hover:bg-[#0F6E56] transition-colors">
          Contact
        </Link>

        <button onClick={() => setOpen(!open)}
          className="md:hidden text-white/70 hover:text-white p-1">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#04342C] border-t border-white/10 px-4 pb-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-white/70 hover:text-white border-b border-white/5">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}