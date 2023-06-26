import * as puppeteer from "puppeteer";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { readTags } from "./jsmediatags.js";

import type { Server } from "node:http";

class ArtGen {
  static async make(song: Uint8Array): Promise<ArtGen> {
    const index = await readFile(new URL("../index.html",import.meta.url),{ encoding: "utf-8" });
    const { title, artist, album, artwork } = await readTags(song);

    if (title === undefined){
      throw new Error("Could not load title from song");
    }
    if (artist === undefined){
      throw new Error("Could not load artist from song");
    }
    if (album === undefined){
      throw new Error("Could not load album from song");
    }
    if (artwork === undefined){
      throw new Error("Could not load artwork from song");
    }

    const artworkURL = `data:${artwork.type};base64,${Buffer.from(await artwork.arrayBuffer()).toString("base64")}`;
    console.log(artworkURL);
  
    const src = index
      .replaceAll("%TITLE%",title)
      .replaceAll("%ARTIST%",artist)
      .replaceAll("%ALBUM%",album)
      .replaceAll("%ARTWORK%",artworkURL);

    const server = createServer((_request,response) => {
      response.writeHead(200,{ "Content-Type": "text/html" });
      response.write(src);
      response.end();
    });

    await new Promise<void>(resolve => server.listen(3000,resolve));

    const browser = await puppeteer.launch({ headless: "new" });

    return new ArtGen(browser,server);
  }

  private constructor(private browser: puppeteer.Browser, private server: Server) {}

  async makeThumbnail(): Promise<Buffer> {
    const page = await this.browser.newPage();

    await page.goto("http://localhost:3000",{ waitUntil: "networkidle0" });
    await page.setViewport({ width: 1920, height: 1080 });

    return page.screenshot();
  }

  async close(): Promise<void> {
    await this.browser.close();
    await new Promise<Error | undefined>(resolve => this.server.close(resolve));
  }
}

const { make } = ArtGen;

export { make, type ArtGen };