const { read } = jsmediatags;

import type { Tags, PictureType } from "jsmediatags/types";

/**
 * Reads the media tags for a given song file.
*/
export async function readTags(data: Blob): Promise<Tags> {
  return new Promise<Tags>((resolve,reject) => {
    read(data,{
      onSuccess: ({ tags }) => resolve(tags),
      onError: reject
    });
  });
}

/**
 * Reads a Picture tag, and returns an equivalent Blob for that data.
*/
export function fromPicture(picture: PictureType): Blob {
  const { format: type, data } = picture;
  return new Blob([new Uint8Array(data)],{ type });
}

export type { Tags, PictureType };