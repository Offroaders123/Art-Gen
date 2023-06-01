import { read } from "jsmediatags";
import type { Tags, PictureType } from "jsmediatags/types";

type AllTags = Tags & { artwork?: Blob; };

export interface MediaTags {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: Blob;
}

export async function readSong(location: string | Uint8Array): Promise<MediaTags> {
  const allTags = await new Promise<AllTags>((onSuccess,onError) => {
    read(location,{
      onSuccess: ({ tags }) => {
        const artwork = (tags.picture !== undefined) ? fromPicture(tags.picture) : undefined;
        const mediaTags: AllTags = Object.assign(tags,{ artwork });
        onSuccess(mediaTags)
      },
      onError
    });
  });

  return toMediaTags(allTags);
}

function fromPicture(picture: PictureType): Blob {
  const { format: type, data } = picture;
  return new Blob([new Uint8Array(data)],{ type });
}

function toMediaTags({ title, artist, album, artwork }: AllTags): MediaTags {
  return { title, artist, album, artwork };
}