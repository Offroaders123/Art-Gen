import * as puppeteer from "puppeteer";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

import type { Server } from "node:http";

class ArtGen {
  static async make(): Promise<ArtGen> {
    const index = await readFile(new URL("../index.html",import.meta.url),{ encoding: "utf-8" });

    const server = createServer((_request,response) => {
      response.writeHead(200,{ "Content-Type": "text/html" });
      response.write(index);
      response.end();
    });

    await new Promise<void>(resolve => server.listen(3000,resolve));

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto("http://localhost:3000",{ waitUntil: "networkidle0" });
    await page.setViewport({ width: 1920, height: 1080 });

    return new ArtGen(browser,page,server);
  }

  private constructor(private browser: puppeteer.Browser, private page: puppeteer.Page, private server: Server) {}

  async makeThumbnail(): Promise<Buffer> {
    return this.page.screenshot();
  }

  async close(): Promise<void> {
    await this.browser.close();
    await new Promise<Error | undefined>(resolve => this.server.close(resolve));
  }
}

const { make } = ArtGen;

export { make, type ArtGen };