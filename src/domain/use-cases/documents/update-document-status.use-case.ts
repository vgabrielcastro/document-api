import type { DocumentRepositoryPort } from "../../ports/document.repository.port.js";
import type { DocumentEntity } from "../../entities/document.entity.js";
import { ValidationError, NotFoundError } from "../../errors/app-error.js";

const VALID_STATUSES: DocumentEntity["status"][] = ["pending", "signed"];

export class UpdateDocumentStatusUseCase {
  constructor(private readonly repository: DocumentRepositoryPort) {}

  async execute(input: { id: string; status: string }) {
    const { id, status } = input;

    if (!status || !VALID_STATUSES.includes(status as DocumentEntity["status"])) {
      throw new ValidationError(
        "Field 'status' is required and must be 'pending' or 'signed'"
      );
    }

    const document = await this.repository.updateStatus(
      id,
      status as DocumentEntity["status"]
    );

    if (!document) {
      throw new NotFoundError("Document not found");
    }

    return document;
  }
}
