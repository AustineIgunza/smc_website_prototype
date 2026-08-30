import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PARTNERSHIPS_CONTENT, type PartnershipsContent } from "@/data/partnerships";

// Load partnerships content from the PartnershipsContent singleton row. Any missing
// fields fall back to DEFAULT_PARTNERSHIPS_CONTENT so the page always renders cleanly.
export async function getPartnershipsContent(): Promise<PartnershipsContent> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("PartnershipsContent")
      .select("*")
      .eq("id", "partnerships")
      .maybeSingle();
    if (!data) return DEFAULT_PARTNERSHIPS_CONTENT;

    // Parse JSON fields or fallback if missing/corrupt
    const parsedData = {
      ...data,
      internalPartners: Array.isArray(data.internalPartners)
        ? data.internalPartners
        : DEFAULT_PARTNERSHIPS_CONTENT.internalPartners,
      externalPartners: Array.isArray(data.externalPartners)
        ? data.externalPartners
        : DEFAULT_PARTNERSHIPS_CONTENT.externalPartners,
    };

    return {
      ...DEFAULT_PARTNERSHIPS_CONTENT,
      ...stripNulls(parsedData),
    } as unknown as PartnershipsContent;
  } catch {
    return DEFAULT_PARTNERSHIPS_CONTENT;
  }
}

function stripNulls(row: Record<string, unknown>): Partial<PartnershipsContent> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out as Partial<PartnershipsContent>;
}
