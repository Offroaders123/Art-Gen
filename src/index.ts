#!/usr/bin/env npx tsx

import { createInterface } from "node:readline";
import { extname, basename, join, dirname } from "node:path";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import { inputs, artworkOnly, overwrite, recursive, debugMode, threaded } from "./args.js";
import { createRenderer } from "./thumbnail.js";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { defaultLoggerOpts, newLogger } from "./logger.js";
import chalk from "chalk";
import { readTags } from "./jsmediatags.js";
import { cpus, totalmem } from "node:os";
import { Timer as _T } from "./timing.js";

const exec = promisify(execCallback);

export const Logger = newLogger(defaultLoggerOpts(debugMode));

const termed: string[] = [];
const allowed: string[] = [];

const threadQueue: string[] = [];
const queueAddList: string[] = [];

const maxThreads = Math.max(Math.floor((cpus().length - 2) * ((totalmem() / 1e+9) / 24)), 1);
if (threaded) Logger.debug("[threaded] MAX=" + maxThreads);

const Timer = new _T();
Timer.start();

let queueCallback: Function | null;
type DynamicFuncObj = {
  [key: string]: Function
}
type DynamicArrayObj = {
  [key: string]: Array<string>
}
const queueCallbackList: DynamicFuncObj = {}

Logger.log(chalk.bold("Art Gen"));
Logger.log("-- An app to generate thumbnails for YouTube Art Tracks! --\n");

if (artworkOnly) Logger.debug("[artwork only]");
if (overwrite) Logger.debug("[overwrite]");

const loadedFolders: DynamicArrayObj = {}
var cycleFolders = async function (i: number = 0) {
  try {
    var recurs = async (dir: string = inputs[i], splice: boolean = true) => {
      if (statSync(dir).isDirectory()) {
        Logger.debug(`${splice ? "F" : "Subf"}older detected ${dir}`);
        loadedFolders[dir] = [];
        if (splice) inputs.splice(i, 1);
        var rdir = readdirSync(dir, { recursive });
        rdir.forEach((file) => {
          var fname = file.toString();
          if (statSync(join(dir, fname)).isDirectory() && recursive) recurs(join(dir, fname), false);
          if (extname(fname) == '.mp3' && inputs.indexOf(join(dir, fname)) < 0) {
            inputs.push(join(dir, fname));
            Logger.debug(`${fname} found in ${dir}`);
            loadedFolders[dir].push(fname);
          }
        });
      }
    }
    recurs();
  } catch (e) { }
  if (!!inputs[i + 1]) await cycleFolders(i + 1);
}
await cycleFolders();

for (const key in loadedFolders) {
  if (loadedFolders[key].length > 0) Logger.info(`Found: ${loadedFolders[key].join(", ")} in ${key}`);
}

Logger.debug(inputs);

const outputs = inputs.map(item => extRename(item, artworkOnly ? ".png" : ".mp4"));

const renderer = await createRenderer();

if (threaded) Logger.log(`Generating thumbnails...\n`);
var cycleSongs = async function (i: number = 0) {
  const songPath = inputs[i];
  const thumbnailPath = artworkOnly ? outputs[i] : extRename(outputs[i], ".png");
  const song = await readFile(songPath);
  const tags = await readTags(song);
  const { title, artist, album } = tags;
  if (!threaded) Logger.log(`${title}: ${artist} - ${album}`);
  var _overwrite: boolean = false;
  if ((existsSync(thumbnailPath) || (existsSync(outputs[i]) && !artworkOnly)) && !overwrite) {
    _overwrite = await (async () => {
      Timer.stop();
      return new Promise(async (r) => {
        var response = null;
        if (threaded) Logger.log(`${title}: ${artist} - ${album}`);
        var _prompt_ = async () => {
          var t = await prompt("File already exists! Would you like to overwrite? (Y/N): ");
          if (t.toUpperCase() == "Y" || t.toUpperCase() == "N") {
            response = t.toUpperCase();
            if (t.toUpperCase() == "N") {
              Logger.log("Skipping file...");
              Logger.lineBreak();
              term(songPath);
            }
          } else {
            Logger.warning('Invalid response! Answer with "Y" or "N"!\n');
            await _prompt_();
          }
        }
        await _prompt_();
        if (threaded) Logger.lineBreak();
        Logger.debug(`${response}`);
        r(response == "Y");
      });
    })();
  } else {
    _overwrite = true;
  }
  Timer.start();
  if (!threaded) {
    if (_overwrite || overwrite) await renderer.generateThumbnail(songPath, thumbnailPath, overwrite || _overwrite, threaded);
  } else {
    await addToQueue(songPath);
    if (_overwrite || overwrite) renderer.generateThumbnail(songPath, thumbnailPath, overwrite || _overwrite, threaded);
  }
  if (!!inputs[i + 1]) await cycleSongs(i + 1);
}
await cycleSongs();
await waitForQueue();


await renderer.close();

if (artworkOnly) end();

Logger.debugLineBreak();
const tempArtwork: boolean = await (async () => {
  Timer.stop();
  return new Promise(async (r) => {
    var response = null;
    var _prompt_ = async () => {
      var t = await prompt(`Delete artwork after video${inputs.length > 1 ? "s" : ""} ${inputs.length > 1 ? "are" : "is"} generated? (Y/N): `);
      if (t.toUpperCase() == "Y" || t.toUpperCase() == "N") {
        response = t.toUpperCase();
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
Timer.start();

Logger.debug(`${tempArtwork}`);

for (let i: number = 0; i < inputs.length; i++) {
  const songPath: string = inputs[i];
  if (termed.indexOf(songPath) >= 0) {
    Logger.log(basename(songPath) + " skipped! Overwrite denied.");
    continue;
  }
  const thumbnailPath = extRename(outputs[i], ".png");
  const videoPath = outputs[i];
  Logger.debug(songPath);
  Logger.debug(thumbnailPath);
  Logger.debug(videoPath);
  if (!threaded) {
    Logger.log(basename(songPath) + " | Generating video...");
    await exec(`ffmpeg \
                -loop 1 \
                -framerate 1 \
                -i "${thumbnailPath}" \
                -i "${songPath}" \
                -map 0 \
                -map 1:a \
                -preset ultrafast \
                -c:v libx264 \
                -vf "scale=out_color_matrix=bt709,fps=10,format=yuv420p" \
                -tune stillimage \
                -shortest \
                -c:a aac \
                "${videoPath}"\
    ${allowed.indexOf(songPath) >= 0 ? "-y" : "-n"}`);
    if (tempArtwork) {
      Logger.debug("Removing " + thumbnailPath);
      rmSync(thumbnailPath);
    }
  } else {
    await addToQueue(songPath);
    (async (): Promise<void> => {
      Logger.log(basename(songPath) + " | Generating video...");
      return new Promise(async (r) => {
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
        Logger.debug(tempArtwork);
        if (tempArtwork) {
          Logger.debug("Removing " + thumbnailPath);
          await rm(thumbnailPath);
        }
        queueFinish(songPath);
        r();
      });
    })();
  }
}

await waitForQueue();

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

  return new Promise(resolve => rl.question(chalk.greenBright(prompt), ans => {
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
  Timer.stop();
  Logger.log(`Done! ${(Timer.getTime() / 1000).toLocaleString(undefined, { minimumFractionDigits: 3 })}s elapsed`);
  Logger.critical("Exiting process...");
  Timer.reset();
  process.exit(0);
}
export async function waitForQueue(): Promise<void> {
  if (threadQueue.length < 1) return new Promise(r => r());
  return new Promise(r => {
    queueCallback = r;
  });
}
export function queueFinish(songPath: string) {
  threadQueue.splice(threadQueue.indexOf(songPath), 1);
  if (queueAddList.length > 0 && threadQueue.length < maxThreads) {
    var add = queueAddList.shift()!;
    threadQueue.push(add);
    queueCallbackList[add]();
    delete queueCallbackList[add];
  }
  if (threadQueue.length < 1 && !!queueCallback) {
    queueCallback();
    queueCallback = null;
  }
}
export async function addToQueue(songPath: string): Promise<void> {
  if (threadQueue.length < maxThreads) {
    threadQueue.push(songPath);
    return new Promise(r => r());
  }
  queueAddList.push(songPath);
  return new Promise(r => {
    queueCallbackList[songPath] = r;
  });
}