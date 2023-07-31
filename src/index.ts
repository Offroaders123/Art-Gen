#!/usr/bin/env npx tsx

import { createInterface } from "node:readline";
import { extname } from "node:path";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import { inputs, artworkOnly, overwrite } from "./args.js";
import { createRenderer } from "./thumbnail.js";
import { rmSync } from "node:fs";
import { defaultLoggerOpts, newLogger } from "./logger.js";

const exec = promisify(execCallback);

export const Logger = newLogger(defaultLoggerOpts());

Logger.log("Art Gen");
Logger.log("-- An app to generate thumbnails for YouTube Art Tracks! --\n");

if (artworkOnly) Logger.debug("[artwork only]");
if (overwrite) Logger.debug("[overwrite]");

const outputs = inputs.map(item => extRename(item, artworkOnly ? ".png" : ".mp4"));

const renderer = await createRenderer();

for (let i = 0; i < inputs.length; i++) {
  const songPath = inputs[i];
  const thumbnailPath = artworkOnly ? outputs[i] : extRename(outputs[i], ".png");
  await renderer.generateThumbnail(songPath, thumbnailPath);
}

await renderer.close();

if (artworkOnly) process.exit(0);

const tempArtwork = await (async () => {
  return new Promise(async (r) => {
    var response = null;
    while (response == null) {
      var t = await prompt("Delete artwork after video is generated? (Y|N): ");
      if (t.toUpperCase() == "Y" || t.toUpperCase() == "N") {
        response = t;
      } else {
        Logger.warning('Invalid response! Answer with "Y" or "N"!\n');
      }
    }
    Logger.debug(`${response}`);
    console.log("");
    r(response == "Y");
  });
})();

Logger.debug(`${tempArtwork}`);

for (let i = 0; i < inputs.length; i++) {
  const songPath = inputs[i];
  const thumbnailPath = extRename(outputs[i], ".png");
  const videoPath = outputs[i];
  Logger.log("Generating video...");
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
    ${overwrite ? "-y" : "-n"}`);

  if (tempArtwork) {
    rmSync(thumbnailPath);
  }
}

Logger.log("Done!");
Logger.critical("Exiting process...");
process.exit(0);

function extRename(path: string, ext: string): string {
  const extension = extname(path);
  return path.replace(extension, ext);
}

async function prompt(prompt: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(prompt, ans => {
    rl.close();
    resolve(ans);
  }));
}