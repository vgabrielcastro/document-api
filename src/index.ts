import { buildApp } from "./app.js";
import { prisma } from "./infrastructure/database/prisma/prisma.client.js";

let app: Awaited<ReturnType<typeof buildApp>>;

const start = async () => {
  app = await buildApp();

  try {
    await prisma.$connect();
    await app.listen({ port: 5050, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const shutdown = async () => {
  if (app) await app.close();
  await prisma.$disconnect();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
