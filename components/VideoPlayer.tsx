"use client";

import { useState, useEffect } from "react";
import YouTube, { YouTubePlayer, YouTubeEvent } from "react-youtube";
import { Card, CardContent } from "@/components/ui/card";

export default function VideoPlayer({ videoId }: { videoId: string }) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
  };

  // Send time updates to parent
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      window.postMessage({ type: "timeUpdate", currentTime }, "*");
    }, 1000);

    return () => clearInterval(interval);
  }, [player]);

  return (
    <Card>
      <CardContent className="p-6">
        <YouTube
          videoId={videoId}
          opts={{
            width: "100%",
            height: "600",
            playerVars: {
              autoplay: 1,
            },
          }}
          onReady={onReady}
          className="aspect-video"
        />
      </CardContent>
    </Card>
  );
}
