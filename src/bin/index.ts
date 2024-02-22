#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
  .option("-a, --artwork-only")
  .option("-w, --overwrite")
  .parse();

// import { generateArtTracks } from "../index.js";
// import { inputs, artworkOnly, overwrite } from "./args.js";

// console.log("Art Gen");
// console.log("-- An app to generate thumbnails for YouTube Art Tracks! --\n");

// if (artworkOnly) console.log("[artwork only]");
// if (overwrite) console.log("[overwrite]");

// await generateArtTracks(inputs,{ artworkOnly, overwrite });