"use client";

import { useMemo } from "react";

interface EditorCanvasProps {
  title: string;
  content?: string;
}

export function EditorCanvas({ title, content }: EditorCanvasProps) {
  const resolvedContent = useMemo(
    () =>
      content ??
      "<p class='text-muted-foreground'>Use the AI agent or start typing to draft your SOP.</p>",
    [content]
  );

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="border-b px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">
          Draft and refine your procedures in real-time.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div
          className="prose prose-neutral max-w-none"
          data-editable
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: resolvedContent }}
        />
      </div>
    </section>
  );
}
