import type { Metadata } from "next";
import { leagueSpartan, montserrat } from "@/lib/fonts";
import ThemeProvider from "@/components/ThemeProvider";
import AdminLayoutClient from "./AdminLayoutClient";
import "../../globals.css";

export const metadata: Metadata = {
  title: "SMC Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className={`${leagueSpartan.variable} ${montserrat.variable}`}>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </div>
    </ThemeProvider>
  );
}
