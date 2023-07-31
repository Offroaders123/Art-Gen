import { createServer } from "node:http";
import { launch } from "puppeteer-core";
import { getChromePath } from "chrome-launcher";
import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { overwrite } from "./args.js";
import { readTags } from "./jsmediatags.js";

import type { Server } from "node:http";
import type { Browser } from "puppeteer-core";
import type { MediaTags } from "./jsmediatags.js";
import { Logger, allow, prompt, term } from "./index.js";
import { existsSync } from "node:fs";

const SERVER_PATH = "http://localhost:3000";

export async function createRenderer(): Promise<ThumbnailGenerator> {
  const server = await startServer();
  const browser = await launchBrowser();
  return new ThumbnailGenerator(server, browser);
}

async function startServer(): Promise<Server> {
  const server = createServer(async (request, response) => {
    const url = new URL(`${SERVER_PATH}${request.url}`);
    Logger.debug(url.toString());
    if (url.searchParams.size === 0) return new Promise(resolve => response.end(resolve));
    const songPath = decodeURIComponent(url.searchParams.get("songPath")!);
    Logger.debug(`${songPath}\n`);
    const song = await readFile(songPath);
    const tags = await readTags(song);
    const source = await generateSource(tags);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(source);
    await new Promise(resolve => response.end(resolve));
  });
  await new Promise<void>(resolve => server.listen(3000, resolve));
  return server;
}

async function generateSource(tags: MediaTags): Promise<string> {
  const index = new URL("../index.html", import.meta.url);
  const source = await readFile(index, { encoding: "utf-8" });
  const { title, artist, album, artwork } = tags;
  Logger.log("Generating thumbnail...\n");
  return source
    .replaceAll("%TITLE%", title)
    .replaceAll("%ARTIST%", artist)
    .replaceAll("%ALBUM%", album)
    .replaceAll("%ARTWORK%", artwork);
}

async function launchBrowser(): Promise<Browser> {
  const executablePath = getChromePath();
  return launch({ headless: true, executablePath });
}

class ThumbnailGenerator {
  #server: Server;
  #browser: Browser;

  constructor(server: Server, browser: Browser) {
    this.#server = server;
    this.#browser = browser;
  }

  async generateThumbnail(songPath: string, thumbnailPath: string, overwrite: boolean): Promise<boolean> {
    return new Promise(async (_resolve) => {
      const page = await this.#browser.newPage();
      const renderPath = new URL(SERVER_PATH);
      renderPath.searchParams.set("songPath", encodeURIComponent(resolve(songPath)));

      await page.goto(renderPath.toString(), { waitUntil: "networkidle0" });
      await page.setViewport({ width: 1920, height: 1080 });

      const thumbnail = await page.screenshot();
      Logger.debug(thumbnail);

      await writeFile(thumbnailPath, thumbnail);
      allow(songPath);
      _resolve(overwrite);
    });
  }

  async close(): Promise<void> {
    await this.#browser.close();
    await new Promise<Error | undefined>(resolve => this.#server.close(resolve));
  }
}