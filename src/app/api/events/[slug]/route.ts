import { prisma } from "@/backend/db/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: { select: { registrations: { where: { status: { not: "CANCELLED" } } } } },
      partner: { select: { name: true } },
    },
  });

  if (!event || event.status !== "PUBLISHED") {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  return Response.json({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    category: event.category,
    type: event.type,
    priceKes: event.priceKes,
    capacity: event.capacity,
    spotsRemaining: event.capacity ? event.capacity - event._count.registrations : null,
    startsAt: event.startsAt.toISOString(),
    location: event.location,
    ownerType: event.ownerType,
    partnerName: event.partner?.name ?? null,
  });
}
