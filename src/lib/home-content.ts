import { createClient } from "@/lib/supabase/server";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/data/home-defaults";

// Load homepage content from the HomeContent singleton row. Any missing
// fields fall back to DEFAULT_HOME_CONTENT so the page always renders.
export async function getHomeContent(): Promise<HomeContent> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("HomeContent")
      .select("*")
      .eq("id", "home")
      .maybeSingle();
    if (!data) return DEFAULT_HOME_CONTENT;
    return { ...DEFAULT_HOME_CONTENT, ...stripNulls(data) };
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}

function stripNulls(row: Record<string, unknown>): Partial<HomeContent> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out as Partial<HomeContent>;
}
