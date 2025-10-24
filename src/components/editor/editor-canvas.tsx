"use client";

import { useState, useRef, useEffect } from "react";

interface EditorCanvasProps {
  title: string;
  content?: string;
  onContentChange?: (content: string) => void;
  onTitleChange?: (title: string) => void;
}

export function EditorCanvas({ 
  title, 
  content, 
  onContentChange,
  onTitleChange 
}: EditorCanvasProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(
    content || "<p class='text-muted-foreground'>Use the AI agent or start typing to draft your SOP.</p>"
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    setEditedContent(
      content || "<p class='text-muted-foreground'>Use the AI agent or start typing to draft your SOP.</p>"
    );
  }, [content]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim() && editedTitle !== title) {
      onTitleChange?.(editedTitle.trim());
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      setEditedContent(newContent);
      onContentChange?.(newContent);
    }
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="border-b px-8 py-6">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleBlur();
              }
            }}
            className="text-2xl font-semibold tracking-tight bg-transparent border-none outline-none w-full"
            autoFocus
          />
        ) : (
          <h1 
            className="text-2xl font-semibold tracking-tight cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
            onClick={() => setIsEditingTitle(true)}
          >
            {editedTitle}
          </h1>
        )}
        <p className="text-sm text-muted-foreground">
          Draft and refine your procedures in real-time.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div
          ref={contentRef}
          className="prose prose-neutral max-w-none focus:outline-none"
          contentEditable
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: editedContent }}
          onInput={handleContentChange}
          onBlur={handleContentChange}
        />
      </div>
    </section>
  );
}
