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
  const [sopContent, setSopContent] = useState<Record<string, string>>({});
  const [loadingContent, setLoadingContent] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setItems(sops);
  }, [sops]);

  useEffect(() => {
    if (!sops.find((sop) => sop.id === selectedId)) {
      setSelectedId(sops[0]?.id ?? null);
    }
  }, [sops, selectedId]);

  // Load SOP content when selected
  useEffect(() => {
    if (selectedId && !sopContent[selectedId] && !loadingContent[selectedId]) {
      loadSopContent(selectedId);
    }
  }, [selectedId, sopContent, loadingContent]);

  const loadSopContent = async (sopId: string) => {
    setLoadingContent(prev => ({ ...prev, [sopId]: true }));
    try {
      const response = await fetch(`/api/sops/${sopId}`);
      if (response.ok) {
        const data = await response.json();
        setSopContent(prev => ({
          ...prev,
          [sopId]: data.sop.content?.html || "<p class='text-muted-foreground'>Use the AI agent or start typing to draft your SOP.</p>"
        }));
      }
    } catch (error) {
      console.error("Failed to load SOP content:", error);
    } finally {
      setLoadingContent(prev => ({ ...prev, [sopId]: false }));
    }
  };

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

  const handleContentChange = async (content: string) => {
    if (!selectedId) return;
    
    setSopContent(prev => ({
      ...prev,
      [selectedId]: content
    }));

    // Save to backend
    try {
      await fetch("/api/sops", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedId,
          content: content,
        }),
      });
    } catch (error) {
      console.error("Failed to save content:", error);
    }
  };

  const handleTitleChange = async (title: string) => {
    if (!selectedId) return;
    
    setItems(prev => prev.map(sop => 
      sop.id === selectedId ? { ...sop, title } : sop
    ));

    // Save to backend
    try {
      await fetch("/api/sops", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedId,
          title: title,
        }),
      });
    } catch (error) {
      console.error("Failed to save title:", error);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name?.trim()) return;

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error ?? "Failed to create folder");
      }

      const { folder } = (await response.json()) as {
        folder: {
          id: string;
          name: string;
        };
      };

      // Refresh the page to show the new folder
      window.location.reload();
    } catch (error) {
      console.error("[CREATE_FOLDER]", error);
      alert("Failed to create folder. Please try again.");
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
        onCreateFolder={() => {
          void handleCreateFolder();
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
              content={sopContent[activeSop.id]}
              onContentChange={handleContentChange}
              onTitleChange={handleTitleChange}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Create an SOP to start editing.
              </p>
            </div>
          )}
          <AgentPanel 
            onSendMessage={async (message) => {
              console.log("Chat message:", message);
              // TODO: Implement AI chat functionality
            }}
            onUpload={(files) => {
              console.log("Files uploaded:", files);
              // TODO: Implement file upload functionality
            }}
          />
        </div>
      </div>
    </div>
  );
}
