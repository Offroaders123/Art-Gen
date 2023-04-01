const { jsmediatags } = window;

/**
 * @typedef { import("jsmediatags/types").Tags } Tags
 * @typedef { import("jsmediatags/types").PictureType } PictureType
*/

/**
 * Reads the media tags for a given song file.
 * 
 * @param { string | Blob } data Accepts either a URL string or a Blob object.
 * @returns { Promise<Tags> } Resolves to a Tags object.
*/
export async function readTags(data){
  return new Promise((resolve,reject) => {
    jsmediatags.read(data,{
      onSuccess: ({ tags }) => resolve(tags),
      onError: reject
    });
  });
}

/**
 * Reads a Picture tag, and returns an equivalent Blob for that data.
 * 
 * @param { PictureType } picture
*/
export function fromPicture(picture){
  const { format: type, data } = picture;
  return new Blob([new Uint8Array(data)],{ type });
}