import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Legal Details' }
export default function LegalPage() {
  return (
    <div>
      <section className="bg-[#04342C] py-16 px-4"><div className="max-w-3xl mx-auto"><h1 className="text-4xl font-semibold text-white mb-3">Legal details</h1><p className="text-white/60">Privacy, terms, and cookie policies in plain language.</p></div></section>
      <section className="max-w-3xl mx-auto px-4 py-16 space-y-10">
        {[
          { title: 'Privacy policy', body: 'We collect your email address when you subscribe and your name, email and message when you use the contact form. This information is stored securely on our servers and is never sold or shared with third parties. We use it solely to send you episode notifications and respond to your enquiries.' },
          { title: 'What we collect', body: 'Email addresses for newsletter subscriptions. Contact form submissions including name, email and message. Anonymous usage analytics such as page views and episode play counts to improve the platform. We do not collect payment information or sensitive personal data.' },
          { title: 'Your rights', body: 'You may request deletion of your data at any time by contacting us via the Connect page. Newsletter unsubscribe links are included in every email we send. You can also opt out directly by emailing us. We will process all deletion requests within 30 days.' },
          { title: 'Cookies', body: 'We use only essential cookies required for site functionality and your admin login session. No advertising, tracking, or third-party analytics cookies are placed on your device without your consent.' },
          { title: 'Terms of use', body: 'All content published on this platform including episodes, descriptions, and guest information is the intellectual property of The Culture Behind Business. You may share links to episodes but may not reproduce, redistribute, or monetise the content without written permission.' },
          { title: 'Disclaimer', body: 'The views and opinions expressed by guests are their own and do not necessarily reflect the views of The Culture Behind Business. Content is provided for informational and entertainment purposes only and does not constitute professional advice.' },
        ].map(s => (
          <div key={s.title}>
            <h2 className="text-lg font-medium text-stone-900 mb-3">{s.title}</h2>
            <p className="text-stone-600 leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}
        <div className="bg-stone-100 rounded-xl p-6">
          <p className="text-sm text-stone-500">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. For any legal enquiries, please <a href="/contact" className="text-[#0F6E56] hover:underline">contact us</a>.</p>
        </div>
      </section>
    </div>
  )
}
