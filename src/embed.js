/**
 * Generates a Data URL from a given Blob or URL.
 * 
 * @param { Blob | string } source
*/
export async function toDataURL(source){
  try {
    /** @type { Blob } */
    const media = await new Promise(async (resolve,reject) => {
      switch (true){
        case typeof source === "string": {
          try {
            resolve(await fetch(/** @type { string } */ (source))
            .then(response => response.blob()));
          } catch (error){
            reject(error);
          }
          break;
        }
        case source instanceof Blob: {
          resolve(/** @type { Blob } */ (source));
          break;
        }
      }
    });

    const reader = new FileReader();
    await new Promise((resolve,reject) => {
      reader.addEventListener("load",resolve,{ once: true });
      reader.addEventListener("error",reject,{ once: true });
      reader.readAsDataURL(media);
    });

    return /** @type { string } */ (reader.result);
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
        const resource = `url(${await toDataURL(src)})`;
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