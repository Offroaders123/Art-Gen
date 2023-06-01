#!/usr/bin/env node
import { argv, exit } from "node:process";
import { readFile } from "node:fs/promises";
import { readSong } from "./jsmediatags.js";

/**
 * See {@linkcode argv} for more info.
*/
export type Args = [unknown,unknown,string | undefined];

try {

const [,,songPath] = argv as Args;

if (!songPath){
  throw new Error("Please pass in a song file to read");
}
console.log(songPath,"\n");

const songData = await readFile(songPath);
console.log(songData,"\n");

const mediaTags = await readSong(songData);
console.log(mediaTags);

} catch (error: any){
  console.error(
    ("info" in error)
      // jsmediatags error object
      ? `${error.type}: ${error.info}`
      // regular Error object instances
      : `${error}`);
  exit();
}