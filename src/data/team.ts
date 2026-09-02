export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  course: string;
  year: string;
  bio: string;
  focus?: string[];
  quote?: string;
  socials?: { platform: string; handle: string }[];
  /** Gradient colors for placeholder avatar */
  avatarGradient: [string, string];
  /** URL to profile picture in Supabase Storage */
  avatarUrl?: string;
}

// Real executive team members are managed via /admin/team.
// This list stays empty so the seed script doesn't recreate placeholder people.
export const team: TeamMember[] = [];
