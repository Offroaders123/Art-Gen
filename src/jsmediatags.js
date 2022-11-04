import { loadImage } from "./image.js";
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
 * Reads a Picture tag, and returns an equivalent Image object for that data.
 * 
 * @param { PictureType } picture
*/
export async function fromPicture(picture){
  try {
    const { format: type = "", data = [] } = picture;
    const media = new Blob([new Uint8Array(data)],{ type });
    const source = window.URL.createObjectURL(media);
    return await loadImage(source);
  } catch {
    throw new TypeError("Could not construct an image from the picture data");
  }
}