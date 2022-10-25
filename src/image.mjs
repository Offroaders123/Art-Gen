/**
 * Loads an image from a specified URL.
 * 
 * @param { string } src
 * @param { HTMLImageElement } image
*/
export async function loadImage(src,image = new Image()){
  await new Promise((resolve,reject) => {
    image.addEventListener("load",resolve,{ once: true });
    image.addEventListener("error",reject,{ once: true });
    image.src = src;
  });
  return image;
}