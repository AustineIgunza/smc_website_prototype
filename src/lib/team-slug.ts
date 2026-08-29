import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Converts a role string into a clean, URL-friendly slug.
 * Examples:
 * - "Director of Finance" -> "director-of-finance"
 * - "Director of Events and PR" -> "director-of-events-and-pr"
 * - "Creative Lead" -> "creative-lead"
 */
export function slugifyRole(role: string): string {
  return (
    role
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "member"
  );
}

/**
 * Generates a unique slug based on role, avoiding collisions with existing team members.
 */
export async function generateUniqueTeamSlug(
  supabase: SupabaseClient,
  role: string,
  currentId?: string
): Promise<string> {
  const baseSlug = slugifyRole(role);
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase
      .from("TeamMember")
      .select("id")
      .eq("id", candidate);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("Error checking slug uniqueness:", error);
      return candidate;
    }

    if (!data) {
      return candidate;
    }

    counter++;
    candidate = `${baseSlug}-${counter}`;
  }
}
