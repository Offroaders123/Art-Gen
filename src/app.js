import { input } from "./dom.js";
import { generateThumbnail } from "./thumbnail.js";

// const audio = await fetch(new URL("../test/26.m4a",import.meta.url))
// .then(response => response.blob());

// const image = await generateThumbnail(audio);
// console.log(image);

input.addEventListener("change",async ({ target }) => {
  if (!(target instanceof HTMLInputElement)) return;

  const files = /** @type { FileList } */ (target.files);

  /** @type { Blob[] } */
  const thumbnails = [];

  for (const file of files){
    const thumbnail = await generateThumbnail(file);
    thumbnails.push(thumbnail);
  }

  console.log(thumbnails);
});

/**
 * @param { File } data
*/
function saveFile(data){
  const anchor = document.createElement("a");
  const link = URL.createObjectURL(data);
  anchor.download = link;
  anchor.click();
  URL.revokeObjectURL(link);
}