import type { Metadata } from "next";
import { leagueSpartan, montserrat } from "@/lib/fonts";
import AdminNav from "./AdminNav";

export const metadata: Metadata = {
  title: "SMC Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen bg-teal text-cream font-body antialiased">
        <AdminNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
