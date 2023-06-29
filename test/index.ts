import { writeFile } from "node:fs/promises";
import { createRenderer } from "../src/index.js";

const audio = new URL("./26.m4a",import.meta.url).toString();

const artGen = await createRenderer();
console.log(artGen);

const thumbnail = await artGen.generateThumbnail(audio);

await writeFile("./demo.png",thumbnail);
await artGen.close();