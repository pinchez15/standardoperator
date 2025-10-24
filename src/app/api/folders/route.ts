import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getServiceSupabaseClient } from "@/lib/supabase/service";
import { ensureSupabaseUser } from "@/lib/supabase/users";
import type { Database } from "@/lib/database.types";

type FolderRow = Database["public"]["Tables"]["sop_folders"]["Row"];
type FolderSummaryRow = Pick<FolderRow, "id" | "name">;
type FolderInsert = Database["public"]["Tables"]["sop_folders"]["Insert"];

export async function GET() {
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
      .from("sop_folders")
      .select("id, name")
      .eq("user_id", profile.id)
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      folders: (data ?? []) as FolderSummaryRow[],
    });
  } catch (error) {
    console.error("[FOLDERS_GET]", error);
    return NextResponse.json(
      { error: "Failed to load folders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      name: string;
    };

    if (!payload.name?.trim()) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const profile = await ensureSupabaseUser(clerkUser);
    const supabase = getServiceSupabaseClient();

    const newFolder: FolderInsert = {
      name: payload.name.trim(),
      user_id: profile.id,
    };

    const { data, error: insertError } = await supabase
      .from("sop_folders")
      .insert<FolderInsert>(newFolder)
      .select("id, name")
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ folder: data as FolderSummaryRow }, { status: 201 });
  } catch (error) {
    console.error("[FOLDERS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
