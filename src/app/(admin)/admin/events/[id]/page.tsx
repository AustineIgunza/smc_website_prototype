import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditEventClient from "./EditEventClient";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const { data: event } = await supabase
    .from("Event")
    .select("*, Registration(*, payment:Payment(id, status, amountKes, mpesaReceiptNumber, phone, updatedAt))")
    .eq("id", id)
    .single();

  if (!event) notFound();

  const { data: partnersData } = await supabase
    .from("Partner")
    .select("id, name")
    .order("name", { ascending: true });
  const partners = partnersData || [];

  const registrations = (event as any).Registration || [];
  const sortedRegs = [...registrations].sort((a: any, b: any) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-cream/10">
        <Link
          href="/admin/events"
          className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors"
        >
          ← Club Events
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="font-accent text-amber text-3xl sm:text-4xl font-bold tracking-wide">Edit Event</h1>
          <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full bg-amber/15 text-amber">
            {event.category}
          </span>
        </div>
        <p className="font-body text-cream/25 text-xs mt-1.5">
          {event.title} · {event.location}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-3">
          <EditEventClient event={event as any} partners={partners} />
        </div>

        {/* Attendees Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-navy/60 border border-cream/10 p-6 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-cream/5">
              <h2 className="font-display font-bold text-cream/80 text-sm uppercase tracking-widest">
                Attendee Registry
              </h2>
              <span className="font-body text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber/10 text-amber">
                {sortedRegs.filter((r: any) => r.status !== "CANCELLED").length} / {event.capacity ?? "∞"}
              </span>
            </div>

            {sortedRegs.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-body text-cream/30 text-xs">No registrations yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {sortedRegs.map((reg: any) => {
                  const initials = reg.guestName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  
                  const isConfirmed = reg.status === "CONFIRMED";
                  const isCancelled = reg.status === "CANCELLED";
                  const isReserved = reg.status === "RESERVED";
                  const pay = reg.payment;
                  
                  return (
                    <div
                      key={reg.id}
                      className="p-3.5 rounded-xl bg-navy/40 border border-cream/5 space-y-2.5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-cream/5 border border-cream/10 flex items-center justify-center text-cream/70 font-display font-bold text-xs shrink-0 select-none">
                          {initials}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-cream text-xs truncate">
                            {reg.guestName}
                          </p>
                          <p className="font-body text-[10px] text-cream/40 truncate">
                            {reg.guestEmail}
                          </p>
                          {reg.guestPhone && (
                            <p className="font-body text-[10px] text-cream/30 mt-0.5">
                              📞 {reg.guestPhone}
                            </p>
                          )}
                        </div>

                        <span
                          className={`font-body text-[9px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
                            isConfirmed
                              ? "text-green-400 bg-green-500/5 border-green-500/10"
                              : isCancelled
                                ? "text-red-400 bg-red-500/5 border-red-500/10"
                                : "text-amber bg-amber/5 border-amber/10"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>

                      {event.type === "PAID" && (
                        <div className="pt-2 border-t border-cream/5 flex flex-col gap-1 text-[9px] font-body text-cream/45">
                          {pay ? (
                            <>
                              <div className="flex justify-between items-center">
                                <span>Payment Status:</span>
                                <span className={`font-semibold uppercase ${
                                  pay.status === "SUCCESS"
                                    ? "text-green-400"
                                    : pay.status === "PENDING"
                                      ? "text-amber"
                                      : "text-red-400"
                                }`}>
                                  {pay.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-cream/35">
                                <span>Amount:</span>
                                <span>KES {pay.amountKes.toLocaleString()}</span>
                              </div>
                              {pay.mpesaReceiptNumber && (
                                <div className="flex justify-between items-center text-cream/35">
                                  <span>Receipt:</span>
                                  <span className="font-semibold text-cream/60">{pay.mpesaReceiptNumber}</span>
                                </div>
                              )}
                              {pay.phone && (
                                <div className="flex justify-between items-center text-cream/35">
                                  <span>M-Pesa No:</span>
                                  <span>{pay.phone}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-red-400/80 italic font-semibold">
                              ⚠️ No payment session found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
