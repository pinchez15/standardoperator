import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ensureSupabaseUser } from "@/lib/supabase/users";
import {
  getFoldersForUser,
  getSopSummariesForUser,
} from "@/lib/supabase/sops";

const SUPABASE_READY =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  if (!SUPABASE_READY) {
    console.warn("Supabase environment variables missing. Rendering demo data.");
    const fallbackFolders = [
      { id: "folder-onboarding", name: "Onboarding" },
      { id: "folder-ops", name: "Operations" },
    ];

    const fallbackSops = [
      {
        id: "sop-1",
        title: "Customer Onboarding Checklist",
        folder_id: "folder-onboarding",
        updated_at: new Date().toISOString(),
        status: "draft" as const,
      },
      {
        id: "sop-2",
        title: "Weekly QA Review",
        folder_id: "folder-ops",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        status: "published" as const,
      },
      {
        id: "sop-3",
        title: "Incident Response Playbook",
        folder_id: null,
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: "draft" as const,
      },
    ];

    return (
      <AppShell
        folders={fallbackFolders}
        sops={fallbackSops.map((sop) => ({
          id: sop.id,
          title: sop.title,
          folderId: sop.folder_id,
          updatedAt: sop.updated_at,
          status: sop.status,
        }))}
      />
    );
  }

  const profile = await ensureSupabaseUser(clerkUser);
  const [folders, sops] = await Promise.all([
    getFoldersForUser(profile.id),
    getSopSummariesForUser(profile.id),
  ]);

  return (
    <AppShell
      folders={folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
      }))}
      sops={sops.map((sop) => ({
        id: sop.id,
        title: sop.title,
        folderId: sop.folder_id,
        updatedAt: sop.updated_at,
        status: sop.status as "draft" | "published" | "archived",
      }))}
    />
  );
}
