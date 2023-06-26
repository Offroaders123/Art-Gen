import { generateThumbnail } from "./thumbnail.js";

const { debug } = Object.fromEntries(new URL(document.location.href).searchParams);

if (debug !== undefined){
  const audio = await fetch(new URL("../test/26.m4a",import.meta.url))
    .then(response => response.blob())
    .then(blob => new File([blob],"26.m4a",{ type: blob.type }));

  const thumbnail = await generateThumbnail(audio);
  console.log(thumbnail);
}