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
    clientName: string | null;
    coverImageUrl: string | null;
    liveUrl: string | null;
    tags: string[];
    featured: boolean;
    testimonial: string | null;
    testimonialAuthor: string | null;
  };

  // Placeholder projects seeded before the real case studies existed.
  const legacyProjectSlugs = [
    "campus-cafe-rebrand",
    "su-fest-social",
    "fintech-research",
    "marketing-decoded",
    "national-brand-challenge",
    "marketing-week-branding",
  ];

  const portfolioProjects: ProjectSeed[] = [
    {
      slug: "the-13th-roundtables-fair",
      title: "THE 13TH \u2014 Roundtables & Fair",
      category: "flagship",
      desc: "SMC's flagship collaboration with Strathmore University \u2014 a full-day roundtables, exhibitor fair, and panel discussion that became the club's biggest event to date.",
      problem: "The club had reformed only seven months earlier with zero partnerships and no track record. It needed one event that could prove the rebuilt SMC could operate at university scale and earn corporate trust in the same stroke.",
      approach: "Planned and ran a full-day program combining structured roundtables, an exhibitor fair, and a panel discussion on branding, leadership, and digital marketing \u2014 coordinating logistics, sponsor relationships, and student engagement across the university.",
      outcome: "250\u2013300 students attended alongside 48 exhibitors, making it SMC's most successful partnership to date and the capstone of a first year that took the club from 0 to 53 members and 12 events.",
      metrics: ["250-300 attendees", "48 exhibitors", "0 to 53 members in one year"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: "Strathmore University",
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Flagship", "Event Management", "Corporate Partnerships", "Panel Discussion"],
      featured: true,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "ai-students-summit",
      title: "AI Students Summit",
      category: "flagship",
      desc: "A 2-day summit pairing panel discussions with a full-day hackathon, marketed and produced end-to-end by SMC.",
      problem: "Strong programming alone doesn't guarantee turnout \u2014 without sustained visibility across two full days, both attendance and hackathon participation were at risk of falling flat.",
      approach: "Led event marketing, produced video content, and ran digital promotion throughout the two days, pairing panel-discussion coverage with hackathon-day engagement content.",
      outcome: "Drove high participation and visibility across both days, establishing SMC as a credible marketing partner for tech-oriented university programming.",
      metrics: ["2-day event", "1 full-day hackathon"],
      team: [],
      duration: "2 days",
      status: ProjectStatus.DRAFT,
      clientName: null,
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Event Marketing", "Video Production", "Digital Promotion", "Tech"],
      featured: true,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "subaru-industrial-visit",
      title: "Subaru Industrial Visit",
      category: "corporate",
      desc: "An industrial visit to SubaruKe's Mombasa Road showroom and workshop, giving 40 students direct exposure to automotive brand marketing.",
      problem: "Marketing students rarely see how a corporate brand's sales, servicing, and career pipeline actually run day to day \u2014 classroom theory only goes so far.",
      approach: "Organized and coordinated an industrial visit for 40 students to SubaruKe's showroom and workshop, covering car sales operations, servicing processes, and career pathways in automotive sales.",
      outcome: "40 students gained firsthand exposure to automotive brand positioning and experiential promotional strategy; the relationship carried through to Subaru's presence at THE 13TH.",
      metrics: ["40 students", "1 corporate site visit"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: "Subaru (SubaruKe)",
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Corporate Partnership", "Industrial Visit", "Automotive"],
      featured: true,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "mathare-csr-visit",
      title: "Mathare CSR Visit (with SESC)",
      category: "community",
      desc: "A joint CSR and team-building initiative with children from Mathare, combining donations, a sustainability workshop, and team building.",
      problem: "The club wanted its community-impact work to go beyond a one-off donation drive \u2014 pairing genuine CSR with member development rather than treating them as separate.",
      approach: "In partnership with SESC, organized donations, a sustainable waste-management workshop for the children, team-building activities at City Park, and gifts \u2014 combining outward community impact with internal team growth.",
      outcome: "Delivered a CSR initiative with lasting impact for the Mathare children while building interpersonal skills and cohesion within the SMC team.",
      metrics: ["1 CSR partnership (SESC)", "Multiple workshop tracks"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: "SESC",
      coverImageUrl: null,
      liveUrl: null,
      tags: ["CSR", "Community Impact", "Team Building", "Sustainability"],
      featured: true,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "self-love-event",
      title: "Self-Love Event",
      category: "community",
      desc: "Multi-club collaboration promoting self-awareness, confidence, and mental well-being through talks, workshops, and a vendor fair.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: ["~200 attendees", "Multi-club collaboration"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: null,
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Wellness", "Community", "Collaboration"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "vc-run",
      title: "VC Run",
      category: "community",
      desc: "A 2.5km\u201325km fun run with Strathmore University to raise scholarship funds, with fitness challenges and live social coverage.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: ["2.5km-25km run"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: "Strathmore University",
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Fundraising", "Community", "Social Media"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "black-ticket-concert",
      title: "Black Ticket Concert",
      category: "campus",
      desc: "Entertainment event with live performances by local and student artists, interactive audience sessions, and giveaways.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: ["150+ students attended"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: null,
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Entertainment", "Event Production"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "drama-club-waiting-room",
      title: "Drama Club Show \u2014 Waiting Room",
      category: "campus",
      desc: "Marketed and sold tickets for the drama society's three-day play run through video content and student outreach.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: ["3-day run"],
      team: [],
      duration: "3 days",
      status: ProjectStatus.DRAFT,
      clientName: null,
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Marketing Campaign", "Video Content", "Ticket Sales"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "naiverah-groundbreaking",
      title: "Naiverah Groundbreaking Event",
      category: "corporate",
      desc: "Attended Naiverah's groundbreaking event for their Membley, Ruiru apartment development, including a guided tour and early-investment session.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: ["1 corporate partnership"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: "Naivera",
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Real Estate", "Corporate Partnership", "Networking"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "deans-list-ceremony",
      title: "Dean's List Ceremony",
      category: "campus",
      desc: "Designed the event poster and led marketing for the Student Council's ceremony recognizing 500+ students for academic excellence.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: ["500+ students recognized"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: "Strathmore University Student Council",
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Poster Design", "Event Marketing", "Student Council"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "clubs-sports-fair",
      title: "Clubs & Sports Fair",
      category: "campus",
      desc: "Showcased SMC's activities and opened recruitment for the new semester \u2014 one of the club's highest engagement days.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: ["56 students engaged"],
      team: [],
      duration: "1 day",
      status: ProjectStatus.DRAFT,
      clientName: null,
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Recruitment", "Community Engagement"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
    {
      slug: "campus-currency",
      title: "Campus Currency",
      category: "corporate",
      desc: "Collaborated with SBC to market their Campus Currency event through content creation, growing Instagram visibility and signups.",
      problem: "",
      approach: "",
      outcome: "",
      metrics: [],
      team: [],
      // Schema requires a non-null duration; this engagement had no fixed run.
      duration: "Ongoing",
      status: ProjectStatus.DRAFT,
      clientName: "SBC",
      coverImageUrl: null,
      liveUrl: null,
      tags: ["Content Creation", "Social Media Growth", "Partnership"],
      featured: false,
      testimonial: null,
      testimonialAuthor: null,
    },
  ];

  // Drop the old placeholder set so the portfolio reflects real SMC work only.
  const removed = await prisma.project.deleteMany({
    where: { slug: { in: legacyProjectSlugs } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} placeholder portfolio projects`);
  }

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
        focus: member.focus,
        quote: member.quote,
        socials: member.socials as any,
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
