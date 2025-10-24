"use client";

import { Plus, Folder as FolderIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { FolderSummary, SopSummary } from "@/types/sop";

interface LibrarySidebarProps {
  folders: FolderSummary[];
  sops: SopSummary[];
  selectedSopId?: string | null;
  onSelectSop?: (sopId: string) => void;
  onCreateSop?: () => void;
  onCreateFolder?: () => void;
}

export function LibrarySidebar({
  folders,
  sops,
  selectedSopId,
  onSelectSop,
  onCreateSop,
  onCreateFolder,
}: LibrarySidebarProps) {
  const grouped = new Map<string | null, SopSummary[]>();
  for (const sop of sops) {
    const bucket = grouped.get(sop.folderId) ?? [];
    bucket.push(sop);
    grouped.set(sop.folderId, bucket);
  }

  return (
    <aside className="flex h-full w-72 min-w-72 flex-col border-r bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Library</p>
          <p className="text-xs text-muted-foreground">
            Manage SOPs and folders
          </p>
        </div>
        <Button
          size="icon"
          variant="outline"
          aria-label="Create SOP"
          onClick={onCreateSop}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-4 pr-2">
          <div>
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                <FolderIcon className="h-3.5 w-3.5" />
                Folders
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={onCreateFolder}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <nav className="space-y-1">
              {folders.length === 0 ? (
                <p className="px-2 text-sm text-muted-foreground">
                  No folders yet.
                </p>
              ) : (
                folders.map((folder) => (
                  <button
                    key={folder.id}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-muted"
                    type="button"
                  >
                    <span className="truncate">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {grouped.get(folder.id)?.length ?? 0}
                    </span>
                  </button>
                ))
              )}
            </nav>
          </div>

          <Separator />

          <div>
            <p className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              SOPs
            </p>
            <nav className="space-y-1">
              {sops.length === 0 ? (
                <p className="px-2 text-sm text-muted-foreground">
                  Create your first SOP to get started.
                </p>
              ) : (
                sops.map((sop) => (
                  <button
                    key={sop.id}
                    type="button"
                    onClick={() => onSelectSop?.(sop.id)}
                    className={cn(
                      "flex w-full flex-col rounded-md px-3 py-2 text-left transition hover:bg-muted",
                      selectedSopId === sop.id && "bg-muted"
                    )}
                  >
                    <span className="truncate text-sm font-medium">
                      {sop.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Updated {new Date(sop.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))
              )}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
