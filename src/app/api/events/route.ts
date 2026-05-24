import { prisma } from "@/backend/db/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startsAt: "asc" },
    include: {
      _count: { select: { registrations: { where: { status: { not: "CANCELLED" } } } } },
    },
  });

  const mapped = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    category: e.category,
    type: e.type,
    priceKes: e.priceKes,
    capacity: e.capacity,
    spotsRemaining: e.capacity ? e.capacity - e._count.registrations : null,
    startsAt: e.startsAt.toISOString(),
    location: e.location,
    ownerType: e.ownerType,
  }));

  return Response.json(mapped);
}
