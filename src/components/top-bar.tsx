"use client";

import { FileDown, Play, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

interface TopBarProps {
  onCreateSop?: () => void;
  onExport?: (format: "pdf" | "docx") => void;
  onArcade?: () => void;
  isCreatingSop?: boolean;
}

export function TopBar({
  onCreateSop,
  onExport,
  onArcade,
  isCreatingSop,
}: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          Standard Operator
        </span>
        <Separator orientation="vertical" className="h-6" />
        <Button size="sm" onClick={onCreateSop} disabled={isCreatingSop}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreatingSop ? "Creating..." : "New SOP"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => onExport?.("pdf")}
              className="cursor-pointer"
            >
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport?.("docx")}
              className="cursor-pointer"
            >
              Export as Word
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="secondary" onClick={onArcade}>
          <Play className="mr-2 h-4 w-4" />
          Arcade Mode
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm" variant="outline">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
      </div>
    </header>
  );
}
