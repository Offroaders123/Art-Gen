import FFmpeg from "./ffmpeg.js";
import { generateThumbnail } from "./thumbnail.js";

await navigator.serviceWorker.register(new URL("../service-worker.js",import.meta.url));

const audio = await fetch(new URL("../test/26.m4a",import.meta.url))
.then(response => response.blob());

const image = await generateThumbnail(audio);
console.log(image);

const ffmpeg = FFmpeg.createFFmpeg({ log: true, progress: console.log });
console.log(ffmpeg);

await ffmpeg.load();

ffmpeg.FS("writeFile","26.png",new Uint8Array(await image.arrayBuffer()));
ffmpeg.FS("writeFile","26.m4a",new Uint8Array(await audio.arrayBuffer()));

const command = "ffmpeg -loop 1 -framerate 1 -i 26.png -i 26.m4a -map 0 -map 1:a -c:v libx264 -preset ultrafast -tune stillimage -vf fps=10,format=yuv420p -c:a copy -shortest 26.mp4";
const args = command.slice(7).split(" ");
// console.log(args.join(" "));

await ffmpeg.run(...args);

const video = ffmpeg.FS("readFile","26.mp4");

ffmpeg.FS("unlink","26.png");
ffmpeg.FS("unlink","26.m4a");

const output = new File([video],"26.mp4",{ type: "audio/mp4" });
console.log(output);

saveFile(output);

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