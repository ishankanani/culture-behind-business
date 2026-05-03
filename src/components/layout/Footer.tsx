import Link from 'next/link'
export default function Footer() {
  return (
    <footer className="bg-[#04342C] text-white/60 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#0F6E56] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#9FE1CB]" />
              </div>
              <span className="text-white text-sm font-medium">TCB</span>
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
              <a href={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || '#'} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">YouTube channel</a>
            </div>
          </div>
          <div>
            <p className="text-white text-xs font-medium uppercase tracking-widest mb-3">Legal</p>
            <div className="space-y-2 text-xs">
              <Link href="/legal" className="block hover:text-white transition-colors">Privacy policy</Link>
              <Link href="/legal?tab=terms" className="block hover:text-white transition-colors">Terms of use</Link>
              <Link href="/legal?tab=cookies" className="block hover:text-white transition-colors">Cookie policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span>© {new Date().getFullYear()} The Culture Behind Business. All rights reserved.</span>
          <Link href="/contact" className="hover:text-white transition-colors">Connect with us</Link>
        </div>
      </div>
    </footer>
  )
}
