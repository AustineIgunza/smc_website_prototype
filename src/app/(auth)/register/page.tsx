"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

export default function RegisterPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const prefersReduced = useReducedMotion();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (signInRes?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <section
      className={`min-h-screen flex items-center justify-center pt-20 pb-12 px-4 ${
        dark ? "bg-teal" : "bg-cream"
      }`}
    >
      <motion.div
        className={`w-full max-w-md rounded-2xl p-8 sm:p-10 ${
          dark ? "bg-navy/60 border border-cream/5" : "bg-white shadow-lg"
        }`}
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${
            dark ? "text-cream" : "text-navy"
          }`}
        >
          Join SMC
        </h1>
        <p
          className={`font-body text-sm mb-8 ${
            dark ? "text-cream/50" : "text-navy/50"
          }`}
        >
          Create your account and start exploring
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`block font-body text-xs font-semibold tracking-wide uppercase mb-2 ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-colors ${
                dark
                  ? "bg-teal/50 border border-cream/10 text-cream placeholder:text-cream/25 focus:border-amber/50"
                  : "bg-cream border border-navy/10 text-navy placeholder:text-navy/25 focus:border-amber"
              }`}
              placeholder="Jane Muthoni"
            />
          </div>

          <div>
            <label
              className={`block font-body text-xs font-semibold tracking-wide uppercase mb-2 ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-colors ${
                dark
                  ? "bg-teal/50 border border-cream/10 text-cream placeholder:text-cream/25 focus:border-amber/50"
                  : "bg-cream border border-navy/10 text-navy placeholder:text-navy/25 focus:border-amber"
              }`}
              placeholder="you@strathmore.edu"
            />
          </div>

          <div>
            <label
              className={`block font-body text-xs font-semibold tracking-wide uppercase mb-2 ${
                dark ? "text-cream/40" : "text-navy/40"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={`w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-colors ${
                dark
                  ? "bg-teal/50 border border-cream/10 text-cream placeholder:text-cream/25 focus:border-amber/50"
                  : "bg-cream border border-navy/10 text-navy placeholder:text-navy/25 focus:border-amber"
              }`}
              placeholder="Min 8 characters"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 rounded-full bg-amber text-teal font-body text-sm font-semibold tracking-wide hover:bg-gold transition-colors disabled:opacity-50 cursor-pointer"
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <p
          className={`font-body text-sm text-center mt-6 ${
            dark ? "text-cream/40" : "text-navy/40"
          }`}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber hover:text-gold font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
