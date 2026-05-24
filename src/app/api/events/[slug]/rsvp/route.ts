import { auth } from "@/backend/auth/auth";
import { prisma } from "@/backend/db/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: { select: { registrations: { where: { status: { not: "CANCELLED" } } } } },
    },
  });

  if (!event || event.status !== "PUBLISHED") {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.type !== "FREE") {
    return Response.json({ error: "This is a paid event. Use the payment flow." }, { status: 400 });
  }

  // Check if already registered
  const existing = await prisma.registration.findUnique({
    where: { userId_eventId: { userId: session.user.id, eventId: event.id } },
  });

  if (existing && existing.status !== "CANCELLED") {
    return Response.json({ error: "Already registered" }, { status: 409 });
  }

  // Check capacity atomically — count active registrations and only insert if under capacity
  if (event.capacity !== null) {
    const activeCount = event._count.registrations;
    if (activeCount >= event.capacity) {
      return Response.json({ error: "Event is full" }, { status: 409 });
    }
  }

  // Create or re-activate registration
  if (existing && existing.status === "CANCELLED") {
    // Re-check capacity before reactivating
    const freshCount = await prisma.registration.count({
      where: { eventId: event.id, status: { not: "CANCELLED" } },
    });
    if (event.capacity !== null && freshCount >= event.capacity) {
      return Response.json({ error: "Event is full" }, { status: 409 });
    }

    const reg = await prisma.registration.update({
      where: { id: existing.id },
      data: { status: "CONFIRMED" },
    });
    return Response.json({ registration: reg }, { status: 200 });
  }

  // Fresh registration — use a transaction for atomicity
  try {
    const reg = await prisma.$transaction(async (tx) => {
      // Re-count inside transaction
      const count = await tx.registration.count({
        where: { eventId: event.id, status: { not: "CANCELLED" } },
      });

      if (event.capacity !== null && count >= event.capacity) {
        throw new Error("FULL");
      }

      return tx.registration.create({
        data: {
          userId: session.user.id,
          eventId: event.id,
          status: "CONFIRMED", // Free events go straight to CONFIRMED
        },
      });
    });

    return Response.json({ registration: reg }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "FULL") {
      return Response.json({ error: "Event is full" }, { status: 409 });
    }
    throw e;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  const reg = await prisma.registration.findUnique({
    where: { userId_eventId: { userId: session.user.id, eventId: event.id } },
  });

  if (!reg || reg.status === "CANCELLED") {
    return Response.json({ error: "No active registration found" }, { status: 404 });
  }

  const updated = await prisma.registration.update({
    where: { id: reg.id },
    data: { status: "CANCELLED" },
  });

  return Response.json({ registration: updated });
}
