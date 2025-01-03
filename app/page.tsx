"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("videoUrl") as HTMLInputElement;

    try {
      const url = new URL(input.value);
      let videoId: string | null = null;

      // Handle standard youtube.com and m.youtube.com URLs
      if (url.hostname.includes("youtube.com")) {
        videoId = url.searchParams.get("v");
      }
      // Handle youtu.be URLs
      else if (url.hostname === "youtu.be") {
        videoId = url.pathname.slice(1); // Remove the leading slash
      }

      if (!videoId) {
        setError("Please enter a valid YouTube URL");
        return;
      }

      router.push(`/watch?v=${videoId}`);
    } catch {
      setError("Please enter a valid URL");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Explain Video</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="videoUrl"
                placeholder="Enter YouTube URL"
                className="w-full"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Start Watching
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-xs text-gray-500 mt-8">
          Try an example:{" "}
          <Link href="/watch?v=0JUN9aDxVmI" className="text-gray-500 underline">
            Advanced Algorithms (COMPSCI 224)
          </Link>
        </p>
      </div>
    </div>
  );
}
