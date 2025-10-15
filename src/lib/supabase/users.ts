import type { User } from "@clerk/nextjs/server";
import { getServiceSupabaseClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export async function ensureSupabaseUser(
  clerkUser: Pick<User, "id" | "emailAddresses" | "firstName" | "lastName"> & {
    primaryEmailAddressId: string | null;
  }
): Promise<UserRow> {
  const client = getServiceSupabaseClient();
  const email =
    clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Unable to resolve primary email for Clerk user.");
  }

  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const { data: existing, error: selectError } = await client
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUser.id)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    throw selectError;
  }

  const existingUser = existing as UserRow | null;

  if (existingUser) {
    if (existingUser.email !== email || existingUser.full_name !== fullName) {
      const updatePayload: UserUpdate = {
        email,
        full_name: fullName || null,
      };

      const { data: updated, error: updateError } = await client
        .from("users")
        .update<UserUpdate>(updatePayload)
        .eq("id", existingUser.id)
        .select("*")
        .single();

      if (updateError) {
        throw updateError;
      }

      return updated as UserRow;
    }

    return existingUser;
  }

  const insertPayload: UserInsert = {
    clerk_user_id: clerkUser.id,
    email,
    full_name: fullName || null,
  };

  const { data: inserted, error: insertError } = await client
    .from("users")
    .insert<UserInsert>(insertPayload)
    .select("*")
    .single();

  if (insertError) {
    throw insertError;
  }

  return inserted as UserRow;
}
