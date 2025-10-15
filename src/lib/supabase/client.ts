"use client";

import { useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type PublicDatabase = Pick<Database, "public">;
type BrowserClient = SupabaseClient<PublicDatabase, "public">;

export function createSupabaseBrowserClient(): BrowserClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase browser client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient<PublicDatabase, "public">(
    supabaseUrl,
    supabaseAnonKey,
    {
      db: { schema: "public" },
    }
  );
}

export function useSupabaseBrowser(): BrowserClient {
  return useMemo(() => createSupabaseBrowserClient(), []);
}
