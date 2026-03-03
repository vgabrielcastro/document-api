import type { FastifyInstance } from "fastify";
import { CreateDocumentUseCase } from "../../../domain/use-cases/documents/create-document.use-case.js";
import { ListDocumentsUseCase } from "../../../domain/use-cases/documents/list-documents.use-case.js";
import { UpdateDocumentStatusUseCase } from "../../../domain/use-cases/documents/update-document-status.use-case.js";
import { DeleteDocumentUseCase } from "../../../domain/use-cases/documents/delete-document.use-case.js";
import { PrismaDocumentRepository } from "../../../infrastructure/database/repositories/prisma-document.repository.js";
import { toDocumentResponseDto } from "../../../application/mappers/document.mapper.js";
import type { DocumentRepositoryPort } from "../../../domain/ports/document.repository.port.js";
import type {
  CreateDocumentRequestDto,
  UpdateDocumentStatusRequestDto,
} from "../../../application/dtos/document.dto.js";

interface DocumentsRoutesOptions {
  repository?: DocumentRepositoryPort;
}

export async function documentsRoutes(
  fastify: FastifyInstance,
  opts?: DocumentsRoutesOptions
) {
  const repo = opts?.repository ?? new PrismaDocumentRepository();
  const createDocument = new CreateDocumentUseCase(repo);
  const listDocuments = new ListDocumentsUseCase(repo);
  const updateDocumentStatus = new UpdateDocumentStatusUseCase(repo);
  const deleteDocument = new DeleteDocumentUseCase(repo);

  fastify.post<{ Body: CreateDocumentRequestDto }>(
    "/documents",
    {
      schema: {
        body: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              status: { type: "string", enum: ["pending", "signed"] },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const body = request.body ?? {};
      const document = await createDocument.execute({
        title: body.title,
        description: body.description,
      });
      return reply.status(201).send(toDocumentResponseDto(document));
    }
  );

  fastify.get("/documents", {
    schema: {
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              status: { type: "string", enum: ["pending", "signed"] },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
  }, async () => {
    const documents = await listDocuments.execute();
    return documents.map(toDocumentResponseDto);
  });

  fastify.patch<{
    Params: { id: string };
    Body: UpdateDocumentStatusRequestDto;
  }>(
    "/documents/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        body: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", enum: ["pending", "signed"] },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              status: { type: "string", enum: ["pending", "signed"] },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body ?? {};
      const document = await updateDocumentStatus.execute({ id, status: status ?? "" });
      return reply.status(200).send(toDocumentResponseDto(document));
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/documents/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        response: {
          200: {
            type: "object",
            properties: { status: { type: "string", enum: ["ok"] } },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      await deleteDocument.execute({ id });
      return reply.status(200).send({ status: "ok" });
    }
  );
}
