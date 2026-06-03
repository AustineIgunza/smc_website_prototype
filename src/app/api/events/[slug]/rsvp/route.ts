import type { Prisma } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import { rsvpSchema } from "@/backend/validators/rsvp";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, phone } = parsed.data;
  const guestEmail = parsed.data.email.toLowerCase();
  const guestPhone = phone && phone.length > 0 ? phone : null;

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

  // Dedupe by (eventId, guestEmail)
  const existing = await prisma.registration.findUnique({
    where: { eventId_guestEmail: { eventId: event.id, guestEmail } },
  });

  if (existing && existing.status !== "CANCELLED") {
    return Response.json(
      { error: "This email is already registered for this event." },
      { status: 409 }
    );
  }

  if (event.capacity !== null && event._count.registrations >= event.capacity) {
    return Response.json({ error: "Event is full" }, { status: 409 });
  }

  // Insert (or re-activate a cancelled entry) atomically with a capacity recount
  try {
    const reg = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const count = await tx.registration.count({
        where: { eventId: event.id, status: { not: "CANCELLED" } },
      });

      if (event.capacity !== null && count >= event.capacity) {
        throw new Error("FULL");
      }

      if (existing) {
        return tx.registration.update({
          where: { id: existing.id },
          data: { guestName: name, guestPhone, status: "CONFIRMED" },
        });
      }

      return tx.registration.create({
        data: {
          eventId: event.id,
          guestName: name,
          guestEmail,
          guestPhone,
          status: "CONFIRMED", // Free events go straight to CONFIRMED
        },
      });
    });

    return Response.json(
      { registration: { id: reg.id, eventId: reg.eventId, status: reg.status } },
      { status: existing ? 200 : 201 }
    );
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "FULL") {
      return Response.json({ error: "Event is full" }, { status: 409 });
    }
    throw e;
  }
}
