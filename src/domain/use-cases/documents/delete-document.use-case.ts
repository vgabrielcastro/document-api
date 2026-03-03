import type { DocumentRepositoryPort } from "../../ports/document.repository.port.js";
import { NotFoundError } from "../../errors/app-error.js";

export class DeleteDocumentUseCase {
  constructor(private readonly repository: DocumentRepositoryPort) {}

  async execute(input: { id: string }) {
    const deleted = await this.repository.delete(input.id);

    if (!deleted) {
      throw new NotFoundError("Document not found");
    }
  }
}
