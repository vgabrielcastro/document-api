import { describe, it, expect, beforeEach } from "vitest";
import { CreateDocumentUseCase } from "../../../src/domain/use-cases/documents/create-document.use-case.js";
import { InMemoryDocumentRepository } from "../../../src/infrastructure/database/repositories/in-memory-document.repository.js";

describe("CreateDocumentUseCase", () => {
  let useCase: CreateDocumentUseCase;
  let repository: InMemoryDocumentRepository;

  beforeEach(() => {
    repository = new InMemoryDocumentRepository();
    useCase = new CreateDocumentUseCase(repository);
  });

  it("deve criar um documento com sucesso", async () => {
    const result = await useCase.execute({
      title: "Contrato",
      description: "Contrato de prestação de serviços",
    });

    expect(result.id).toBeDefined();
    expect(result.title).toBe("Contrato");
    expect(result.description).toBe("Contrato de prestação de serviços");
    expect(result.status).toBe("pending");
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it("deve lançar ValidationError quando title está vazio", async () => {
    await expect(
      useCase.execute({ title: "", description: "Desc" })
    ).rejects.toThrow("Field 'title' is required");

    await expect(
      useCase.execute({ title: "   ", description: "Desc" })
    ).rejects.toThrow("Field 'title' is required");
  });

  it("deve lançar ValidationError quando description está vazia", async () => {
    await expect(
      useCase.execute({ title: "Title", description: "" })
    ).rejects.toThrow("Field 'description' is required");
  });
});
