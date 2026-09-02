import dotenv from "dotenv";
dotenv.config();

import { PrismaClient, EventType, EventStatus, OwnerType, ProjectStatus } from "@prisma/client";
import { portfolioProjects, legacyProjectSlugs } from "./portfolioProjects";
import type { Prisma } from "@prisma/client";
import { team } from "../../data/team";
import { DEFAULT_PARTNERSHIPS_CONTENT } from "../../data/partnerships";
import { DEFAULT_HOME_CONTENT } from "../../data/home-defaults";
import { DEFAULT_MEMBERSHIP_CONTENT } from "../../data/membership-defaults";

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

  // Placeholder upcoming events — kept as DRAFT so they don't render publicly
  // but remain editable in /admin/events until real upcoming events replace them.
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
      status: EventStatus.DRAFT,
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
      status: EventStatus.DRAFT,
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
      status: EventStatus.DRAFT,
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
      status: EventStatus.DRAFT,
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

  // Seed Past Events.
  // We upsert both create AND update on the canonical data so re-running the
  // seed refreshes rows that were populated from placeholder content.
  const { pastEventsData } = await import("../../data/pastEvents");
  for (const pe of pastEventsData) {
    const data = {
      slug: pe.slug,
      title: pe.title,
      description: pe.description,
      category: pe.category ?? "",
      date: new Date(pe.date),
      location: pe.location,
      attendanceCount: pe.attendanceCount || null,
      coverImageUrl: pe.coverImageUrl || null,
      galleryUrls: pe.galleryUrls,
      highlights: pe.highlights,
      keyTakeaways: pe.keyTakeaways,
      speakers: pe.speakers,
      partnerName: pe.partnerName || null,
      testimonial: pe.testimonial || null,
      testimonialAuthor: pe.testimonialAuthor || null,
      status: pe.status === "DRAFT" ? EventStatus.DRAFT : EventStatus.PUBLISHED,
    };
    await (prisma as any).pastEvent.upsert({
      where: { slug: pe.slug },
      update: data,
      create: data,
    });
  }
  console.log(`Created/updated ${pastEventsData.length} past events`);

  // Portfolio projects — data lives in ./portfolioProjects so the REST
  // seeding path shares exactly the same source of truth.
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

  // Backfill cover images for the 3 projects we now have PDF photos for.
  // Only fills nulls so admin-uploaded covers aren't overwritten.
  const coverBackfills: Array<[string, string]> = [
    ["the-13th-roundtables-fair", "/events/the13th-panel.jpg"],
    ["subaru-industrial-visit", "/events/subaru-showroom.jpg"],
    ["mathare-csr-visit", "/events/mathare-kids-bus.jpg"],
  ];
  for (const [slug, url] of coverBackfills) {
    await prisma.project.updateMany({
      where: { slug, coverImageUrl: null },
      data: { coverImageUrl: url },
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

  // Seed singleton content rows (Home, Membership, Partnerships).
  // These upserts refresh both create AND update so re-running the seed
  // brings the defaults through to the live rows.
  console.log("Seeding home content...");
  const homeData = {
    heroEyebrow: DEFAULT_HOME_CONTENT.heroEyebrow,
    heroTitleLine1: DEFAULT_HOME_CONTENT.heroTitleLine1,
    heroTitleLine2: DEFAULT_HOME_CONTENT.heroTitleLine2,
    heroTitleAccent: DEFAULT_HOME_CONTENT.heroTitleAccent,
    heroSubtitle: DEFAULT_HOME_CONTENT.heroSubtitle,
    heroPrimaryCtaLabel: DEFAULT_HOME_CONTENT.heroPrimaryCtaLabel,
    heroPrimaryCtaHref: DEFAULT_HOME_CONTENT.heroPrimaryCtaHref,
    heroSecondaryCtaLabel: DEFAULT_HOME_CONTENT.heroSecondaryCtaLabel,
    heroSecondaryCtaHref: DEFAULT_HOME_CONTENT.heroSecondaryCtaHref,
    missionEyebrow: DEFAULT_HOME_CONTENT.missionEyebrow,
    missionTitle: DEFAULT_HOME_CONTENT.missionTitle,
    missionTitleAccent: DEFAULT_HOME_CONTENT.missionTitleAccent,
    missionBody: DEFAULT_HOME_CONTENT.missionBody,
    visionEyebrow: DEFAULT_HOME_CONTENT.visionEyebrow,
    visionTitle: DEFAULT_HOME_CONTENT.visionTitle,
    visionTitleAccent: DEFAULT_HOME_CONTENT.visionTitleAccent,
    visionBody: DEFAULT_HOME_CONTENT.visionBody,
    storyEyebrow: DEFAULT_HOME_CONTENT.storyEyebrow,
    storyHeading: DEFAULT_HOME_CONTENT.storyHeading,
    storyParagraph1: DEFAULT_HOME_CONTENT.storyParagraph1,
    storyParagraph2: DEFAULT_HOME_CONTENT.storyParagraph2,
    stat1Value: DEFAULT_HOME_CONTENT.stat1Value,
    stat1Label: DEFAULT_HOME_CONTENT.stat1Label,
    stat2Value: DEFAULT_HOME_CONTENT.stat2Value,
    stat2Label: DEFAULT_HOME_CONTENT.stat2Label,
    stat3Value: DEFAULT_HOME_CONTENT.stat3Value,
    stat3Label: DEFAULT_HOME_CONTENT.stat3Label,
    insideTile1Label: DEFAULT_HOME_CONTENT.insideTile1Label,
    insideTile2Label: DEFAULT_HOME_CONTENT.insideTile2Label,
    insideTile3Label: DEFAULT_HOME_CONTENT.insideTile3Label,
    insideTile4Label: DEFAULT_HOME_CONTENT.insideTile4Label,
    insideTile1Image: DEFAULT_HOME_CONTENT.insideTile1Image,
    insideTile2Image: DEFAULT_HOME_CONTENT.insideTile2Image,
    insideTile3Image: DEFAULT_HOME_CONTENT.insideTile3Image,
    insideTile4Image: DEFAULT_HOME_CONTENT.insideTile4Image,
  };
  await prisma.homeContent.upsert({
    where: { id: "home" },
    update: homeData,
    create: { id: "home", ...homeData },
  });
  console.log("Seeded home content");

  console.log("Seeding membership content...");
  const membershipData = {
    title: DEFAULT_MEMBERSHIP_CONTENT.title,
    subtitle: DEFAULT_MEMBERSHIP_CONTENT.subtitle,
    description: DEFAULT_MEMBERSHIP_CONTENT.description,
    joinTitle: DEFAULT_MEMBERSHIP_CONTENT.joinTitle,
    joinDescription: DEFAULT_MEMBERSHIP_CONTENT.joinDescription,
    joinCtaLabel: DEFAULT_MEMBERSHIP_CONTENT.joinCtaLabel,
    joinCtaHref: DEFAULT_MEMBERSHIP_CONTENT.joinCtaHref,
    benefits: DEFAULT_MEMBERSHIP_CONTENT.benefits as any,
    joinSteps: DEFAULT_MEMBERSHIP_CONTENT.joinSteps as any,
  };
  await prisma.membershipContent.upsert({
    where: { id: "membership" },
    update: membershipData,
    create: { id: "membership", ...membershipData },
  });
  console.log("Seeded membership content");

  console.log("Seeding partnerships content...");
  const partnershipsData = {
    title: DEFAULT_PARTNERSHIPS_CONTENT.title,
    subtitle: DEFAULT_PARTNERSHIPS_CONTENT.subtitle,
    description: DEFAULT_PARTNERSHIPS_CONTENT.description,
    internalPartners: DEFAULT_PARTNERSHIPS_CONTENT.internalPartners as any,
    externalPartners: DEFAULT_PARTNERSHIPS_CONTENT.externalPartners as any,
  };
  await prisma.partnershipsContent.upsert({
    where: { id: "partnerships" },
    update: partnershipsData,
    create: { id: "partnerships", ...partnershipsData },
  });
  console.log("Seeded partnerships content");

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
