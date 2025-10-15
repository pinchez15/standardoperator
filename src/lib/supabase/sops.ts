import { getServiceSupabaseClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/database.types";

type SopRow = Database["public"]["Tables"]["sops"]["Row"];
type SopSummaryRow = Pick<
  SopRow,
  "id" | "title" | "folder_id" | "status" | "updated_at"
>;
type FolderRow = Database["public"]["Tables"]["sop_folders"]["Row"];
type FolderSummaryRow = Pick<FolderRow, "id" | "name">;

export async function getSopSummariesForUser(
  userId: string
): Promise<SopSummaryRow[]> {
  const client = getServiceSupabaseClient();
  const { data, error } = await client
    .from("sops")
    .select("id, title, folder_id, status, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as SopSummaryRow[];
}

export async function getFoldersForUser(
  userId: string
): Promise<FolderSummaryRow[]> {
  const client = getServiceSupabaseClient();
  const { data, error } = await client
    .from("sop_folders")
    .select("id, name")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as FolderSummaryRow[];
}
