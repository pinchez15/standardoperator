export type SopStatus = "draft" | "published" | "archived";

export interface SopSummary {
  id: string;
  title: string;
  folderId: string | null;
  updatedAt: string;
  status: SopStatus;
}

export interface FolderSummary {
  id: string;
  name: string;
}
