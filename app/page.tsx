import VideoPlayer from '@/components/VideoPlayer'

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">YouTube AI Chat</h1>
      <VideoPlayer />
    </div>
  )
}

