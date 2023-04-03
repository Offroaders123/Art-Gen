import { canvas, ctx } from "./dom.js";
import { toDataURLBase64, embedCSSURLs } from "./embed.js";
import { fromSVG } from "./image.js";
import { Tags, readTags, fromPicture } from "./jsmediatags.js";

export const NotoSans = fetch("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap")
.then(response => response.text())
.then(embedCSSURLs)
.then(media => new Blob([media],{ type: "text/css" }))
.then(toDataURLBase64);

/**
 * Generates a video thumbnail for a given song file, or song artwork and metadata.
*/
export async function generateThumbnail(song: Blob | Tags){
  const tags = (song instanceof Blob) ? await readTags(song) : song;
  console.log(tags);

  if (typeof tags.picture === "undefined"){
    throw new TypeError("Cannot load artwork from song");
  }

  const artwork = fromPicture(tags.picture);
  console.log(artwork);

  const { title, artist, album } = tags;
  console.log(title,artist,album);

  const vector = await generateVector({ artwork: await toDataURLBase64(artwork), title, artist, album });

  const labels = await fromSVG(vector);

  ctx.drawImage(labels,0,0,1920,1080);

  const blob = await new Promise<Blob>((resolve,reject) => canvas.toBlob(blob => {
    (blob !== null) ? resolve(blob) : reject("Canvas data was null!");
  }));

  return blob;
}

export interface GenerateVectorOptions {
  artwork?: string;
  title?: string;
  artist?: string;
  album?: string;
}

export async function generateVector({ artwork, title, artist, album }: GenerateVectorOptions = { artwork: "", title: "", artist: "", album: "" }){
  const template = document.createElement("template");

  template.innerHTML = `
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url(${await NotoSans});
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
        <filter id="blur">
          <feGaussianBlur stdDeviation="30" color-interpolation-filters="sRGB"/>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="1"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <image x="0" y="0" width="1920" height="1080" filter="url(#blur)" href="${artwork}" preserveAspectRatio="xMidYMid slice"/>
      <rect x="0" y="0" width="1920" height="1080" fill="rgb(0 0 0 / 0.7)"/>
      <image x="135" y="135" width="810" height="810" href="${artwork}"/>
      <foreignObject x="1058" y="135" width="789" height="810">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <span class="title">${title}</span>
          <span class="artist">${artist}</span>
          <span class="album">${album}</span>
        </div>
      </foreignObject>
    </svg>
  `;

  const vector = template.content.querySelector("svg")!;

  return vector;
}