import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getServiceSupabaseClient } from "@/lib/supabase/service";
import { ensureSupabaseUser } from "@/lib/supabase/users";
import type { Database } from "@/lib/database.types";

type SopRow = Database["public"]["Tables"]["sops"]["Row"];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await ensureSupabaseUser(clerkUser);
    const supabase = getServiceSupabaseClient();

    const { data, error } = await supabase
      .from("sops")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", profile.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "SOP not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ sop: data as SopRow });
  } catch (error) {
    console.error("[SOP_GET]", error);
    return NextResponse.json(
      { error: "Failed to load SOP" },
      { status: 500 }
    );
  }
}
