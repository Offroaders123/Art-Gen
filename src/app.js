import { generateThumbnail } from "./thumbnail.js";

const demo = await fetch(new URL("../test/26.m4a",import.meta.url))
.then(response => response.blob());

const thumbnail = await generateThumbnail(demo);