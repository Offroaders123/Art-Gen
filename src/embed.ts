/**
 * Generates a Data URL from a given text string. Accepts a text MIME type.
*/
export function toDataURLComponent(media: string, type: `${string}/${string}`): string {
  const prefix = `data:${type};charset=utf8,`;
  const data = encodeURIComponent(media);
  return `${prefix}${data}`;
}

/**
 * Generates a Base64 Data URL from a given Blob.
*/
export async function toDataURLBase64(media: Blob): Promise<string> {
  const reader = new FileReader();

  await new Promise((resolve,reject) => {
    reader.addEventListener("load",resolve,{ once: true });
    reader.addEventListener("error",reject,{ once: true });
    reader.readAsDataURL(media);
  });

  return reader.result! as string;
}

/**
 * Embeds URL declarations into a CSS string.
*/
export async function embedCSSURLs(media: string): Promise<string> {
  const matches = [...media.matchAll(/url\((.*?)\)/g)];

  let offset = 0;

  const resources = await Promise.all(
    matches.map(
      async ({ 0: match, 1: src, index = 0 }) => {
        const resource = `url(${
          await fetch(src)
            .then(response => response.blob())
            .then(toDataURLBase64)
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