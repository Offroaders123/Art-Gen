#!/usr/bin/env npx tsx

import arg from "arg";
import { readFile, writeFile } from "node:fs/promises";
import { createRenderer } from "./index.js";

const args = arg({
  "--input": [String],
  "--output": [String]
});
console.log(args);

const inputs = args["--input"];
if (inputs === undefined){
  throw new TypeError("Must provide song file path inputs");
}
console.log(inputs);

const outputs = args["--output"];
if (outputs === undefined){
  throw new TypeError("Must provide thumbnail file outputs");
}
console.log(outputs);

const renderer = await createRenderer();

for (let i = 0; i < inputs.length; i++){
  const songPath = inputs[i];
  const thumbnailPath = outputs[i];
  if (thumbnailPath === undefined){
    throw new TypeError("Please provide an output path for every input path");
  }
  console.log(songPath,thumbnailPath);
  const thumbnail = await renderer.generateThumbnail(songPath);
  console.log(thumbnail);
  await writeFile(thumbnailPath,thumbnail);
}

await renderer.close();