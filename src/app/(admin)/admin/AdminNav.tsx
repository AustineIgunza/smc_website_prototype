"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-teal/95 backdrop-blur-md shadow-lg py-2 sm:py-3"
          : "bg-teal py-3 sm:py-5"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Logo variant="full" size={40} onDarkBg={true} />
          </Link>
          <span className="font-body text-cream/40 text-xs font-semibold tracking-widest uppercase">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:block font-body text-sm font-medium tracking-wide text-cream/70 hover:text-cream transition-colors"
          >
            View site
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
