import { readFile } from "node:fs/promises";
import { tags } from "./index.js";

const index = new URL("../index.html",import.meta.url);
const source = await readFile(index,{ encoding: "utf-8" });

export async function generateSource(): Promise<string> {
  if (tags === null){
    throw new Error("No media tags have been loaded yet, couldn't generate the source for the thumbnail");
  }
  const { title, artist, album, artwork } = tags;
  return source
    .replaceAll("%TITLE%",title)
    .replaceAll("%ARTIST%",artist)
    .replaceAll("%ALBUM%",album)
    .replaceAll("%ARTWORK%",artwork);
}