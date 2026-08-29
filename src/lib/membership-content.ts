import { createClient } from "@/lib/supabase/server";
import { DEFAULT_MEMBERSHIP_CONTENT, type MembershipContent } from "@/data/membership-defaults";

// Load membership page content from the MembershipContent singleton row. Any missing
// fields fall back to DEFAULT_MEMBERSHIP_CONTENT so the page always renders.
export async function getMembershipContent(): Promise<MembershipContent> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("MembershipContent")
      .select("*")
      .eq("id", "membership")
      .maybeSingle();
    if (!data) return DEFAULT_MEMBERSHIP_CONTENT;
    
    // Parse JSON fields or fallback if they are missing
    const parsedData = {
      ...data,
      benefits: Array.isArray(data.benefits) ? data.benefits : DEFAULT_MEMBERSHIP_CONTENT.benefits,
      joinSteps: Array.isArray(data.joinSteps) ? data.joinSteps : DEFAULT_MEMBERSHIP_CONTENT.joinSteps,
    };
    
    return { ...DEFAULT_MEMBERSHIP_CONTENT, ...stripNulls(parsedData) } as unknown as MembershipContent;
  } catch {
    return DEFAULT_MEMBERSHIP_CONTENT;
  }
}

function stripNulls(row: Record<string, unknown>): Partial<MembershipContent> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out as Partial<MembershipContent>;
}
