import { launch } from "puppeteer-core";
import { getChromePath } from "chrome-launcher";

import type { Browser } from "puppeteer-core";

const executablePath = getChromePath();

export async function launchBrowser(): Promise<Browser> {
  return launch({ headless: "new", executablePath });
}