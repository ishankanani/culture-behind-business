import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#04342C] text-white/60 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex-shrink-0">
                <Image src="/logo.png" alt="CbB Logo" width={32} height={32} className="object-contain w-full h-full" />
              </div>
              <span className="text-white text-sm font-medium">Culture Behind Business</span>
            </div>
            <p className="text-xs leading-relaxed">Deep conversations about culture, leadership, and the people who build companies that matter.</p>
          </div>
          <div>
            <p className="text-white text-xs font-medium uppercase tracking-widest mb-3">Platform</p>
            <div className="space-y-2 text-xs">
              <Link href="/episodes" className="block hover:text-white transition-colors">All episodes</Link>
              <Link href="/episodes?type=video" className="block hover:text-white transition-colors">Video episodes</Link>
              <Link href="/episodes?type=audio" className="block hover:text-white transition-colors">Audio episodes</Link>
            </div>
          </div>
          <div>
            <p className="text-white text-xs font-medium uppercase tracking-widest mb-3">Company</p>
            <div className="space-y-2 text-xs">
              <Link href="/about" className="block hover:text-white transition-colors">About us</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Connect us</Link>
              <a href={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || '#'} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">YouTube channel</a>
            </div>
          </div>
          <div>
            <p className="text-white text-xs font-medium uppercase tracking-widest mb-3">Legal</p>
            <div className="space-y-2 text-xs">
              <Link href="/legal" className="block hover:text-white transition-colors">Privacy policy</Link>
              <Link href="/legal" className="block hover:text-white transition-colors">Terms of use</Link>
              <Link href="/legal" className="block hover:text-white transition-colors">Cookie policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs">© {new Date().getFullYear()} The Culture Behind Business. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs">Designed & developed by</span>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L7 7L12 2" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L7 12L12 7" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white text-xs font-semibold tracking-wide">Nexify</span>
              <span className="text-white/40 text-xs">·</span>
              <span className="text-white/70 text-xs">Ishan Kanani</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}