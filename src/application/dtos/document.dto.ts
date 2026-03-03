export type DocumentStatusDto = "pending" | "signed";

export interface DocumentResponseDto {
  id: string;
  title: string;
  description: string;
  status: DocumentStatusDto;
  created_at: string;
}

export interface CreateDocumentRequestDto {
  title: string;
  description: string;
}

export interface UpdateDocumentStatusRequestDto {
  status: DocumentStatusDto;
}
