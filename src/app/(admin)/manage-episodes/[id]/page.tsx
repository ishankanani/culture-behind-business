import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import EditEpisodeForm from '@/components/admin/EditEpisodeForm'

const db = new PrismaClient()
type Props = { params: { id: string } }

export default async function EditEpisodePage({ params }: Props) {
  const episode = await db.episode.findUnique({ where: { slug: params.id } })
  if (!episode) notFound()
  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center">
        <h1 className="text-base font-medium">Edit episode</h1>
      </div>
      <div className="p-6 max-w-3xl">
        <EditEpisodeForm episode={episode} />
      </div>
    </div>
  )
}
