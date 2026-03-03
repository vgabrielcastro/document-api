export interface CreateDocumentBody {
  title: string;
  description: string;
}

export interface UpdateDocumentStatusParams {
  id: string;
}

export interface UpdateDocumentStatusBody {
  status: "pending" | "signed";
}
