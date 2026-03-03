import type { FastifyInstance } from "fastify";
import {
  deleteDocument,
  listDocuments,
  createDocument,
  updateDocumentStatus,
} from "../store.js";
import {
  CreateDocumentBody,
  UpdateDocumentStatusParams,
  UpdateDocumentStatusBody,
} from "./types/index.js";

export async function documentosRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateDocumentBody }>(
    "/documents",
    async (request, reply) => {
      const { title, description } = request.body ?? {};
      if (!title || !description) {
        return reply.status(400).send({
          error: "Campos 'title' e 'description' são obrigatórios",
        });
      }
      const document = createDocument(title, description);
      return reply.status(201).send(document);
    },
  );

  fastify.get("/documents", async () => {
    return listDocuments();
  });

  fastify.patch<{
    Params: UpdateDocumentStatusParams;
    Body: UpdateDocumentStatusBody;
  }>("/documents/:id", async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body ?? {};
    if (!status || !["pending", "signed"].includes(status)) {
      return reply.status(400).send({
        error: "Campo 'status' é obrigatório e deve ser 'pending' ou 'signed'",
      });
    }
    const document = updateDocumentStatus(id, status);
    if (!document) {
      return reply.status(404).send({ error: "Document not found" });
    }
    return document;
  });

  fastify.delete<{ Params: UpdateDocumentStatusParams }>(
    "/documents/:id",
    async (request, reply) => {
      const { id } = request.params;
      const deleted = deleteDocument(id);
      if (!deleted) {
        return reply.status(404).send({
          error: "Document not found",
          statusCode: 404,
        });
      }
      return reply.status(200).send({ status: "ok" });
    },
  );
}
