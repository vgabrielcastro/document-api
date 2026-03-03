import type { Document } from "./types.js";

const documents: Document[] = [];
let idCounter = 1;

export function createDocument(title: string, description: string): Document {
  const document: Document = {
    id: String(idCounter++),
    title,
    description,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  documents.push(document);
  return document;
}

export function listDocuments(): Document[] {
  return [...documents];
}

export function findDocumentById(id: string): Document | undefined {
  return documents.find((d) => d.id === id);
}

export function updateDocumentStatus(
  id: string,
  status: Document["status"],
): Document | null {
  const index = documents.findIndex((d) => d.id === id);
  if (index === -1) return null;
  documents[index].status = status;
  return documents[index];
}

export function deleteDocument(id: string): boolean {
  const index = documents.findIndex((d) => d.id === id);
  if (index === -1) return false;
  documents.splice(index, 1);
  return true;
}
