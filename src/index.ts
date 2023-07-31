#!/usr/bin/env npx tsx

import { createInterface } from "node:readline";
import { extname, basename } from "node:path";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import { inputs, artworkOnly, overwrite, debugMode } from "./args.js";
import { createRenderer } from "./thumbnail.js";
import { rmSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { defaultLoggerOpts, newLogger } from "./logger.js";
import chalk from "chalk";
import { readTags } from "./jsmediatags.js";

const exec = promisify(execCallback);

export const Logger = newLogger(defaultLoggerOpts(debugMode));

const termed: string[] = [];
const allowed: string[] = [];

Logger.log(chalk.bold("Art Gen"));
Logger.log("-- An app to generate thumbnails for YouTube Art Tracks! --\n");

if (artworkOnly) Logger.debug("[artwork only]");
if (overwrite) Logger.debug("[overwrite]");

const outputs = inputs.map(item => extRename(item, artworkOnly ? ".png" : ".mp4"));

const renderer = await createRenderer();

for (let i = 0; i < inputs.length; i++) {
  const songPath = inputs[i];
  const thumbnailPath = artworkOnly ? outputs[i] : extRename(outputs[i], ".png");
  const song = await readFile(songPath);
  const tags = await readTags(song);
  const { title, artist, album } = tags;
  Logger.log(`${title}: ${artist} - ${album}`);
  await renderer.generateThumbnail(songPath, thumbnailPath, overwrite, artworkOnly);
}

await renderer.close();

if (artworkOnly) end();


Logger.debugLineBreak();
const tempArtwork = await (async () => {
  return new Promise(async (r) => {
    var response = null;
    var _prompt_ = async () => {
      var t = await prompt(`Delete artwork after video${inputs.length > 1 ? "s" : ""} ${inputs.length > 1 ? "are" : "is"} generated? (Y/N): `);
      if (t.toUpperCase() == "Y" || t.toUpperCase() == "N") {
        response = t;
      } else {
        Logger.warning('Invalid response! Answer with "Y" or "N"!\n');
        await _prompt_();
      }
    }
    await _prompt_();
    Logger.lineBreak();
    Logger.debug(`${response}`);
    r(response == "Y");
  });
})();

Logger.debug(`${tempArtwork}`);

for (let i: number = 0; i < inputs.length; i++) {
  const songPath: string = inputs[i];
  if (termed.indexOf(songPath) >= 0) {
    Logger.log(basename(songPath) + " skipped! Overwrite denied.");
    continue;
  }
  const thumbnailPath = extRename(outputs[i], ".png");
  const videoPath = outputs[i];
  Logger.log(basename(songPath) + " | Generating video...");
  Logger.debug(songPath);
  Logger.debug(thumbnailPath);
  Logger.debug(videoPath);
  await exec(`ffmpeg \
    -loop 1 \
    -framerate 1 \
    -i "${thumbnailPath}" \
    -i "${songPath}" \
    -map 0 \
    -map 1:a \
    -c:v libx264 \
    -preset ultrafast \
    -tune stillimage \
    -vf "scale=out_color_matrix=bt709,fps=10,format=yuv420p" \
    -c:a aac \
    -shortest \
    "${videoPath}"\
    ${allowed.indexOf(songPath) >= 0 ? "-y" : "-n"}`);
  if (tempArtwork) {
    Logger.debug("Removing " + thumbnailPath);
    rmSync(thumbnailPath);
  }
}

end();

function extRename(path: string, ext: string): string {
  const extension = extname(path);
  return path.replace(extension, ext);
}

export async function prompt(prompt: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(prompt, ans => {
    rl.close();
    resolve(ans);
  }));
}

export function term(songPath: string) {
  termed.push(songPath);
}
export function allow(songPath: string) {
  allowed.push(songPath);
}
export function end() {
  Logger.log("Done!");
  Logger.critical("Exiting process...");
  process.exit(0);
}