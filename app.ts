import { spawn } from "child_process";
import dotenv from "dotenv";

dotenv.config();

if (!STREAM_KEY) {
    throw new Error("TWITCH_STREAM_KEY ontbreekt in .env");
}

const STREAM_KEY = process.env.TWITCH_STREAM_KEY;
const RTMP_URL = `rtmp://live.twitch.tv/app/${STREAM_KEY}`;

const ffmpeg = spawn("ffmpeg", [
    "-loop", "1",
    "-i", "image.png",

    "-f", "lavfi",
    "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",

    "-c:v", "libx264",
    "-preset", "veryfast",
    "-tune", "stillimage",

    "-pix_fmt", "yuv420p",
    "-r", "30",

    "-c:a", "aac",
    "-b:a", "128k",

    "-g", "60",

    "-shortest",

    "-f", "flv",
    RTMP_URL
]);

ffmpeg.stderr.on("data", (data) => {
    console.log(data.toString());
});

ffmpeg.on("close", (code) => {
    console.log(`FFmpeg afgesloten met code ${code}`);
});