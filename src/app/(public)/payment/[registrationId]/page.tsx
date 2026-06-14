"use client";

import { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import AnimatedBg from "@/components/ui/AnimatedBg";
import { useTheme } from "@/components/ThemeProvider";

interface StatusData {
  registrationId: string;
  registrationStatus: string;
  guestName: string;
  guestEmail: string;
  event: {
    title: string;
    location: string;
    startsAt: string;
  };
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "NOT_FOUND";
  amountKes: number;
  mpesaReceiptNumber: string | null;
  checkoutRequestId?: string;
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = use(params);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Poll status from the API
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/${registrationId}/status`);
      if (!res.ok) {
        throw new Error("Failed to fetch payment status");
      }
      const data = await res.json();
      setStatus(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  }, [registrationId]);

  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );

    fetchStatus();

    // Set up polling interval (every 3 seconds)
    const interval = setInterval(() => {
      fetchStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Clean helper to trigger mock callback
  const simulateCallback = async (success: boolean) => {
    if (!status) return;
    setSimulating(true);
    setSimError(null);

    // Find the checkoutRequestId (from status payload or create one if mock)
    // In our pay endpoint, we always save it.
    // If not loaded, we request it or guess it.
    let checkoutRequestId = status.checkoutRequestId;
    if (!checkoutRequestId) {
      // Fetch details from local status endpoint (we can read it or query again)
      // Normally we save it to db, so we can mock call directly.
      // Wait, let's fetch the payment details from status endpoint or just request.
      try {
        const payRes = await fetch(`/api/payments/${registrationId}/status`);
        const payData = await payRes.json();
        // Since database contains it, let's retrieve or fetch
        // We will fetch from database directly
        // Or wait, let's get it by fetching status.
      } catch {}
    }

    try {
      // Find the checkoutRequestId from the DB by status polling first
      const res = await fetch(`/api/payments/${registrationId}/status`);
      const data = await res.json();

      const mockBody = {
        Body: {
          stkCallback: {
            MerchantRequestID: "MOCK-MERCHANT-ID",
            CheckoutRequestID: data.checkoutRequestId || `MOCK-${registrationId}`,
            ResultCode: success ? 0 : 1032,
            ResultDesc: success
              ? "The service request is processed successfully."
              : "Request cancelled by user.",
            CallbackMetadata: success
              ? {
                  Item: [
                    { Name: "Amount", Value: status.amountKes },
                    { Name: "MpesaReceiptNumber", Value: "MOCK" + Math.random().toString(36).substring(2, 8).toUpperCase() },
                    { Name: "TransactionDate", Value: parseInt(new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)) },
                    { Name: "PhoneNumber", Value: 254759257761 },
                  ],
                }
              : null,
          },
        },
      };

      const callbackRes = await fetch("/api/payments/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockBody),
      });

      if (!callbackRes.ok) {
        throw new Error("Failed to deliver simulated callback");
      }

      // Refresh status instantly
      await fetchStatus();
    } catch (err: any) {
      setSimError(err.message || "Simulated callback failed");
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-teal" : "bg-cream"}`}>
        <p className={`font-body ${dark ? "text-cream/40" : "text-navy/40"}`}>Loading transaction details...</p>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${dark ? "bg-teal" : "bg-cream"}`}>
        <p className="font-display font-bold text-lg text-red-400">Error: {error || "Transaction not found"}</p>
        <Link href="/events" className="px-5 py-2 rounded-full bg-amber text-teal font-body font-bold text-sm">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className={`relative min-h-screen overflow-hidden pt-28 pb-16 ${dark ? "bg-teal" : "bg-cream"}`}>
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />

      <div className="relative z-10 max-w-md mx-auto px-4">
        <Reveal y={20}>
          {/* Card Header */}
          <div className="text-center mb-8">
            <p className="font-body text-xs font-semibold tracking-widest text-amber uppercase mb-1">
              Event Checkout
            </p>
            <h1 className={`font-display text-2xl font-bold ${dark ? "text-cream" : "text-navy"}`}>
              Payment Billing
            </h1>
          </div>

          {/* Billing card */}
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${
            dark ? "bg-navy/70 border-cream/10 text-cream" : "bg-white border-navy/5 text-navy"
          }`}>
            {/* Event Info */}
            <div className="pb-5 border-b border-cream/10 dark:border-navy/5 flex flex-col items-center text-center">
              <h2 className={`font-display text-lg font-bold ${dark ? "text-cream" : "text-navy"}`}>
                {status.event.title}
              </h2>
              <p className={`font-body text-xs mt-1.5 ${dark ? "text-cream/40" : "text-navy/50"}`}>
                📅 {new Date(status.event.startsAt).toLocaleDateString("en-KE", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className={`font-body text-xs mt-0.5 ${dark ? "text-cream/40" : "text-navy/50"}`}>
                📍 {status.event.location}
              </p>
            </div>

            {/* Payer Info */}
            <div className="py-5 border-b border-cream/10 dark:border-navy/5 space-y-2.5 font-body text-sm">
              <div className="flex justify-between">
                <span className="opacity-40">Attendee</span>
                <span className="font-semibold">{status.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">Email</span>
                <span className="font-semibold truncate max-w-[200px]">{status.guestEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">Amount Due</span>
                <span className="font-semibold text-amber">KES {status.amountKes.toLocaleString()}</span>
              </div>
            </div>

            {/* Status section */}
            <div className="pt-6 text-center">
              {status.paymentStatus === "PENDING" && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className={`font-display font-bold text-sm ${dark ? "text-cream" : "text-navy"}`}>
                      Waiting for payment confirmation
                    </p>
                    <p className={`font-body text-xs leading-relaxed max-w-xs mx-auto ${dark ? "text-cream/50" : "text-navy/55"}`}>
                      An M-Pesa STK push has been sent to your phone. Please check your screen, enter your PIN, and the page will refresh automatically.
                    </p>
                  </div>
                </div>
              )}

              {status.paymentStatus === "SUCCESS" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto border-2 border-green-500/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-display font-bold text-green-400 text-base">
                      Payment Confirmed!
                    </p>
                    <p className={`font-body text-xs ${dark ? "text-cream/60" : "text-navy/60"}`}>
                      You are successfully registered for the event.
                    </p>
                    {status.mpesaReceiptNumber && (
                      <p className={`font-body text-[10px] tracking-wider uppercase font-semibold mt-2 px-2.5 py-1 rounded bg-green-500/5 text-green-400 border border-green-500/10 inline-block`}>
                        Receipt: {status.mpesaReceiptNumber}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/events"
                    className="inline-block px-5 py-2.5 rounded-full bg-amber text-teal font-body font-bold text-xs tracking-wider uppercase hover:bg-gold transition-colors"
                  >
                    Back to Events
                  </Link>
                </div>
              )}

              {status.paymentStatus === "FAILED" && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border-2 border-red-500/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-bold text-red-400 text-sm">
                      Transaction Failed
                    </p>
                    <p className={`font-body text-xs leading-relaxed max-w-xs mx-auto ${dark ? "text-cream/50" : "text-navy/55"}`}>
                      The payment request was cancelled, timed out, or rejected by Safaricom.
                    </p>
                  </div>
                  <Link
                    href="/events"
                    className="inline-block px-5 py-2.5 rounded-full border border-cream/15 text-cream/40 font-body font-semibold text-xs tracking-wider uppercase hover:border-cream/30 hover:text-cream/60 transition-colors"
                  >
                    Try again
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Local Developer Sandbox Mock Panel */}
          {isLocalhost && (
            <div className={`mt-6 rounded-2xl border-2 border-dashed p-5 text-center ${
              dark ? "bg-amber/5 border-amber/20 text-cream" : "bg-gold/5 border-gold/20 text-navy"
            }`}>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <span className="text-amber">🛠️</span>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-amber">
                  Developer Testing Tools
                </h3>
              </div>
              <p className="font-body text-[10px] opacity-50 mb-4 leading-relaxed max-w-xs mx-auto">
                Simulate Safaricom callback requests locally to test payment states offline.
              </p>

              {status.paymentStatus === "PENDING" ? (
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => simulateCallback(true)}
                    disabled={simulating}
                    className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white font-body text-[10px] font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
                  >
                    {simulating ? "Sending..." : "Simulate Success"}
                  </button>
                  <button
                    onClick={() => simulateCallback(false)}
                    disabled={simulating}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-body text-[10px] font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
                  >
                    {simulating ? "Sending..." : "Simulate Failure"}
                  </button>
                </div>
              ) : (
                <p className="font-body text-[10px] text-amber font-semibold">
                  Payment has left PENDING state ({status.paymentStatus})
                </p>
              )}

              {simError && (
                <p className="font-body text-red-400 text-[10px] mt-2">{simError}</p>
              )}
            </div>
          )}
        </Reveal>
      </div>
    </main>
  );
}
