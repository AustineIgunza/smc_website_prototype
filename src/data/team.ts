export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  course: string;
  year: string;
  bio: string;
  focus: string[];
  quote: string;
  socials: { platform: string; handle: string }[];
  /** Gradient colors for placeholder avatar */
  avatarGradient: [string, string];
  /** URL to profile picture in Supabase Storage */
  avatarUrl?: string;
}

export const team: TeamMember[] = [
  {
    id: "chairperson",
    name: "Amara Osei",
    role: "Chairperson",
    title: "Overall club leadership and strategy",
    course: "Bachelor of Commerce — Marketing",
    year: "4th Year",
    bio: "Amara has been a member of SMC since her first year and rose through the ranks from Events Committee to Director of Partnerships before being elected Chairperson. She led the club's most successful Marketing Week to date, securing partnerships with three multinational brands. Under her leadership, SMC has grown from 20 to over 30 active members and launched its first inter-university collaboration. Amara is passionate about brand storytelling and plans to pursue a career in brand management after graduation.",
    focus: ["Strategic planning", "Stakeholder management", "Brand partnerships", "Team leadership"],
    quote: "Marketing isn't about selling — it's about telling stories that people want to be part of.",
    socials: [
      { platform: "LinkedIn", handle: "amara-osei" },
      { platform: "Twitter", handle: "@amaraosei" },
    ],
    avatarGradient: ["#FFA829", "#CC8802"],
  },
  {
    id: "vice-chairperson",
    name: "Kevin Mwangi",
    role: "Vice Chairperson",
    title: "Operations, partnerships, and member experience",
    course: "Bachelor of Business Science — Finance",
    year: "3rd Year",
    bio: "Kevin brings a unique finance-meets-marketing perspective to SMC. He redesigned the club's member onboarding process, increasing retention by 40%. He manages partnerships with local agencies and oversees the mentorship programme that pairs new members with experienced seniors. Kevin has interned at both a fintech startup and an advertising agency, giving him a rare blend of analytical and creative thinking.",
    focus: ["Operations management", "Partnership development", "Member engagement", "Financial strategy"],
    quote: "Great marketing starts with understanding the numbers behind the story.",
    socials: [
      { platform: "LinkedIn", handle: "kevin-mwangi" },
      { platform: "Instagram", handle: "@kev.mwangi" },
    ],
    avatarGradient: ["#013953", "#00313F"],
  },
  {
    id: "secretary-general",
    name: "Fatima Hassan",
    role: "Secretary General",
    title: "Communications, minutes, and documentation",
    course: "Bachelor of Arts — Communication",
    year: "3rd Year",
    bio: "Fatima is the organisational backbone of SMC. She manages all internal communications, maintains comprehensive meeting records, and oversees the club's documentation. Her background in communications means every email, newsletter, and official statement from SMC is polished and on-brand. She also coordinates with the university administration to ensure SMC stays in good standing and has access to resources.",
    focus: ["Internal communications", "Documentation", "University liaison", "Newsletter curation"],
    quote: "Clear communication is the foundation of every successful campaign — and every successful team.",
    socials: [
      { platform: "LinkedIn", handle: "fatima-hassan" },
      { platform: "Twitter", handle: "@fatimawrites" },
    ],
    avatarGradient: ["#6366f1", "#8b5cf6"],
  },
  {
    id: "treasurer",
    name: "Daniel Kiprop",
    role: "Treasurer",
    title: "Budgets, finances, and sponsorship management",
    course: "Bachelor of Business Science — Actuarial Science",
    year: "4th Year",
    bio: "Daniel ensures every shilling is accounted for. He manages the club's annual budget, tracks sponsorship funds, and produces financial reports for the executive board and university oversight. His actuarial background gives him a sharp eye for risk management and forecasting, which he applies to event budgeting and sponsorship negotiations. Daniel has helped SMC become one of the best-funded student clubs at Strathmore.",
    focus: ["Budget management", "Sponsorship tracking", "Financial reporting", "Risk assessment"],
    quote: "A well-funded club is a well-executed vision. Every budget line tells a story.",
    socials: [
      { platform: "LinkedIn", handle: "daniel-kiprop" },
    ],
    avatarGradient: ["#059669", "#10b981"],
  },
  {
    id: "director-marketing",
    name: "Grace Wanjiku",
    role: "Director of Marketing",
    title: "Brand strategy, content, and social media",
    course: "Bachelor of Commerce — Marketing",
    year: "3rd Year",
    bio: "Grace owns SMC's voice across every channel. She grew the club's Instagram following by 150% in one semester through a consistent content strategy built around educational carousels, behind-the-scenes reels, and member spotlights. She manages a team of five content creators and coordinates with the Director of Creatives to ensure visual consistency. Grace has completed certifications in Google Analytics and Meta Blueprint.",
    focus: ["Content strategy", "Social media management", "Brand voice", "Analytics & insights"],
    quote: "Every post is a chance to either build trust or lose it. I choose to build.",
    socials: [
      { platform: "LinkedIn", handle: "grace-wanjiku" },
      { platform: "Instagram", handle: "@gracewanjiku" },
      { platform: "Twitter", handle: "@gracewanjiku_" },
    ],
    avatarGradient: ["#ec4899", "#f43f5e"],
  },
  {
    id: "director-events",
    name: "Brian Otieno",
    role: "Director of Events",
    title: "Planning, logistics, and event execution",
    course: "Bachelor of Commerce — Management",
    year: "3rd Year",
    bio: "Brian is the engine behind every SMC event. From Marketing Week to Agency Nights, he handles venue logistics, speaker coordination, volunteer management, and post-event reporting. He introduced a structured event framework that reduced planning time by 30% while improving attendee satisfaction scores. Brian is known for his calm under pressure — even when a keynote speaker cancelled 2 hours before Marketing Week's opening ceremony, he had a backup plan ready.",
    focus: ["Event planning", "Logistics coordination", "Speaker management", "Post-event analytics"],
    quote: "A flawless event looks effortless. Behind the scenes, it's a hundred decisions made right.",
    socials: [
      { platform: "LinkedIn", handle: "brian-otieno" },
    ],
    avatarGradient: ["#f59e0b", "#d97706"],
  },
  {
    id: "director-creatives",
    name: "Zuri Adhiambo",
    role: "Director of Creatives",
    title: "Design, visual identity, and production",
    course: "Bachelor of Informatics & Computer Science",
    year: "2nd Year",
    bio: "Zuri is the youngest member of the executive team and the most visually driven. She leads a design squad of four, producing everything from event posters and social media graphics to branded merchandise and the annual report. She standardised SMC's design system — creating templates, brand guidelines, and asset libraries that ensure every piece of output is unmistakably SMC. Zuri is self-taught in Figma, After Effects, and 3D rendering.",
    focus: ["Visual design", "Brand identity", "Motion graphics", "Design systems"],
    quote: "Design isn't decoration — it's the first thing people feel before they read a single word.",
    socials: [
      { platform: "LinkedIn", handle: "zuri-adhiambo" },
      { platform: "Instagram", handle: "@zuridesigns" },
    ],
    avatarGradient: ["#8b5cf6", "#a78bfa"],
  },
  {
    id: "director-research",
    name: "James Mutua",
    role: "Director of Research",
    title: "Market research, insights, and analytics",
    course: "Bachelor of Business Science — Economics",
    year: "4th Year",
    bio: "James brings academic rigour to SMC's creative ambitions. He leads market research projects for partner brands, designs surveys, runs focus groups, and distils findings into actionable insights. His team's research on student fintech adoption was published in a university journal and cited by a Nairobi-based startup in their investor pitch. James is the go-to person when any SMC project needs data to back up its strategy.",
    focus: ["Market research", "Data analysis", "Consumer insights", "Survey design"],
    quote: "Gut feeling is great. Gut feeling backed by data is unstoppable.",
    socials: [
      { platform: "LinkedIn", handle: "james-mutua" },
    ],
    avatarGradient: ["#0891b2", "#06b6d4"],
  },
];
