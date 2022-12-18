import type { Tags, PictureType } from "jsmediatags/types";

const { jsmediatags } = window;

/**
 * Reads the media tags for a given song file.
 * 
 * @param data Accepts either a URL string or a Blob object.
 * @returns Resolves to a Tags object.
*/
export async function readTags(data: string | Blob) {
  return new Promise<Tags>((resolve,reject) => {
    jsmediatags.read(data,{
      onSuccess: ({ tags }) => resolve(tags),
      onError: reject
    });
  });
}

/**
 * Reads a Picture tag, and returns an equivalent Blob for that data.
*/
export function fromPicture(picture: PictureType){
  const { format: type, data } = picture;
  return new Blob([new Uint8Array(data)],{ type });
}