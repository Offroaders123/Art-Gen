#!/usr/bin/env npx tsx

import arg from "arg";
import { writeFile, rm } from "node:fs/promises";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import { createRenderer } from "./index.js";

const exec = promisify(execCallback);

console.log("Art Gen");
console.log("-- An app to generate thumbnails for YouTube Art Tracks! --\n");

const args = arg({
  "--input": [String],
  "-i": "--input",
  "--output": [String],
  "-o": "--output",
  "--artwork-only": Boolean,
  "-a": "--artwork-only"
});
// console.log(args);

const inputs = args["--input"];
if (inputs === undefined){
  throw new TypeError("Must provide song file path inputs");
}
// console.log(inputs);

const outputs = args["--output"];
if (outputs === undefined){
  throw new TypeError("Must provide thumbnail file outputs");
}
// console.log(outputs);

const artworkOnly = args["--artwork-only"] ?? false;
if (artworkOnly) console.log("[artwork only]");

for (let i = 0; i < inputs.length; i++){
  const songPath = inputs[i];
  const thumbnailPath = outputs[i];
  if (thumbnailPath === undefined){
    console.log(songPath,"--X--");
    throw new TypeError("Please provide an output path for every input path");
  }
  console.log(songPath,thumbnailPath);
}

const renderer = await createRenderer();

for (let i = 0; i < inputs.length; i++){
  const songPath = inputs[i];
  const thumbnailPath = artworkOnly ? outputs[i] : `${outputs[i]}__.png`;
  const thumbnail = await renderer.generateThumbnail(songPath);
  // console.log(thumbnail);
  await writeFile(thumbnailPath,thumbnail);
}

await renderer.close();

if (artworkOnly) process.exit(0);

for (let i = 0; i < inputs.length; i++){
  const songPath = inputs[i];
  const thumbnailPath = `${outputs[i]}__.png`;
  const videoPath = outputs[i];
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
    "${videoPath}" -y`);
  await rm(thumbnailPath);
}