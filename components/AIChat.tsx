"use client";

import { useState, useEffect, memo } from "react";
import { useChat } from "ai/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface TranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

// Memoized message component for better performance
const Message = memo(({ role, content }: { role: string; content: string }) => (
  <div
    className={`mb-4 last:mb-0 ${
      role === "user" ? "text-primary" : "text-muted-foreground"
    }`}
  >
    <p className="font-semibold">{role === "user" ? "You:" : "AI:"}</p>
    {role === "user" ? (
      <p className="mt-1">{content}</p>
    ) : (
      <div className="mt-1 prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </div>
    )}
  </div>
));
Message.displayName = "Message";

export default function AIChat({ videoId }: { videoId: string }) {
  const [model, setModel] = useState("gpt-4o");
  const [currentTime, setCurrentTime] = useState(0);
  const [fullTranscript, setFullTranscript] = useState<TranscriptItem[]>([]);

  // Custom submit handler to include current transcript context
  const handleSubmitWithContext = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Get transcript from last 3 minutes
    const threeMinutesAgo = currentTime - 180;
    const relevantTranscript = fullTranscript
      .filter((item) => {
        const endTime = item.offset + item.duration;
        return endTime >= threeMinutesAgo && item.offset <= currentTime;
      })
      .map((item) => item.text)
      .join(" ");

    // Submit with current context
    handleSubmit(e, {
      body: {
        model,
        transcript: relevantTranscript,
        videoId,
        currentTime,
      },
    });
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  // Fetch full transcript on mount
  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await fetch(`/api/transcript?videoId=${videoId}`);
        if (!response.ok) throw new Error("Failed to fetch transcript");
        const data = await response.json();
        setFullTranscript(data.transcript);
      } catch (error) {
        console.error("Error fetching transcript:", error);
      }
    };
    fetchTranscript();
  }, [videoId]);

  // Listen for time updates from the video player
  useEffect(() => {
    const handleMessages = (event: MessageEvent) => {
      if (event.data.type === "timeUpdate") {
        setCurrentTime(event.data.currentTime);
      }
    };

    window.addEventListener("message", handleMessages);
    return () => {
      window.removeEventListener("message", handleMessages);
    };
  }, []);

  return (
    <Card className="h-[calc(100vh-2rem)]">
      <CardHeader>
        <CardTitle>AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-5rem)]">
        <Select defaultValue={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="claude-3-5-sonnet-20240620">
              Claude Sonnet 3.5
            </SelectItem>
            <SelectItem value="o1">o1</SelectItem>
          </SelectContent>
        </Select>

        <ScrollArea className="flex-1 p-4 rounded-md border mb-4 mt-4">
          {messages.map((m) => (
            <Message key={m.id} role={m.role} content={m.content} />
          ))}
        </ScrollArea>

        <form onSubmit={handleSubmitWithContext} className="flex gap-2">
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
  );
}
