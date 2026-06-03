"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (isLogin) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-teal/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-amber text-lg leading-none">SMC</span>
            <span className="font-body text-cream/40 text-xs font-semibold tracking-widest uppercase mt-0.5">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/portfolio"
            target="_blank"
            className="font-body text-xs text-cream/40 hover:text-cream/70 transition-colors hidden sm:block"
          >
            View site ↗
          </Link>
          <button
            onClick={handleSignOut}
            className="font-body text-xs font-semibold px-3 py-1.5 rounded-lg border border-cream/15 text-cream/50 hover:border-cream/30 hover:text-cream/80 transition-colors"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
