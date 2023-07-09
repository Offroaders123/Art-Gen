#!/usr/bin/env npx tsx

import arg from "arg";
import { writeFile } from "node:fs/promises";
import { createRenderer } from "./index.js";

console.log("Art Gen");
console.log("-- An app to generate thumbnails for YouTube Art Tracks! --\n");

const args = arg({
  "--input": [String],
  "-i": "--input",
  "--output": [String],
  "-o": "--output"
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

const renderer = await createRenderer();

for (let i = 0; i < inputs.length; i++){
  const songPath = inputs[i];
  const thumbnailPath = outputs[i];
  if (thumbnailPath === undefined){
    console.log(songPath,"--X--");
    throw new TypeError("Please provide an output path for every input path");
  }
  console.log(songPath,thumbnailPath);
}

for (let i = 0; i < inputs.length; i++){
  const songPath = inputs[i];
  const thumbnailPath = outputs[i];
  const thumbnail = await renderer.generateThumbnail(songPath);
  // console.log(thumbnail);
  await writeFile(thumbnailPath,thumbnail);
}

await renderer.close();