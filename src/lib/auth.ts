import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
const SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}
export function verifyToken(token: string) {
  try { return jwt.verify(token, SECRET) as { id: string; username: string } }
  catch { return null }
}
export function getAdminFromCookie() {
  const token = cookies().get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}
