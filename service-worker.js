/// <reference lib="webworker"/>
(async () => {

// @ts-ignore
const self = /** @type { ServiceWorkerGlobalScope } */ (globalThis);

self.addEventListener("fetch",event => {
  if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") return;

  event.respondWith(fetch(event.request).then(response => {
    if (response.status === 0) return response;

    const headers = new Headers(response.headers);
    headers.set("Cross-Origin-Embedder-Policy","require-corp");
    headers.set("Cross-Origin-Opener-Policy","same-origin");

    const { status, statusText } = response;

    const result = new Response(response.body,{ status, statusText, headers });
    return result;
  }));
});

})();