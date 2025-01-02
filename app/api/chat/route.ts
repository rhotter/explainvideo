import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { getVideoMetadata } from "@/lib/youtube";

export async function POST(req: Request) {
  try {
    const { messages, model, transcript, videoId, currentTime } =
      await req.json();

    // Fetch video metadata
    let metadata = null;
    try {
      metadata = await getVideoMetadata(videoId);
    } catch (error) {
      console.error("Error fetching video metadata:", error);
      // Continue without metadata
    }

    // Create system message with metadata if available
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant helping with questions about a YouTube video.

${
  metadata
    ? `Video Title: ${metadata.title}
Channel: ${metadata.channelTitle}
Published: ${new Date(metadata.publishedAt).toLocaleDateString()}
Description: ${metadata.description}`
    : ""
}

Current timestamp: ${currentTime} seconds
Recent transcript: ${transcript}

When explaining mathematical concepts:
- Use $...$ for inline math: $E = mc^2$
- Use $$...$$ for block math equations:
- Use LaTeX notation for all mathematical expressions
- Format complex equations as block math for better readability

Please use this context to answer the user's questions about the video.
`,
    };

    // Get the appropriate AI model
    const aiModel = model.startsWith("gpt") ? openai(model) : anthropic(model);

    // Create stream with system message prepended
    const stream = streamText({
      model: aiModel,
      messages: [systemMessage, ...messages],
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
