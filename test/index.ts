import * as fs from "node:fs/promises";
import { make } from "../src/index.js";

const demo = new URL("./26.m4a",import.meta.url);
const audio = await fs.readFile(demo);

const artGen = await make(audio);
console.log(artGen);

const thumbnail = await artGen.makeThumbnail();

await fs.writeFile("./demo.png",thumbnail);
await artGen.close();