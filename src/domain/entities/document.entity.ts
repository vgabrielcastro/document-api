export type DocumentStatus = "pending" | "signed";

export interface DocumentEntity {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  created_at: Date;
}
