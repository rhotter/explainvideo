const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export interface VideoMetadata {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  tags?: string[];
}

export async function getVideoMetadata(
  videoId: string
): Promise<VideoMetadata> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API error:", errorText);
      throw new Error(`YouTube API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found");
    }

    const snippet = data.items[0].snippet;

    return {
      title: snippet.title,
      description: snippet.description,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      tags: snippet.tags,
    };
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    throw new Error("Failed to fetch video metadata");
  }
}
