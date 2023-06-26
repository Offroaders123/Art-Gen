import { generateThumbnail } from "./thumbnail.js";
import { loadImage } from "./image.js";

import type { Tags, PictureType } from "./jsmediatags.js";

// Test #1

// const audio = await fetch(new URL("../test/26.m4a",import.meta.url))
//   .then(response => response.blob())
//   .then(blob => new File([blob],"26.m4a",{ type: blob.type }));

// const images = await runGenerator(audio,audio,audio,audio);
// console.log(images);

// Test #2

// const picture = await fetch(new URL("../test/Artwork.jpg",import.meta.url))
//   .then(response => response.blob())
//   .then(async blob => {
//     const { type: format } = blob;
//     const data = await blob.arrayBuffer()
//       .then(buffer => [...new Uint8Array(buffer)]);
//     return { format, data } as PictureType;
//   });

// const tags = {
//   title: "zz: the lion stink breatH",
//   artist: "rBnaodn",
//   album: "(FORTRAN)",
//   picture
// } as Tags;

// const images = await runGenerator(tags);
// console.log(images);

// Test #3

// songNamesEditor.value = `[
//   {
//     "title": "zz: the lion stink breatH",
//     "artist": "rBnaodn",
//     "album": "(FORTRAN)"
//   }
// ]`;

// // Picture constant from Test 2

// const songTags = JSON.parse(songNamesEditor.value) as SongTags;
// console.log(...songTags);

// for (const tags of songTags){
//   tags.picture = picture;
// }

// const images = await runGenerator(...songTags);
// console.log(images);

// Test #4

// songNamesEditor.value = JSON.stringify([
//   {
//     title: "gg, za",
//     artist: "noice",
//     album: "fartface AAAgh"
//   },
//   {
//     title: "not that one",
//     artist: "gooof",
//     album: "a different one"
//   }
// ],null,2);

export type SongTags = Tags[];

songInput.addEventListener("change",async function(){
  const files = this.files!;

  const thumbnails = await runGenerator(...files);
  console.log(thumbnails);

  this.value = "";
});

artworkInput.addEventListener("change",async function(){
  const [file] = this.files!;
  console.log(file);

  this.value = "";

  const picture = await file.arrayBuffer()
    .then(buffer => {
      const { type: format } = file;
      const data = [...new Uint8Array(buffer)];
      return { format, data } as PictureType;
    });

  let songTags: SongTags;

  try {
    songTags = JSON.parse(songNamesEditor.value) as SongTags;
    console.log(...songTags);
  } catch (error){
    console.error(error);
    alert(error);
    return;
  }

  for (const tags of songTags){
    tags.picture = picture;
  }

  const images = await runGenerator(...songTags);
  console.log(images);
});

/**
 * Runs the thumbnail generator over an array of song files, or song artwork and metadata.
*/
async function runGenerator(...songs: (File | Tags)[]): Promise<Blob[]> {
  const thumbnails: Blob[] = [];

  document.body.dataset.running = "";
  progress.value = 0;
  progress.max = songs.length;

  try {
    for (let i = 0; i < songs.length; i++){
      const song = songs[i];
      const thumbnail = await generateThumbnail(song);
      makeCard(thumbnail);
      thumbnails.push(thumbnail);
      progress.value = i + 1;
    }
  } catch (error){
    console.error(error);
    alert(
      (error instanceof Error)
        ? error
        : `Error: ${JSON.stringify(error)}`
    );
  }

  progress.removeAttribute("value");
  delete document.body.dataset.running;

  return thumbnails;
}

async function makeCard(thumbnail: File): Promise<void> {
  const link = URL.createObjectURL(thumbnail);
  const image = await loadImage(link);

  image.addEventListener("click",function(){
    saveFile(thumbnail);
  });

  // Can't right-click and download the thumbnail if the Object URL has already been revoked.
  // URL.revokeObjectURL(link);
  grid.append(image);
}

function saveFile(data: File): void {
  const anchor = document.createElement("a");
  const link = URL.createObjectURL(data);
  anchor.download = link;
  anchor.click();
  URL.revokeObjectURL(link);
}