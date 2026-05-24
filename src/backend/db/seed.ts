import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");
  console.log("DB URL:", process.env.DATABASE_URL);

  const adminPassword = await bcrypt.hash("password123", 12);
  const memberPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@strathmore.edu" },
    update: {},
    create: {
      name: "SMC Admin",
      email: "admin@strathmore.edu",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@strathmore.edu" },
    update: {},
    create: {
      name: "Jane Muthoni",
      email: "member@strathmore.edu",
      passwordHash: memberPassword,
      role: "MEMBER",
    },
  });

  console.log(`Created users: ${admin.email}, ${member.email}`);

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

  const events = [
    {
      slug: "marketing-week",
      title: "Marketing Week",
      description:
        "A week-long immersion featuring industry panels, brand challenges, and the annual pitch competition.",
      category: "Flagship",
      type: "FREE",
      priceKes: 0,
      capacity: 200,
      startsAt: new Date("2026-09-15T09:00:00"),
      location: "Strathmore Auditorium",
      status: "PUBLISHED",
      ownerType: "INTERNAL",
    },
    {
      slug: "digital-strategy-bootcamp",
      title: "Digital Strategy Bootcamp",
      description:
        "Hands-on sessions covering SEO, social media analytics, paid ads, and content calendars.",
      category: "Workshop",
      type: "FREE",
      priceKes: 0,
      capacity: 40,
      startsAt: new Date("2026-07-12T10:00:00"),
      location: "SBS Computer Lab 3",
      status: "PUBLISHED",
      ownerType: "INTERNAL",
    },
    {
      slug: "agency-nights",
      title: "Agency Nights",
      description:
        "Intimate evenings with agency leaders — hear their stories, ask your questions, make connections.",
      category: "Networking",
      type: "PAID",
      priceKes: 500,
      capacity: 60,
      startsAt: new Date("2026-08-08T18:00:00"),
      location: "Strathmore Rooftop Lounge",
      status: "PUBLISHED",
      ownerType: "PARTNER",
      partnerId: partner.id,
      commissionRate: 0.15,
    },
    {
      slug: "brand-challenge",
      title: "Brand Challenge",
      description:
        "Teams compete to solve a real brand brief. Winners present to the client's marketing team.",
      category: "Competition",
      type: "FREE",
      priceKes: 0,
      capacity: 80,
      startsAt: new Date("2026-10-03T09:00:00"),
      location: "SBS Amphitheatre",
      status: "PUBLISHED",
      ownerType: "INTERNAL",
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
  console.log("\nSeed complete!");
  console.log("Admin login:  admin@strathmore.edu / password123");
  console.log("Member login: member@strathmore.edu / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
