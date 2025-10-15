"use client";

import { useMemo } from "react";
import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase browser client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export function useSupabaseBrowser(): SupabaseClient<Database> {
  return useMemo(() => createSupabaseBrowserClient(), []);
}
