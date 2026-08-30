import dotenv from "dotenv";
dotenv.config();

import { PrismaClient, EventType, EventStatus, OwnerType, ProjectStatus } from "@prisma/client";
import { portfolioProjects, legacyProjectSlugs } from "./portfolioProjects";
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
