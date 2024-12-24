'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AIChat({ videoId }: { videoId: string }) {
  const [model, setModel] = useState('gpt-4o')
  const [transcript, setTranscript] = useState('')
  const [screenshot, setScreenshot] = useState('')

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { model, transcript, screenshot, videoId },
  })

  // Placeholder for transcript and screenshot updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now()
      setTranscript(`Transcript at ${currentTime}`)
      setScreenshot(`Screenshot at ${currentTime}`)
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card className="h-[calc(100vh-2rem)]">
      <CardHeader>
        <CardTitle>AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-5rem)]">
        <Select 
          defaultValue={model} 
          onValueChange={setModel}
          className="mb-4"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4</SelectItem>
            <SelectItem value="claude-3-5-sonnet-20240620">Claude</SelectItem>
          </SelectContent>
        </Select>
        
        <ScrollArea className="flex-1 p-4 rounded-md border mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-4 last:mb-0 ${
                m.role === 'user' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <p className="font-semibold">{m.role === 'user' ? 'You:' : 'AI:'}</p>
              <p className="mt-1">{m.content}</p>
            </div>
          ))}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the video..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}

