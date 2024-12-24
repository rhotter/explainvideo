'use client'

import { useState } from 'react'
import YouTube from 'react-youtube'
import { Card, CardContent } from "@/components/ui/card"

export default function VideoPlayer({ videoId }: { videoId: string }) {
  const [player, setPlayer] = useState<any>(null)

  const onReady = (event: { target: any }) => {
    setPlayer(event.target)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '600',
            playerVars: {
              autoplay: 1,
            },
          }}
          onReady={onReady}
          className="aspect-video"
        />
      </CardContent>
    </Card>
  )
}

