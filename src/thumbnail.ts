import type { MediaTags } from "./jsmediatags.js";

export function makeThumbSrc({ title, artist, album, artwork }: MediaTags): string {
  const plainSrc = `
<!DOCTYPE html>
<html>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap">
  </head>
  <body>
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
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
  </body>
</html>
  `;
  const blob = new Blob([plainSrc],{ type: "text/html" });
  return URL.createObjectURL(blob);
}