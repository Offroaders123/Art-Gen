import { readTags, fromPicture } from "./jsmediatags.mjs";

const demo = await fetch("../test/26.m4a")
.then(response => response.blob());

const thumbnail = await generateThumbnail(demo);

/**
 * Generates a video thumbnail for a given song file.
 * 
 * @param { Blob } song
*/
export async function generateThumbnail(song){
  const canvas = document.querySelector("canvas");
  if (canvas === null){
    throw new ReferenceError("Cannot find canvas");
  }

  const ctx = canvas.getContext("2d");
  if (ctx === null){
    throw new SyntaxError("Cannot create canvas context");
  }

  const tags = await readTags(song);
  console.log(tags);

  if (typeof tags.picture === "undefined"){
    throw new TypeError("Cannot load artwork from song");
  }

  const image = await fromPicture(tags.picture);

  const { naturalHeight } = image;
  const { width, height } = canvas;

  ctx.translate(0,height / 2);
  ctx.translate(0,-naturalHeight / 2);

  ctx.filter = "blur(30px)";

  for (let i = 0; i < 16; i++){
    ctx.drawImage(image,0,0,width,naturalHeight);
  }

  ctx.resetTransform();
  ctx.filter = "none";

  ctx.fillStyle = "rgb(0 0 0 / 0.7)";
  ctx.fillRect(0,0,width,height);

  ctx.drawImage(image,135,135,810,810);
}