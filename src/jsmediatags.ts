import { read } from "jsmediatags";

import type { Tags, PictureType } from "jsmediatags/types";

export interface MediaTags {
  title: string;
  artist: string;
  album: string;
  artwork: string;
}

type AllTags = Tags & { artwork?: string; };

export async function readTags(song: Uint8Array): Promise<MediaTags> {
  const allTags: AllTags = await new Promise<AllTags>((onSuccess,onError) => {
    read(song,{
      onSuccess({ tags }) {
        const artwork = (tags.picture !== undefined) ? fromPictureToDataURL(tags.picture) : undefined;
        const mediaTags: AllTags = Object.assign(tags,{ artwork });
        onSuccess(mediaTags)
      },
      onError
    });
  });
  return toMediaTags(allTags);
}

function fromPictureToDataURL(picture: PictureType): string {
  const { format: type, data } = picture;
  const base64 = Buffer.from(data).toString("base64");
  return `data:${type};base64,${base64}`;
}

function toMediaTags({ title, artist, album, artwork }: AllTags): MediaTags {
  if (title === undefined){
    throw new Error("Could not load title from song");
  }
  if (artist === undefined){
    throw new Error("Could not load artist from song");
  }
  if (album === undefined){
    throw new Error("Could not load album from song");
  }
  if (artwork === undefined){
    throw new Error("Could not load artwork from song");
  }
  return { title, artist, album, artwork };
}