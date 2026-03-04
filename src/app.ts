import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import { documentsRoutes } from "./infrastructure/http/routes/documents.routes.js";
import { handleError } from "./infrastructure/http/errors/http-error-handler.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  });

  await app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Document API",
        description: "API para gerenciamento de documentos (CRUD e atualização de status)",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:5050",
          description: "Servidor local",
        },
      ],
    },
  });

  app.setErrorHandler(handleError);

  app.get("/", async () => ({ message: "Hello World" }));
  app.get("/health", async () => ({ status: "ok", ping: "pong" }));

  await app.register(documentsRoutes);

  await app.register(scalar, {
    routePrefix: "/docs",
  });

  return app;
}
