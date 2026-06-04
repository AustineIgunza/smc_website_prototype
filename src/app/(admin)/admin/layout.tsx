import type { Metadata } from "next";
import { leagueSpartan, montserrat } from "@/lib/fonts";
import AdminNav from "./AdminNav";
import "../../globals.css";

export const metadata: Metadata = {
  title: "SMC Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${leagueSpartan.variable} ${montserrat.variable} min-h-screen font-body antialiased`}
      style={{ background: "var(--color-teal)", color: "var(--color-cream)" }}
    >
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}
