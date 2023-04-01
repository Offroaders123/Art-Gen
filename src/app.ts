import { songInput, songNamesEditor, artworkInput, progress, grid } from "./dom.js";
import { generateThumbnail } from "./thumbnail.js";

// const audio = await fetch(new URL("../test/26.m4a",import.meta.url))
// .then(response => response.blob());

// const images = await runGenerator(audio,audio,audio,audio);
// console.log(images);

songInput.addEventListener("change",async ({ target }) => {
  if (!(target instanceof HTMLInputElement)) return;

  const files = target.files!;

  const thumbnails = await runGenerator(...files);
  console.log(thumbnails);

  target.value = "";
});

songNamesEditor.placeholder = `[
  {
    "title": <string>,
    "artist": <string>,
    "album": <string>
  }
]`;

/**
 * Runs the thumbnail generator over an array of song files.
*/
async function runGenerator(...songs: Blob[]){
  const thumbnails: Blob[] = [];

  document.body.dataset.running = "";
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
  delete document.body.dataset.running;

  return thumbnails;
}

async function makeCard(thumbnail: Blob){
  const image = new Image();
  const link = URL.createObjectURL(thumbnail);

  await new Promise((resolve,reject) => {
    image.addEventListener("load",resolve,{ once: true });
    image.addEventListener("error",reject,{ once: true });
    image.src = link;
  });

  // Can't right-click and download the thumbnail if the Object URL has already been revoked.
  // URL.revokeObjectURL(link);
  grid.append(image);
}

function saveFile(data: File){
  const anchor = document.createElement("a");
  const link = URL.createObjectURL(data);
  anchor.download = link;
  anchor.click();
  URL.revokeObjectURL(link);
}