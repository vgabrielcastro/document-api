import Fastify from "fastify";
import cors from "@fastify/cors";
import { documentsRoutes } from "./infrastructure/http/routes/documents.routes.js";
import { handleError } from "./infrastructure/http/errors/http-error-handler.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  });

  app.setErrorHandler(handleError);

  app.get("/", async () => ({ message: "Hello World" }));
  app.get("/health", async () => ({ status: "ok", ping: "pong" }));

  await app.register(documentsRoutes);

  return app;
}
