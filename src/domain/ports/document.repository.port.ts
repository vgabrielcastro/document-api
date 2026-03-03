import type { DocumentEntity } from "../entities/document.entity.js";

export interface DocumentRepositoryPort {
  create(data: { title: string; description: string }): Promise<DocumentEntity>;
  findMany(): Promise<DocumentEntity[]>;
  findById(id: string): Promise<DocumentEntity | null>;
  updateStatus(id: string, status: DocumentEntity["status"]): Promise<DocumentEntity | null>;
  delete(id: string): Promise<boolean>;
}
