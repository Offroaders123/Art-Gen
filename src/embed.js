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