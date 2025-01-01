"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      const videoId = url.searchParams.get("v");

      if (!videoId || !url.hostname.includes("youtube.com")) {
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
      <Card className="w-full max-w-md">
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
    </div>
  );
}
