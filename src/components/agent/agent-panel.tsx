"use client";

import { useState } from "react";
import { Paperclip, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AgentPanelProps {
  initialMessages?: AgentMessage[];
  onSendMessage?: (message: string) => Promise<void> | void;
  onUpload?: (fileList: FileList) => void;
}

export function AgentPanel({
  initialMessages = [
    {
      id: "assistant-1",
      role: "assistant",
      content:
        "Upload reference materials or ask me to draft a new SOP. I'll keep clarifying until we have a precise workflow.",
    },
  ],
  onSendMessage,
  onUpload,
}: AgentPanelProps) {
  const [messages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const handleSend = async () => {
    if (!draft.trim()) return;
    await onSendMessage?.(draft);
    setDraft("");
  };

  return (
    <aside className="flex h-full w-96 min-w-80 flex-col border-l bg-muted/40">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">AI Agent</h2>
        <p className="text-xs text-muted-foreground">
          Summarize documents, answer questions, and draft SOP steps.
        </p>
      </div>
      <ScrollArea className="flex-1 px-5 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="rounded-lg bg-card px-3 py-2 text-sm shadow-sm"
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {message.role === "assistant" ? "Agent" : "You"}
              </p>
              <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <label
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground/40 text-muted-foreground transition hover:bg-muted"
            aria-label="Upload files"
          >
            <Paperclip className="h-4 w-4" />
            <input
              onChange={(event) => {
                if (event.target.files?.length) {
                  onUpload?.(event.target.files);
                }
              }}
              type="file"
              multiple
              className="hidden"
            />
          </label>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask for a new SOP or clarify a step..."
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            rows={3}
          />
          <Button size="icon" onClick={handleSend} disabled={!draft.trim()}>
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
