import { toDataURLComponent } from "./embed.js";

/**
 * Loads an image from a specified URL.
*/
export async function loadImage(src: string, image: HTMLImageElement = new Image()): Promise<HTMLImageElement> {
  await new Promise((resolve,reject) => {
    image.addEventListener("load",resolve,{ once: true });
    image.addEventListener("error",reject,{ once: true });
    image.src = src;
  });
  return image;
}

/**
 * Generates an image element from an inline SVG element.
*/
export async function fromSVG(svg: (HTMLElement & SVGElement) | SVGSVGElement): Promise<HTMLImageElement> {
  const source = toDataURLComponent(svg.outerHTML,"image/svg+xml");
  return loadImage(source);
}