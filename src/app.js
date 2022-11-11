import { generateThumbnail } from "./thumbnail.js";
import { embedCSSURLs } from "./embed.js";

const demo = await fetch(new URL("../test/26.m4a",import.meta.url))
.then(response => response.blob());

// const thumbnail = await generateThumbnail(demo);

const customFontFace = await embedCSSURLs(
  await fetch("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap")
  .then(response => response.text())
);

console.log(customFontFace);