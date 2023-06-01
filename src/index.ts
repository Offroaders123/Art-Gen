#!/usr/bin/env node
import { argv } from "node:process";
import { readFile } from "node:fs/promises";
import { readSong } from "./jsmediatags.js";

console.log(argv);

const songPath = argv[2];
console.log(songPath);

const songData = await readFile(songPath);
console.log(songData);

const mediaTags = await readSong(songData);
console.log(mediaTags);