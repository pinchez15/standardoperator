import { getServiceSupabaseClient } from "@/lib/supabase/service";
export async function getSopSummariesForUser(userId: string) {
  const client = getServiceSupabaseClient();
  const { data, error } = await client
    .from("sops")
    .select("id, title, folder_id, status, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getFoldersForUser(userId: string) {
  const client = getServiceSupabaseClient();
  const { data, error } = await client
    .from("sop_folders")
    .select("id, name")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}
