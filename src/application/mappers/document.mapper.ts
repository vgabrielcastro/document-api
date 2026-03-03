import type { DocumentEntity } from "../../domain/entities/document.entity.js";
import type { DocumentResponseDto } from "../dtos/document.dto.js";

export function toDocumentResponseDto(entity: DocumentEntity): DocumentResponseDto {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    status: entity.status,
    created_at: entity.created_at.toISOString(),
  };
}
