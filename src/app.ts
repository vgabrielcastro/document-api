import Fastify from "fastify";
import { documentsRoutes } from "./infrastructure/http/routes/documents.routes.js";
import { handleError } from "./infrastructure/http/errors/http-error-handler.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  app.setErrorHandler(handleError);

  app.get("/", async () => ({ message: "Hello World" }));
  app.get("/health", async () => ({ status: "ok", ping: "pong" }));

  await app.register(documentsRoutes);

  return app;
}
