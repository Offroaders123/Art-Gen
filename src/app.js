import { input, progress, grid } from "./dom.js";
import { generateThumbnail } from "./thumbnail.js";

// const audio = await fetch(new URL("../test/26.m4a",import.meta.url))
// .then(response => response.blob());

// const images = await runGenerator(audio,audio,audio,audio);
// console.log(images);

input.addEventListener("change",async ({ target }) => {
  if (!(target instanceof HTMLInputElement)) return;

  const files = /** @type { FileList } */ (target.files);

  const thumbnails = await runGenerator(...files);
  console.log(thumbnails);

  target.value = "";
});

/**
 * Runs the thumbnail generator over an array of song files.
 * 
 * @param { ...Blob } songs
*/
async function runGenerator(...songs){
  /** @type { Blob[] } */
  const thumbnails = [];
  
  input.dataset.running = "";
  progress.value = 0;
  progress.max = songs.length;

  for (let i = 0; i < songs.length; i++){
    const song = songs[i];
    const thumbnail = await generateThumbnail(song);
    makeCard(thumbnail);
    thumbnails.push(thumbnail);
    progress.value = i + 1;
  }
  
  progress.removeAttribute("value");
  delete input.dataset.running;

  return thumbnails;
}

/**
 * @param { Blob } thumbnail
*/
async function makeCard(thumbnail){
  const image = new Image();
  const link = URL.createObjectURL(thumbnail);

  await new Promise((resolve,reject) => {
    image.addEventListener("load",resolve,{ once: true });
    image.addEventListener("error",reject,{ once: true });
    image.src = link;
  });

  URL.revokeObjectURL(link);
  grid.append(image);
}

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