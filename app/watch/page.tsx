import { redirect } from 'next/navigation'
import VideoPlayer from '@/components/VideoPlayer'
import AIChat from '@/components/AIChat'

export default function WatchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const videoId = searchParams.v

  if (!videoId || typeof videoId !== 'string') {
    redirect('/')
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4">
        <VideoPlayer videoId={videoId} />
        <AIChat videoId={videoId} />
      </div>
    </div>
  )
}

