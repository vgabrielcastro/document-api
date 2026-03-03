import type { DocumentRepositoryPort } from "../../../domain/ports/document.repository.port.js";
import type { DocumentEntity } from "../../../domain/entities/document.entity.js";
import { prisma } from "../prisma/prisma.client.js";

export class PrismaDocumentRepository implements DocumentRepositoryPort {
  async create(data: {
    title: string;
    description: string;
  }): Promise<DocumentEntity> {
    const doc = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        status: "pending",
      },
    });
    return this.toEntity(doc);
  }

  async findMany(): Promise<DocumentEntity[]> {
    const docs = await prisma.document.findMany({
      orderBy: { created_at: "desc" },
    });
    return docs.map(this.toEntity);
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    const doc = await prisma.document.findUnique({
      where: { id },
    });
    return doc ? this.toEntity(doc) : null;
  }

  async updateStatus(
    id: string,
    status: DocumentEntity["status"]
  ): Promise<DocumentEntity | null> {
    try {
      const doc = await prisma.document.update({
        where: { id },
        data: { status },
      });
      return this.toEntity(doc);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.document.deleteMany({
      where: { id },
    });
    return result.count > 0;
  }

  private toEntity(doc: {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: Date;
  }): DocumentEntity {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      status: doc.status as DocumentEntity["status"],
      created_at: doc.created_at,
    };
  }
}
