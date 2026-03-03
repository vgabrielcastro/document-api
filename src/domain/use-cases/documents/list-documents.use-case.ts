import type { DocumentRepositoryPort } from "../../ports/document.repository.port.js";

export class ListDocumentsUseCase {
  constructor(private readonly repository: DocumentRepositoryPort) {}

  async execute() {
    return this.repository.findMany();
  }
}
