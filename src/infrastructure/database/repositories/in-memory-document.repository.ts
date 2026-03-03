import type { DocumentRepositoryPort } from "../../../domain/ports/document.repository.port.js";
import type { DocumentEntity } from "../../../domain/entities/document.entity.js";

export class InMemoryDocumentRepository implements DocumentRepositoryPort {
  private documents: DocumentEntity[] = [];
  private idCounter = 1;

  async create(data: {
    title: string;
    description: string;
  }): Promise<DocumentEntity> {
    const document: DocumentEntity = {
      id: String(this.idCounter++),
      title: data.title,
      description: data.description,
      status: "pending",
      created_at: new Date(),
    };
    this.documents.push(document);
    return document;
  }

  async findMany(): Promise<DocumentEntity[]> {
    return [...this.documents].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    return this.documents.find((d) => d.id === id) ?? null;
  }

  async updateStatus(
    id: string,
    status: DocumentEntity["status"]
  ): Promise<DocumentEntity | null> {
    const index = this.documents.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.documents[index].status = status;
    return this.documents[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.documents.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.documents.splice(index, 1);
    return true;
  }

  clear() {
    this.documents = [];
    this.idCounter = 1;
  }
}
