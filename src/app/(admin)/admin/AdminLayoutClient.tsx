"use client";

import { useTheme } from "@/components/ThemeProvider";
import AnimatedBg from "@/components/ui/AnimatedBg";
import AdminNav from "./AdminNav";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div
      className={`min-h-screen font-body antialiased relative overflow-hidden transition-colors duration-300 ${
        dark ? "bg-teal text-cream" : "bg-cream text-navy"
      }`}
    >
      <AnimatedBg variant="circles" surface={dark ? "teal" : "cream"} />
      <AdminNav />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
