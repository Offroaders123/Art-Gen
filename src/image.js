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

/**
 * Generates an image element from an inline SVG element.
 * 
 * @param { HTMLElement & SVGElement | SVGSVGElement } svg
*/
export async function fromSVG(svg){
  try {
    const media = new Blob([svg.outerHTML],{ type: "image/svg+xml" });
    const source = window.URL.createObjectURL(media);
    return await loadImage(source);
  } catch (error){
    throw error;
  }
}