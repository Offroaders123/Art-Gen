import { readFile } from "node:fs/promises";
import { tags } from "./index.js";

const index = new URL("../index.html",import.meta.url);
const source = await readFile(index,{ encoding: "utf-8" });

export async function generateSource(): Promise<string> {
  const { title, artist, album, artwork } = tags;
  return source
    .replaceAll("%TITLE%",title)
    .replaceAll("%ARTIST%",artist)
    .replaceAll("%ALBUM%",album)
    .replaceAll("%ARTWORK%",artwork);
}