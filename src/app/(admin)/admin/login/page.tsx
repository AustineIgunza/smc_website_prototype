"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Subtle diagonal background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
        aria-hidden="true"
      >
        {Array.from({ length: 40 }, (_, i) => (
          <line
            key={i}
            x1={(i - 10) * 40}
            y1="0"
            x2={(i - 10) * 40 + 1200}
            y2="1200"
            stroke="#F3F2EA"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-display text-4xl font-bold text-amber mb-1">SMC</p>
          <p className="font-body text-cream/40 text-xs tracking-widest uppercase font-semibold">
            Admin Portal
          </p>
        </div>

        <div className="bg-navy/60 border border-cream/10 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="font-display text-xl font-bold text-cream mb-1">Welcome back</h1>
          <p className="font-body text-cream/40 text-sm mb-7">
            Sign in to manage portfolio projects.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-xs font-semibold text-cream/40 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-semibold text-cream/40 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors"
              />
            </div>

            {error && (
              <p className="font-body text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
