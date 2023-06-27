import { launchBrowser } from "./puppeteer.js";
import { startServer } from "./server.js";
import { readTags } from "./jsmediatags.js";

import type { MediaTags } from "./jsmediatags.js";

let server: Awaited<ReturnType<typeof startServer>> | null = null;
let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null;

export let tags: MediaTags | null;

export interface ArtGen {
  generateThumbnail: typeof generateThumbnail;
  close: typeof close;
}

export async function launch(): Promise<ArtGen> {
  server = await startServer();
  browser = await launchBrowser();
  return { generateThumbnail, close };
}

async function generateThumbnail(song: Uint8Array): Promise<Buffer> {
  if (browser === null){
    throw new Error("Could not generate the thumbnail, the browser wasn't opened yet");
  }

  const page = await browser.newPage();
  tags = await readTags(song);

  await page.goto("http://localhost:3000",{ waitUntil: "networkidle0" });
  await page.setViewport({ width: 1920, height: 1080 });

  return page.screenshot();
}

async function close(): Promise<void> {
  await browser?.close();
  await new Promise<Error | undefined>(resolve => server?.close(resolve));
}