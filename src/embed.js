/**
 * Generates a Data URL from a given Blob or text string.
 * 
 * @param { Blob | string } source
*/
export async function toDataURL(source,type = "data:text/plain;"){
  try {
    switch (true){
      case typeof source === "string": {
        return `${type}${encodeURIComponent(/** @type { string } */ (source))}`;
      }
      case source instanceof Blob: {
        const reader = new FileReader();
        await new Promise((resolve,reject) => {
          reader.addEventListener("load",resolve,{ once: true });
          reader.addEventListener("error",reject,{ once: true });
          reader.readAsDataURL(/** @type { Blob } */ (source));
        });
        return /** @type { string } */ (reader.result);
      }
      default: throw new TypeError("Passed in incorrect data");
    }
  } catch (error){
    throw error;
  }
}

/**
 * Embeds URL declarations into a CSS string.
 * 
 * @param { string } media
*/
export async function embedCSSURLs(media){
  const matches = [...media.matchAll(/url\((.*?)\)/g)];

  let offset = 0;

  const resources = await Promise.all(
    matches.map(
      async ({ 0: match, 1: src, index = 0 }) => {
        const resource = `url(${
          await fetch(src)
          .then(response => response.blob())
          .then(toDataURL)
        })`;
        const diff = resource.length - match.length;
        return { match, resource, index, diff };
      }
    )
  );

  let result = media;

  for (const { match, resource, index, diff } of resources){
    result = result.slice(0,index + offset) + resource + result.slice(index + offset + match.length);
    offset += diff;
  }

  return result;
}