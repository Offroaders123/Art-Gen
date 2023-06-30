#!/usr/bin/env npx tsx

import { argv } from "node:process";
import { createRenderer } from "./index.js";

const args = argv.slice(2);
console.log(args);

const renderer = await createRenderer();

for (const songPath of args){
  console.log(songPath);
  const thumbnail = await renderer.generateThumbnail(songPath);
  console.log(thumbnail);
}

await renderer.close();