import { describe, it, expect, beforeEach } from "vitest";
import Fastify from "fastify";
import { documentsRoutes } from "../../src/infrastructure/http/routes/documents.routes.js";
import { handleError } from "../../src/infrastructure/http/errors/http-error-handler.js";
import { InMemoryDocumentRepository } from "../../src/infrastructure/database/repositories/in-memory-document.repository.js";

describe("Documents API", () => {
  let app: Awaited<ReturnType<typeof Fastify>>;
  let repository: InMemoryDocumentRepository;

  beforeEach(async () => {
    repository = new InMemoryDocumentRepository();
    app = Fastify({ logger: false });
    app.setErrorHandler(handleError);
    await app.register(documentsRoutes, { repository });
  });

  describe("POST /documents", () => {
    it("deve criar documento e retornar 201", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/documents",
        payload: { title: "Contrato", description: "Descrição" },
      });

      expect(res.statusCode).toBe(201);
      const body = res.json();
      expect(body.id).toBeDefined();
      expect(body.title).toBe("Contrato");
      expect(body.description).toBe("Descrição");
      expect(body.status).toBe("pending");
      expect(body.created_at).toBeDefined();
    });

    it("deve retornar 400 quando title está vazio", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/documents",
        payload: { title: "", description: "Desc" },
      });

      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({ error: expect.any(String) });
    });
  });

  describe("GET /documents", () => {
    it("deve retornar lista vazia", async () => {
      const res = await app.inject({ method: "GET", url: "/documents" });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([]);
    });

    it("deve retornar documentos criados", async () => {
      await app.inject({
        method: "POST",
        url: "/documents",
        payload: { title: "A", description: "Desc A" },
      });
      const res = await app.inject({ method: "GET", url: "/documents" });
      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body).toHaveLength(1);
      expect(body[0].title).toBe("A");
    });
  });

  describe("PATCH /documents/:id", () => {
    it("deve atualizar status e retornar 200", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/documents",
        payload: { title: "Doc", description: "Desc" },
      });
      const { id } = createRes.json();

      const res = await app.inject({
        method: "PATCH",
        url: `/documents/${id}`,
        payload: { status: "signed" },
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().status).toBe("signed");
    });

    it("deve retornar 404 quando documento não existe", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/documents/id-inexistente",
        payload: { status: "signed" },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /documents/:id", () => {
    it("deve deletar e retornar 200 com status ok", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/documents",
        payload: { title: "Doc", description: "Desc" },
      });
      const { id } = createRes.json();

      const res = await app.inject({
        method: "DELETE",
        url: `/documents/${id}`,
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({ status: "ok" });
    });

    it("deve retornar 404 quando documento não existe", async () => {
      const res = await app.inject({
        method: "DELETE",
        url: "/documents/id-inexistente",
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
