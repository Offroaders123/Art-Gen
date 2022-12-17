import { generateThumbnail } from "./thumbnail.js";

const audio = await fetch(new URL("../test/26.m4a",import.meta.url))
.then(response => response.blob());

const image = await generateThumbnail(audio);
console.log(image);

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