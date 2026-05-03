import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'The Culture Behind Business', template: '%s | The Culture Behind Business' },
  description: 'Deep conversations about culture, leadership, and the people who build companies that matter.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: { siteName: 'The Culture Behind Business', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
