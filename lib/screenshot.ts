import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export async function getVideoScreenshot(
  videoUrl: string,
  timestamp: number,
  outputPath: string
) {
  const startTime = Date.now();
  try {
    // Get direct video URL using youtube-dl
    console.log("Starting to fetch video URL...");
    const urlStartTime = Date.now();
    const { stdout: directUrl } = await execAsync(
      `yt-dlp -f best -g "${videoUrl}"`
    );
    console.log(`Got video URL in ${Date.now() - urlStartTime}ms`);

    // Take screenshot using ffmpeg with formatted timestamp
    console.log("Starting to take screenshot...");
    const screenshotStartTime = Date.now();
    const formattedTime = formatTimestamp(timestamp);
    await execAsync(
      `ffmpeg -ss ${formattedTime} -i "${directUrl.trim()}" -frames:v 1 -s 1920x1080 "${outputPath}"`
    );
    console.log(`Took screenshot in ${Date.now() - screenshotStartTime}ms`);

    const totalTime = Date.now() - startTime;
    console.log(`Total screenshot process took ${totalTime}ms`);
    return true;
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error("Error taking screenshot:", error);
    console.error(`Failed after ${totalTime}ms`);
    return false;
  }
}

export function ensureScreenshotsDir() {
  const screenshotsDir = path.join(process.cwd(), "public", "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  return screenshotsDir;
}

export function getScreenshotPath(videoId: string, timestamp: number) {
  const screenshotsDir = ensureScreenshotsDir();
  return path.join(screenshotsDir, `${videoId}_${timestamp}.jpg`);
}

export async function getScreenshotAsBase64(
  filePath: string
): Promise<string | null> {
  try {
    const imageBuffer = await fs.promises.readFile(filePath);
    return `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error reading screenshot:", error);
    return null;
  }
}

export { formatTimestamp };
