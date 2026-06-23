import { spawn } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const STREAM_KEY = process.env.TWITCH_STREAM_KEY;

if (!STREAM_KEY) {
  throw new Error("TWITCH_STREAM_KEY ontbreekt in .env");
}

const RTMP_URL = `rtmp://live.twitch.tv/app/${STREAM_KEY}`;

if (process.env.STREAM === "image") {
  console.log("Streaming image...");

  // Image
  const ffmpeg = spawn("ffmpeg", [
    "-loop",
    "1",
    "-i",
    "data/images/private/image.png",

    "-f",
    "lavfi",
    "-i",
    "anullsrc=channel_layout=stereo:sample_rate=44100",

    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-tune",
    "stillimage",

    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",

    "-c:a",
    "aac",
    "-b:a",
    "128k",

    "-g",
    "60",

    "-shortest",

    "-f",
    "flv",
    RTMP_URL,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg afgesloten met code ${code}`);
  });
}

if (process.env.STREAM === "video") {
  console.log("Streaming video...");

  // Video
  const ffmpeg = spawn("ffmpeg", [
    "-re", // speel af op normale snelheid
    "-i",
    "data/images/private/video.mp4",

    "-c:v",
    "libx264",
    "-preset",
    "veryfast",

    "-c:a",
    "aac",
    "-b:a",
    "128k",

    "-pix_fmt",
    "yuv420p",

    "-f",
    "flv",
    RTMP_URL,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg afgesloten met code ${code}`);
  });
}
