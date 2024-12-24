import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages, model, transcript, screenshot, videoId } = await req.json()

  const systemMessage = `You are an AI assistant helping with questions about a YouTube video.
  Video ID: ${videoId}
  Recent transcript: ${transcript}
  Current screenshot description: ${screenshot}
  
  Please use this context to answer the user's questions about the video.`

  const aiModel = model.startsWith('gpt') ? openai(model) : anthropic(model)

  const result = streamText({
    model: aiModel,
    messages: [
      { role: 'system', content: systemMessage },
      ...messages,
    ],
  })

  return result.toDataStreamResponse()
}

