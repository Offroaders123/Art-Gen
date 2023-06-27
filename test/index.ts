import * as fs from "node:fs/promises";
import { launch } from "../src/index.js";

const demo = new URL("./26.m4a",import.meta.url);
const audio = await fs.readFile(demo);

const artGen = await launch();
console.log(artGen);

const thumbnail = await artGen.generateThumbnail(audio);

await fs.writeFile("./demo.png",thumbnail);
await artGen.close();