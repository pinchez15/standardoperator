"use client";

import { useEffect, useMemo, useState } from "react";
import { LibrarySidebar } from "@/components/library-sidebar";
import { TopBar } from "@/components/top-bar";
import { AgentPanel } from "@/components/agent/agent-panel";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import type { FolderSummary, SopSummary } from "@/types/sop";

interface AppShellProps {
  sops: SopSummary[];
  folders: FolderSummary[];
}

export function AppShell({ sops, folders }: AppShellProps) {
  const [items, setItems] = useState<SopSummary[]>(sops);
  const [selectedId, setSelectedId] = useState<string | null>(
    sops[0]?.id ?? null
  );
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setItems(sops);
  }, [sops]);

  useEffect(() => {
    if (!sops.find((sop) => sop.id === selectedId)) {
      setSelectedId(sops[0]?.id ?? null);
    }
  }, [sops, selectedId]);

  const activeSop = useMemo(
    () => items.find((sop) => sop.id === selectedId) ?? items[0] ?? null,
    [items, selectedId]
  );

  const handleCreateSop = async () => {
    try {
      setIsCreating(true);
      const response = await fetch("/api/sops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error ?? "Failed to create SOP");
      }

      const { sop } = (await response.json()) as {
        sop: {
          id: string;
          title: string;
          folder_id: string | null;
          status: string;
          updated_at: string;
        };
      };

      const normalized: SopSummary = {
        id: sop.id,
        title: sop.title,
        folderId: sop.folder_id,
        status: sop.status as SopSummary["status"],
        updatedAt: sop.updated_at,
      };

      setItems((prev) => [normalized, ...prev]);
      setSelectedId(normalized.id);
    } catch (error) {
      console.error("[CREATE_SOP]", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <LibrarySidebar
        folders={folders}
        sops={items}
        selectedSopId={activeSop?.id}
        onSelectSop={setSelectedId}
        onCreateSop={() => {
          void handleCreateSop();
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onCreateSop={() => void handleCreateSop()}
          isCreatingSop={isCreating}
          onExport={(format) => {
            console.log("Export requested:", format);
          }}
          onArcade={() => {
            console.log("Arcade mode requested");
          }}
        />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {activeSop ? (
            <EditorCanvas
              title={activeSop.title}
              content="<p>Start collaborating on your SOP content here.</p>"
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Create an SOP to start editing.
              </p>
            </div>
          )}
          <AgentPanel />
        </div>
      </div>
    </div>
  );
}
