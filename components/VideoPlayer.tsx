'use client'

import { useState } from 'react'
import YouTube from 'react-youtube'
import AIChat from './AIChat'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function VideoPlayer({ initialUrl = '' }: { initialUrl?: string }) {
  const [videoId, setVideoId] = useState(() => {
    if (initialUrl) {
      const url = new URL(initialUrl)
      return url.searchParams.get('v') || ''
    }
    return ''
  })
  const [player, setPlayer] = useState<any>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.elements.namedItem('videoUrl') as HTMLInputElement
    const url = new URL(input.value)
    const id = url.searchParams.get('v')
    if (id) setVideoId(id)
  }

  const onReady = (event: { target: any }) => {
    setPlayer(event.target)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="videoUrl"
              placeholder="Enter YouTube URL"
              defaultValue={initialUrl}
            />
            <Button type="submit" className="w-full">
              Load Video
            </Button>
          </form>
          {videoId && (
            <div className="mt-4">
              <YouTube
                videoId={videoId}
                opts={{ width: '100%', height: '360' }}
                onReady={onReady}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <AIChat player={player} videoId={videoId} />
    </div>
  )
}

