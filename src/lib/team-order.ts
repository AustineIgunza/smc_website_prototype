// Executive team display order: Chairperson first, Deputy/Vice second,
// everyone else in creation order.
type MemberLike = { role: string; createdAt?: string | Date | null };

function priority(role: string): number {
  const r = role.toLowerCase();
  // Match "Chairperson" but NOT "Deputy/Vice Chairperson"
  if (r.includes("chairperson") && !r.includes("deputy") && !r.includes("vice")) {
    return 0;
  }
  if (r.includes("deputy") || r.includes("vice")) {
    return 1;
  }
  return 2;
}

export function sortExecutiveTeam<T extends MemberLike>(members: T[]): T[] {
  return [...members].sort((a, b) => {
    const pa = priority(a.role);
    const pb = priority(b.role);
    if (pa !== pb) return pa - pb;
    // Same priority tier -> preserve creation order (oldest first).
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return ta - tb;
  });
}
