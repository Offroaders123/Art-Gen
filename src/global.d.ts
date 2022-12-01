declare global {
  interface Window {
    FFmpeg: typeof import("@ffmpeg/ffmpeg");
    jsmediatags: typeof import("jsmediatags");
  }
}

export {};