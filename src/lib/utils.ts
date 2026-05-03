import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function getYouTubeId(url: string) {
  const match = url.match(/(?:v=|embed\/|youtu\.be\/)([^&?/]+)/)
  return match?.[1] || null
}
export function getYouTubeThumbnail(url: string) {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
