import * as fs from "node:fs/promises";
import ArtGen from "../src/index.js";

const demo = new URL("./26.m4a",import.meta.url);
const buffer = await fs.readFile(demo);
const audio = new File([buffer],"26.m4a");

const artGen = await ArtGen.make();
console.log(artGen);

const thumbnail = await artGen.makeThumbnail(audio);

// await fs.writeFile("./demo.png",thumbnail);
// await artGen.close();