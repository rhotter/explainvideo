'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AIChat({ player, videoId }: { player: any; videoId: string }) {
  const [model, setModel] = useState('gpt-4o')
  const [transcript, setTranscript] = useState('')
  const [screenshot, setScreenshot] = useState('')

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { model, transcript, screenshot, videoId },
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (player) {
        updateTranscriptAndScreenshot()
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(intervalId)
  }, [player])

  const updateTranscriptAndScreenshot = async () => {
    if (player) {
      const currentTime = player.getCurrentTime()
      const startTime = Math.max(0, currentTime - 180) // 3 minutes ago

      // This is a placeholder. In a real application, you'd need to implement
      // actual transcription and screenshot capture.
      setTranscript(`Transcript from ${startTime} to ${currentTime}`)
      setScreenshot(`Screenshot at ${currentTime}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={(value) => setModel(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4</SelectItem>
            <SelectItem value="claude-3-5-sonnet-20240620">Claude</SelectItem>
          </SelectContent>
        </Select>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {messages.map((m) => (
            <div key={m.id} className="mb-4 last:mb-0">
              <p className="font-semibold">{m.role === 'user' ? 'You:' : 'AI:'}</p>
              <p>{m.content}</p>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about the video..."
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}

