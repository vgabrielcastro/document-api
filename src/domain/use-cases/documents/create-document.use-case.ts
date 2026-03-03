import type { DocumentRepositoryPort } from "../../ports/document.repository.port.js";
import { ValidationError } from "../../errors/app-error.js";

export class CreateDocumentUseCase {
  constructor(private readonly repository: DocumentRepositoryPort) {}

  async execute(input: { title: string; description: string }) {
    const { title, description } = input;

    if (!title?.trim()) {
      throw new ValidationError("Field 'title' is required");
    }
    if (!description?.trim()) {
      throw new ValidationError("Field 'description' is required");
    }

    return this.repository.create({ title: title.trim(), description: description.trim() });
  }
}
