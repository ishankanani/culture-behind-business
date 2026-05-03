import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM || 'noreply@example.com'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'The Culture Behind Business'

export async function sendNewEpisodeEmails(
  emails: string[],
  episode: { title: string; description: string; slug: string; guestName?: string | null }
) {
  if (!emails.length) return
  const link = `${SITE}/episode/${episode.slug}`
  const batches: string[][] = []
  for (let i = 0; i < emails.length; i += 50) batches.push(emails.slice(i, i + 50))
  for (const batch of batches) {
    await resend.batch.send(batch.map((email) => ({
      from: FROM, to: email,
      subject: `New episode: ${episode.title}`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#04342C;padding:24px;border-radius:12px 12px 0 0">
          <p style="color:#9FE1CB;font-size:12px;margin:0 0 8px">${SITE_NAME}</p>
          <h1 style="color:#fff;font-size:22px;margin:0">${episode.title}</h1>
          ${episode.guestName ? `<p style="color:rgba(255,255,255,0.65);font-size:13px;margin:8px 0 0">with ${episode.guestName}</p>` : ''}
        </div>
        <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px">
          <p style="font-size:14px;line-height:1.7;color:#444;margin:0 0 20px">${episode.description}</p>
          <a href="${link}" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-size:14px;font-weight:500;display:inline-block">Listen now</a>
          <p style="font-size:11px;color:#999;margin-top:24px">
            <a href="${SITE}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#0F6E56">Unsubscribe</a>
          </p>
        </div>
      </div>`,
    })))
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: `Welcome to ${SITE_NAME}`,
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#04342C;padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;font-size:20px;margin:0">Welcome${name ? `, ${name}` : ''}!</h1>
      </div>
      <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px">
        <p style="font-size:14px;line-height:1.7;color:#444">You have subscribed to ${SITE_NAME}. You will get notified every time a new episode drops.</p>
        <a href="${SITE}/episodes" style="background:#0F6E56;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-size:14px;display:inline-block">Browse episodes</a>
      </div>
    </div>`,
  })
}

export async function sendCustomNewsletter(emails: string[], subject: string, body: string) {
  if (!emails.length) return
  const batches: string[][] = []
  for (let i = 0; i < emails.length; i += 50) batches.push(emails.slice(i, i + 50))
  for (const batch of batches) {
    await resend.batch.send(batch.map((email) => ({
      from: FROM, to: email, subject,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#04342C;padding:20px;border-radius:12px 12px 0 0">
          <p style="color:#9FE1CB;font-size:12px;margin:0">${SITE_NAME}</p>
        </div>
        <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px">
          <div style="font-size:14px;line-height:1.8;color:#444;white-space:pre-line">${body}</div>
          <p style="font-size:11px;color:#999;margin-top:24px">
            <a href="${SITE}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#0F6E56">Unsubscribe</a>
          </p>
        </div>
      </div>`,
    })))
  }
}
