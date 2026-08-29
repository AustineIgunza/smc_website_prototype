"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { ExternalLink } from "@/components/icons";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const dark = theme === "dark";
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (isLogin) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? `backdrop-blur-md shadow-lg py-2 sm:py-3 ${dark ? "bg-cream/95" : "bg-teal/95"}`
          : `py-3 sm:py-5 ${dark ? "bg-cream" : "bg-teal"}`
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Logo variant="full" size={40} onDarkBg={!dark} />
          </Link>
          <span
            className={`font-body text-xs font-semibold tracking-widest uppercase transition-colors ${
              dark ? "text-teal/40" : "text-cream/40"
            }`}
          >
            Admin
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/admin/projects"
            className={`font-body text-xs font-semibold tracking-wide transition-colors ${
              pathname.startsWith("/admin/projects")
                ? "text-amber"
                : dark
                ? "text-teal/70 hover:text-teal"
                : "text-cream/70 hover:text-cream"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/admin/events"
            className={`font-body text-xs font-semibold tracking-wide transition-colors ${
              pathname.startsWith("/admin/events")
                ? "text-amber"
                : dark
                ? "text-teal/70 hover:text-teal"
                : "text-cream/70 hover:text-cream"
            }`}
          >
            Upcoming Events
          </Link>
          <Link
            href="/admin/past-events"
            className={`font-body text-xs font-semibold tracking-wide transition-colors ${
              pathname.startsWith("/admin/past-events")
                ? "text-amber"
                : dark
                ? "text-teal/70 hover:text-teal"
                : "text-cream/70 hover:text-cream"
            }`}
          >
            Past Events
          </Link>
          <Link
            href="/admin/team"
            className={`font-body text-xs font-semibold tracking-wide transition-colors ${
              pathname.startsWith("/admin/team")
                ? "text-amber"
                : dark
                ? "text-teal/70 hover:text-teal"
                : "text-cream/70 hover:text-cream"
            }`}
          >
            Team
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            className={`hidden sm:flex items-center gap-1.5 font-body text-xs font-medium tracking-wide transition-colors ${
              dark ? "text-teal/70 hover:text-teal" : "text-cream/70 hover:text-cream"
            }`}
          >
            <span>View site</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={handleSignOut}
            className="px-5 py-2 rounded-full bg-amber text-teal font-body text-sm font-semibold tracking-wide hover:bg-gold transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
