import dotenv from "dotenv";
dotenv.config();

import { PrismaClient, EventType, EventStatus, OwnerType, ProjectStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { team } from "../../data/team";

function createPrismaClient() {
  const url = process.env.DATABASE_URL!;

  if (url.startsWith("file:")) {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url });
    return new PrismaClient({ adapter });
  }

  const { PrismaPg } = require("@prisma/adapter-pg");
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  console.log("Seeding database...");
  console.log("DB URL:", process.env.DATABASE_URL);

  const partner = await prisma.partner.upsert({
    where: { id: "partner-ogilvy" },
    update: {},
    create: {
      id: "partner-ogilvy",
      name: "Ogilvy Africa",
      contactEmail: "events@ogilvy.co.ke",
      contactPhone: "+254700000000",
    },
  });

  console.log(`Created partner: ${partner.name}`);

  const events: Prisma.EventCreateInput[] = [
    {
      slug: "marketing-week",
      title: "Marketing Week",
      description:
        "A week-long immersion featuring industry panels, brand challenges, and the annual pitch competition.",
      category: "Flagship",
      type: EventType.FREE,
      priceKes: 0,
      capacity: 200,
      startsAt: new Date("2026-09-15T09:00:00"),
      location: "Strathmore Auditorium",
      status: EventStatus.PUBLISHED,
      ownerType: OwnerType.INTERNAL,
    },
    {
      slug: "digital-strategy-bootcamp",
      title: "Digital Strategy Bootcamp",
      description:
        "Hands-on sessions covering SEO, social media analytics, paid ads, and content calendars.",
      category: "Workshop",
      type: EventType.FREE,
      priceKes: 0,
      capacity: 40,
      startsAt: new Date("2026-07-12T10:00:00"),
      location: "SBS Computer Lab 3",
      status: EventStatus.PUBLISHED,
      ownerType: OwnerType.INTERNAL,
    },
    {
      slug: "agency-nights",
      title: "Agency Nights",
      description:
        "Intimate evenings with agency leaders — hear their stories, ask your questions, make connections.",
      category: "Networking",
      type: EventType.PAID,
      priceKes: 500,
      capacity: 60,
      startsAt: new Date("2026-08-08T18:00:00"),
      location: "Strathmore Rooftop Lounge",
      status: EventStatus.PUBLISHED,
      ownerType: OwnerType.PARTNER,
      partner: { connect: { id: partner.id } },
      commissionRate: 0.15,
    },
    {
      slug: "brand-challenge",
      title: "Brand Challenge",
      description:
        "Teams compete to solve a real brand brief. Winners present to the client's marketing team.",
      category: "Competition",
      type: EventType.FREE,
      priceKes: 0,
      capacity: 80,
      startsAt: new Date("2026-10-03T09:00:00"),
      location: "SBS Amphitheatre",
      status: EventStatus.PUBLISHED,
      ownerType: OwnerType.INTERNAL,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log(`Created ${events.length} events`);

  // Seed Past Events
  const { pastEventsData } = await import("../../data/pastEvents");
  for (const pe of pastEventsData) {
    await (prisma as any).pastEvent.upsert({
      where: { slug: pe.slug },
      update: {},
      create: {
        slug: pe.slug,
        title: pe.title,
        description: pe.description,
        category: pe.category,
        date: new Date(pe.date),
        location: pe.location,
        attendanceCount: pe.attendanceCount,
        coverImageUrl: pe.coverImageUrl,
        galleryUrls: pe.galleryUrls,
        highlights: pe.highlights,
        keyTakeaways: pe.keyTakeaways,
        speakers: pe.speakers,
        partnerName: pe.partnerName || null,
        testimonial: pe.testimonial || null,
        testimonialAuthor: pe.testimonialAuthor || null,
        status: pe.status === "DRAFT" ? EventStatus.DRAFT : EventStatus.PUBLISHED,
      },
    });
  }
  console.log(`Created ${pastEventsData.length} past events`);

  // Portfolio projects
  type ProjectSeed = {
    slug: string;
    title: string;
    category: string;
    desc: string;
    problem: string;
    approach: string;
    outcome: string;
    metrics: string[];
    team: string[];
    duration: string;
    status: ProjectStatus;
  };

  const portfolioProjects: ProjectSeed[] = [
    {
      slug: "campus-cafe-rebrand",
      title: "Rebrand Sprint — Campus Café",
      category: "Branding",
      desc: "Full visual identity overhaul: logo, menu design, social media templates, and launch campaign.",
      problem: "The campus café had an outdated identity that didn't resonate with students. Foot traffic had dropped 20% over two semesters and their social media was inactive.",
      approach: "Conducted a student survey (200+ responses), ran a competitor audit of nearby eateries, then delivered a complete rebrand: new logo, colour palette, menu layout, branded packaging, and a social media launch kit with 30 days of scheduled content.",
      outcome: "Foot traffic increased 35% within the first month post-launch. The café's Instagram gained 800 followers in two weeks. The owner extended the partnership for ongoing social media management.",
      metrics: ["35% foot traffic increase", "800 new followers in 2 weeks", "200+ survey respondents"],
      team: ["Grace Wanjiku", "Zuri Adhiambo", "Fatima Hassan"],
      duration: "6 weeks",
      status: ProjectStatus.PUBLISHED,
    },
    {
      slug: "su-fest-social",
      title: "Social Media Takeover — SU Fest",
      category: "Digital Marketing",
      desc: "Managed end-to-end social strategy for the university festival — 40k+ impressions in 3 days.",
      problem: "The Student Union needed a social media partner to generate hype for their annual festival. Previous years relied on posters and word-of-mouth with limited digital reach.",
      approach: "Created a 2-week pre-event content calendar with countdown posts, speaker reveals, and interactive polls. During the festival, ran real-time Instagram Stories, TikTok recaps, and a Twitter live thread. Used targeted hashtags and partnered with 5 student influencers.",
      outcome: "Generated 40,000+ impressions across platforms in just 3 days. Ticket pre-sales exceeded the target by 60%. The SU has since made SMC their permanent digital partner.",
      metrics: ["40k+ impressions", "60% above ticket target", "5 influencer partnerships"],
      team: ["Grace Wanjiku", "Brian Otieno", "Kevin Mwangi"],
      duration: "3 weeks",
      status: ProjectStatus.PUBLISHED,
    },
    {
      slug: "fintech-research",
      title: "Market Research — Fintech Startup",
      category: "Research & Strategy",
      desc: "Conducted primary research and competitor analysis to inform a go-to-market strategy for a Nairobi fintech.",
      problem: "A Nairobi-based fintech startup needed to understand student banking habits and pain points before launching their campus savings product. They had no budget for a professional research firm.",
      approach: "Designed and deployed a structured survey across 3 universities (500+ respondents), conducted 4 focus groups, and performed a competitive landscape analysis of 8 existing student-focused fintech products. Delivered a 40-page report with persona maps and channel recommendations.",
      outcome: "The startup used our research to refine their product positioning and secure a seed funding round. Our persona maps were directly cited in their investor deck. The project was featured in a Strathmore University research newsletter.",
      metrics: ["500+ survey respondents", "40-page research report", "Cited in investor pitch deck"],
      team: ["James Mutua", "Daniel Kiprop", "Amara Osei"],
      duration: "8 weeks",
      status: ProjectStatus.PUBLISHED,
    },
    {
      slug: "marketing-decoded",
      title: 'Content Series — "Marketing Decoded"',
      category: "Content Creation",
      desc: "Weekly Instagram carousel series breaking down marketing concepts — grew SMC page by 2k followers.",
      problem: "SMC's social media was active but lacked a consistent content pillar that provided educational value. Engagement rates had plateaued and follower growth stalled.",
      approach: "Launched 'Marketing Decoded' — a weekly Instagram carousel series breaking down complex marketing concepts into 10-slide visual explainers. Topics ranged from 'The Psychology of Colour in Branding' to 'How Safaricom Builds Brand Loyalty'. Each post followed a strict design template for visual consistency.",
      outcome: "The series ran for 16 weeks and became SMC's highest-performing content format. Average engagement rate jumped from 3% to 8%. The page gained 2,000 new followers, and two posts were reshared by industry professionals.",
      metrics: ["2k new followers", "8% engagement rate", "16-week series run"],
      team: ["Grace Wanjiku", "Zuri Adhiambo"],
      duration: "16 weeks (ongoing)",
      status: ProjectStatus.PUBLISHED,
    },
    {
      slug: "national-brand-challenge",
      title: "Pitch Deck — National Brand Challenge",
      category: "Campaign Strategy",
      desc: "Built and presented a full campaign pitch for a FMCG brand at a national inter-university competition.",
      problem: "SMC was invited to the National Brand Challenge — a competition where university teams build a full marketing campaign for a real FMCG brief. The team had 48 hours to go from brief to boardroom presentation.",
      approach: "Assembled a cross-functional team of 5, divided into insight, strategy, creative, and media sub-teams. Conducted rapid consumer research via social listening and street interviews, built a full campaign strategy with a creative big idea, and produced a polished 25-slide pitch deck with mock ad creatives.",
      outcome: "Finished 2nd nationally out of 12 universities. The judging panel praised the depth of consumer insight and the production quality of the mock creatives. The experience led to two team members receiving internship offers from the sponsoring brand.",
      metrics: ["2nd place nationally", "12 competing universities", "2 internship offers"],
      team: ["Amara Osei", "Kevin Mwangi", "Zuri Adhiambo", "James Mutua", "Grace Wanjiku"],
      duration: "48 hours",
      status: ProjectStatus.PUBLISHED,
    },
    {
      slug: "marketing-week-branding",
      title: "Event Branding — Marketing Week 2025",
      category: "Design & Production",
      desc: "Designed all event collateral: banners, lanyards, social kits, and a 40-page post-event report.",
      problem: "Marketing Week 2025 needed a unified visual identity across physical and digital touchpoints — from stage banners and lanyards to social media templates and a post-event report. Previous years had inconsistent branding.",
      approach: "Created a bespoke event identity system: logo lockup, colour extensions, typography pairings, and a modular design kit. Produced 15+ print assets (banners, programmes, name badges), a social media kit (stories, posts, frames), and a 40-page post-event report with photography and data visualisation.",
      outcome: "Marketing Week 2025 was the most visually cohesive edition to date. Attendee feedback rated the 'professional feel' at 4.8/5. The design system is now the template for all future SMC events.",
      metrics: ["4.8/5 professionalism rating", "15+ print assets", "40-page post-event report"],
      team: ["Zuri Adhiambo", "Grace Wanjiku", "Brian Otieno"],
      duration: "4 weeks",
      status: ProjectStatus.PUBLISHED,
    },
  ];

  for (const project of portfolioProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  console.log(`Created ${portfolioProjects.length} portfolio projects`);

  // Seed Team Members
  console.log("Seeding team members...");
  for (const member of team) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {},
      create: {
        id: member.id,
        name: member.name,
        role: member.role,
        title: member.title,
        course: member.course,
        year: member.year,
        bio: member.bio,
        focus: member.focus ?? [],
        quote: member.quote ?? null,
        socials: (member.socials as any) ?? [],
        avatarGradient: member.avatarGradient,
      },
    });
  }
  console.log(`Created ${team.length} team members`);
  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
