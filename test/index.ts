import * as fs from "node:fs/promises";
import ArtGen from "../src/index.js";

const artGen = await ArtGen.make();
console.log(artGen);

const thumbnail = await artGen.makeThumbnail();

await fs.writeFile("./demo.png",thumbnail);
await artGen.close();