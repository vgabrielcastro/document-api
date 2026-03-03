import Fastify from "fastify";
import { documentosRoutes } from "./routes/documentos.js";

const app = Fastify({ logger: true });

app.get("/", async () => {
  return { message: "Hello World" };
});

app.get("/health", async () => {
  return { status: "ok", ping: "pong" };
});

app.register(documentosRoutes);

const start = async () => {
  try {
    await app.listen({ port: 5050, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
