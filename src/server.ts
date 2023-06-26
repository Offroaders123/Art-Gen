import * as fs from "node:fs/promises";
import express from "express";
import { createServer as createViteServer } from "vite";

createServer();

async function createServer(){
  const app = express();

  const vite = await createViteServer({
    server: {
      middlewareMode: true
    },
    appType: "custom"
  });

  app.use(vite.middlewares);

  app.use("*",async (request,response,next) => {
    const url = request.originalUrl

    try {
      let template = await fs.readFile(new URL("../index.html",import.meta.url),{ encoding: "utf-8" });
      template = await vite.transformIndexHtml(url,template);

      console.log(url);

      if (request.method === "GET" && url.endsWith(".tsx")){
        response.set({ "Content-Type": "application/javascript" });
      }

      const { render } = await vite.ssrLoadModule("./src/app.tsx");
      const appHtml = await render(url);
      const html = template.replace(`<!--ssr-outlet-->`,appHtml);

      response.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error: any) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  app.listen(5500);
}