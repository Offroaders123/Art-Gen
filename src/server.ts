import { createServer } from "node:http";
import { generateSource } from "./client.js";

import type { Server } from "node:http";

export async function startServer(): Promise<Server> {
  const server = createServer(async (_request,response) => {
    response.writeHead(200,{ "Content-Type": "text/html" });
    response.write(await generateSource());
    response.end();
  });

  await new Promise<void>(resolve => server.listen(3000,resolve));

  return server;
}