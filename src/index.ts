import { extname } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { createRenderer } from "./thumbnail.js";

const execAsync = promisify(exec);

export interface ArtTrackOptions {
  artworkOnly?: boolean;
  overwrite?: boolean;
}

export async function generateArtTracks(inputs: string[], options?: ArtTrackOptions): Promise<void>;
export async function generateArtTracks(inputs: string[], { artworkOnly, overwrite }: ArtTrackOptions = { artworkOnly: false, overwrite: false }): Promise<void> {
  if (inputs.length === 0){
    throw new Error("Must provide song file path inputs");
  }

  const outputs: string[] = inputs.map(item => extRename(item,artworkOnly ? ".png" : ".mp4"));

  const renderer = await createRenderer();

  for (let i = 0; i < inputs.length; i++){
    const songPath = inputs[i]!;
    const thumbnailPath: string = artworkOnly ? outputs[i]! : extRename(outputs[i]!,".png");
    await renderer.generateThumbnail(songPath,thumbnailPath,overwrite);
  }

  await renderer.close();

  if (artworkOnly) return;

  for (let i = 0; i < inputs.length; i++){
    const songPath: string = inputs[i]!;
    const thumbnailPath = extRename(outputs[i]!,".png");
    const videoPath: string = outputs[i]!;
    console.log("Generating video...");
    // console.log(songPath);
    // console.log(thumbnailPath);
    // console.log(videoPath);
    await execAsync(`ffmpeg \
      -loop 1 \
      -framerate 1 \
      -i "${thumbnailPath}" \
      -i "${songPath}" \
      -map 0 \
      -map 1:a \
      -c:v libx264 \
      -preset veryslow \
      -tune stillimage \
      -vf "scale=out_color_matrix=bt709,fps=10,format=yuv420p" \
      -c:a copy \
      -shortest \
      "${videoPath}"\
      ${overwrite ? "-y" : "-n"}`);
  }
}

function extRename(path: string, ext: string): string {
  const extension = extname(path);
  return path.replace(extension,ext);
}