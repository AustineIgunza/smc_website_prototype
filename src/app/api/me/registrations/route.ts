import { auth } from "@/backend/auth/auth";
import { prisma } from "@/backend/db/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    where: { userId: session.user.id, status: { not: "CANCELLED" } },
    include: {
      event: {
        select: { slug: true, title: true, startsAt: true, location: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(registrations);
}
