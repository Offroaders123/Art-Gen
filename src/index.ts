#!/usr/bin/env npx tsx

import { extname } from "node:path";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import { inputs, artworkOnly, overwrite } from "./args.js";
import { createRenderer } from "./thumbnail.js";

const exec = promisify(execCallback);

console.log("Art Gen");
console.log("-- An app to generate thumbnails for YouTube Art Tracks! --\n");

if (artworkOnly) console.log("[artwork only]");
if (overwrite) console.log("[overwrite]");

const outputs: string[] = inputs.map(item => extRename(item,artworkOnly ? ".png" : ".mp4"));

const renderer = await createRenderer();

for (let i = 0; i < inputs.length; i++){
  const songPath = inputs[i]!;
  const thumbnailPath: string = artworkOnly ? outputs[i]! : extRename(outputs[i]!,".png");
  await renderer.generateThumbnail(songPath,thumbnailPath);
}

await renderer.close();

if (artworkOnly) process.exit(0);

for (let i = 0; i < inputs.length; i++){
  const songPath: string = inputs[i]!;
  const thumbnailPath = extRename(outputs[i]!,".png");
  const videoPath: string = outputs[i]!;
  console.log("Generating video...");
  // console.log(songPath);
  // console.log(thumbnailPath);
  // console.log(videoPath);
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
}

function extRename(path: string, ext: string): string {
  const extension = extname(path);
  return path.replace(extension,ext);
}