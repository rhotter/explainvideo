import { redirect } from 'next/navigation'
import VideoPlayer from '@/components/VideoPlayer'

export default function VideoPage({ params }: { params: { video: string[] } }) {
  const videoUrl = params.video.join('/')
  
  if (!videoUrl.startsWith('https://www.youtube.com/watch?v=')) {
    redirect('/')
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">YouTube AI Chat</h1>
      <VideoPlayer initialUrl={`https://${videoUrl}`} />
    </div>
  )
}

