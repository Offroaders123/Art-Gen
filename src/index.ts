import * as puppeteer from "puppeteer";
import { createServer } from "http-server";

import type { Server } from "node:http";

export default class ArtGen {
  static async make(): Promise<ArtGen> {
    const root = decodeURIComponent(new URL("../",import.meta.url).pathname);

    const server = createServer({ root: root }) as Server;
    await new Promise<void>(resolve => server.listen(3000,resolve));

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto("http://localhost:3000",{ waitUntil: "networkidle0" });
    await page.setViewport({ width: 1920, height: 1080 });

    return new this(browser,page,server);
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