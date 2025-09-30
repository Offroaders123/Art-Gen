import { createServer } from "node:http";
import { launch } from "puppeteer-core";
import { getChromePath } from "chrome-launcher";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readTags } from "./jsmediatags.js";

import type { Server } from "node:http";
import type { Browser } from "puppeteer-core";
import type { MediaTags } from "./jsmediatags.js";

const SERVER_PATH = "http://localhost:3000";

export async function createRenderer(): Promise<ThumbnailGenerator> {
  const server = await startServer();
  const browser = await launchBrowser();
  return new ThumbnailGenerator(server,browser);
}

async function startServer(): Promise<Server> {
  const server = createServer(async (request,response) => {
    const url = new URL(`${SERVER_PATH}${request.url}`);
    // console.log(url.toString());
    if (url.searchParams.size === 0) return new Promise(resolve => response.end(resolve));
    const songPath = decodeURIComponent(url.searchParams.get("songPath")!);
    console.log(`\n${songPath}`);
    const song = await readFile(songPath) as unknown as Uint8Array;
    const tags = await readTags(song);
    const source = await generateSource(tags);
    response.writeHead(200,{ "Content-Type": "text/html" });
    response.write(source);
    await new Promise(resolve => response.end(resolve));
  });
  await new Promise<void>(resolve => server.listen(3000,resolve));
  return server;
}

async function generateSource(tags: MediaTags): Promise<string> {
  const index = new URL("../index.html",import.meta.url);
  const source: string = await readFile(index,{ encoding: "utf-8" });
  const { title, artist, album, artwork } = tags;
  console.log(`${title}: ${artist} - ${album}`);
  console.log("Generating thumbnail...");
  return source
    .replaceAll("%TITLE%",title)
    .replaceAll("%ARTIST%",artist)
    .replaceAll("%ALBUM%",album)
    .replaceAll("%ARTWORK%",artwork);
}

async function launchBrowser(): Promise<Browser> {
  const executablePath: string = getChromePath();
  return launch({ headless: true, executablePath });
}

class ThumbnailGenerator {
  #server: Server;
  #browser: Browser;

  constructor(server: Server, browser: Browser) {
    this.#server = server;
    this.#browser = browser;
  }

  async generateThumbnail(songPath: string, thumbnailPath: string, overwrite: boolean = false): Promise<void> {
    const page = await this.#browser.newPage();
    const renderPath = new URL(SERVER_PATH);
    renderPath.searchParams.set("songPath",encodeURIComponent(resolve(songPath)));

    await page.goto(renderPath.toString(),{ waitUntil: "networkidle0" });
    await page.setViewport({ width: 1920, height: 1080 });

    const thumbnail = await page.screenshot() as unknown as Uint8Array;
    // console.log(thumbnail);
    await writeFile(thumbnailPath,thumbnail,{ flag: overwrite ? undefined : "wx" });
  }

  async close(): Promise<void> {
    await this.#browser.close();
    await new Promise<Error | undefined>(resolve => this.#server.close(resolve));
  }
}
