import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getServiceSupabaseClient } from "@/lib/supabase/service";
import { ensureSupabaseUser } from "@/lib/supabase/users";
import type { Database, Json } from "@/lib/database.types";

type SopRow = Database["public"]["Tables"]["sops"]["Row"];
type SopSummaryRow = Pick<
  SopRow,
  "id" | "title" | "folder_id" | "status" | "updated_at"
>;
type FolderSummaryRow = Pick<
  Database["public"]["Tables"]["sop_folders"]["Row"],
  "id" | "name"
>;
type SopInsert = Database["public"]["Tables"]["sops"]["Insert"];

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

    const [sopsResult, foldersResult] = await Promise.all([
      supabase
        .from("sops")
        .select("id, title, folder_id, status, updated_at")
        .eq("user_id", profile.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("sop_folders")
        .select("id, name")
        .eq("user_id", profile.id)
        .order("name", { ascending: true }),
    ]);

    if (sopsResult.error) throw sopsResult.error;
    if (foldersResult.error) throw foldersResult.error;

    return NextResponse.json({
      sops: (sopsResult.data ?? []) as SopSummaryRow[],
      folders: (foldersResult.data ?? []) as FolderSummaryRow[],
    });
  } catch (error) {
    console.error("[SOPS_GET]", error);
    return NextResponse.json(
      { error: "Failed to load SOPs" },
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
      title?: string;
      folderId?: string | null;
    };

    const profile = await ensureSupabaseUser(clerkUser);
    const supabase = getServiceSupabaseClient();

    const { count: sopCount, error: countError } = await supabase
      .from("sops")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id);

    if (countError) {
      throw countError;
    }

    const quota = profile.plan === "pro" ? Number.POSITIVE_INFINITY : profile.sop_quota;
    if (typeof sopCount === "number" && sopCount >= quota) {
      return NextResponse.json(
        {
          error:
            "Free plan limit reached. Upgrade to Pro for unlimited SOPs.",
        },
        { status: 403 }
      );
    }

    const defaultDocument: Json = {
      type: "doc",
      content: [] as Json[],
    };

    const newSop: SopInsert = {
      title: payload.title?.trim() || "Untitled SOP",
      folder_id: payload.folderId ?? null,
      user_id: profile.id,
      content: defaultDocument,
    };

    const { data, error: insertError } = await supabase
      .from("sops")
      .insert<SopInsert>(newSop)
      .select("id, title, folder_id, status, updated_at")
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ sop: data as SopSummaryRow }, { status: 201 });
  } catch (error) {
    console.error("[SOPS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create SOP" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
      id: string;
      title?: string;
      content?: string;
    };

    if (!payload.id) {
      return NextResponse.json(
        { error: "SOP ID is required" },
        { status: 400 }
      );
    }

    const profile = await ensureSupabaseUser(clerkUser);
    const supabase = getServiceSupabaseClient();

    // Verify the SOP belongs to the user
    const { data: existingSop, error: fetchError } = await supabase
      .from("sops")
      .select("id, user_id")
      .eq("id", payload.id)
      .eq("user_id", profile.id)
      .single();

    if (fetchError || !existingSop) {
      return NextResponse.json(
        { error: "SOP not found" },
        { status: 404 }
      );
    }

    const updateData: Partial<Database["public"]["Tables"]["sops"]["Update"]> = {};
    if (payload.title !== undefined) {
      updateData.title = payload.title.trim();
    }
    if (payload.content !== undefined) {
      updateData.content = { html: payload.content };
    }

    const { data, error: updateError } = await supabase
      .from("sops")
      .update(updateData)
      .eq("id", payload.id)
      .eq("user_id", profile.id)
      .select("id, title, folder_id, status, updated_at")
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ sop: data as SopSummaryRow });
  } catch (error) {
    console.error("[SOPS_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update SOP" },
      { status: 500 }
    );
  }
}
