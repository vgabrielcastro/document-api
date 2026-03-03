import { describe, it, expect, beforeEach } from "vitest";
import { CreateDocumentUseCase } from "../../../src/domain/use-cases/documents/create-document.use-case.js";
import { DeleteDocumentUseCase } from "../../../src/domain/use-cases/documents/delete-document.use-case.js";
import { InMemoryDocumentRepository } from "../../../src/infrastructure/database/repositories/in-memory-document.repository.js";

describe("DeleteDocumentUseCase", () => {
  let deleteUseCase: DeleteDocumentUseCase;
  let createUseCase: CreateDocumentUseCase;
  let repository: InMemoryDocumentRepository;

  beforeEach(() => {
    repository = new InMemoryDocumentRepository();
    deleteUseCase = new DeleteDocumentUseCase(repository);
    createUseCase = new CreateDocumentUseCase(repository);
  });

  it("deve deletar um documento existente", async () => {
    const created = await createUseCase.execute({
      title: "Doc",
      description: "Desc",
    });

    await expect(deleteUseCase.execute({ id: created.id })).resolves.not.toThrow();

    const list = await repository.findMany();
    expect(list).toHaveLength(0);
  });

  it("deve lançar NotFoundError quando documento não existe", async () => {
    await expect(
      deleteUseCase.execute({ id: "id-inexistente" })
    ).rejects.toThrow("Document not found");
  });
});
