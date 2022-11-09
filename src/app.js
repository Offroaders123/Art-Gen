import { fromSVG } from "./image.js";
import { readTags, fromPicture } from "./jsmediatags.js";

const canvas = /** @type { HTMLCanvasElement } */
(document.querySelector("canvas"));

const ctx = /** @type { CanvasRenderingContext2D } */
(canvas.getContext("2d"));

const demo = await fetch(new URL("../test/26.m4a",import.meta.url))
.then(response => response.blob());

const thumbnail = await generateThumbnail(demo);

/**
 * Generates a video thumbnail for a given song file.
 * 
 * @param { Blob } song
*/
export async function generateThumbnail(song){
  const tags = await readTags(song);
  console.log(tags);

  if (typeof tags.picture === "undefined"){
    throw new TypeError("Cannot load artwork from song");
  }

  const artwork = await fromPicture(tags.picture);

  const { naturalHeight } = artwork;
  const { width, height } = canvas;

  ctx.translate(0,height / 2);
  ctx.translate(0,-naturalHeight / 2);

  ctx.filter = "blur(30px)";

  for (let i = 0; i < 16; i++){
    ctx.drawImage(artwork,0,0,width,naturalHeight);
  }

  ctx.resetTransform();
  ctx.filter = "none";

  ctx.fillStyle = "rgb(0 0 0 / 0.7)";
  ctx.fillRect(0,0,width,height);

  ctx.drawImage(artwork,135,135,810,810);

  const { title, artist, album } = tags;
  console.log(title,artist,album);

  const template = document.createElement("template");

  template.innerHTML = `
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <style>
        div {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #ffffff;
          font-size: 50px;
          font-family: "Noto Sans", monospace;
        }
        .title {
          margin-bottom: 88px;
          font-size: 70px;
          font-weight: bold;
        }
        .artist {
          margin-bottom: 44px;
        }
      </style>
      <foreignObject x="1058" y="135" width="789" height="810">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <span class="title">${title}</span>
          <span class="artist">${artist}</span>
          <span class="album">${album}</span>
        </div>
      </foreignObject>
    </svg>
  `;

  const vector = /** @type { SVGSVGElement } */ (template.content.querySelector("svg"));

  const labels = await fromSVG(vector);

  ctx.drawImage(labels,0,0,1920,1080);
}