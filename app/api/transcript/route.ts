import { Innertube } from "youtubei.js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });
    const info = await youtube.getInfo(videoId);

    const captions = info.getTranscript();
    if (!captions) {
      throw new Error("No captions available for this video");
    }

    const transcriptData = await info.getTranscript();
    const segments =
      transcriptData.transcript.content?.body?.initial_segments || [];

    const formattedTranscript = segments.map((segment: any) => ({
      text: String(segment.snippet.text),
      offset: Number(segment.start_ms) / 1000,
      duration: (Number(segment.end_ms) - Number(segment.start_ms)) / 1000,
    }));

    return NextResponse.json({ transcript: formattedTranscript });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
