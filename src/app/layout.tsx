import type { Metadata } from "next";
import { leagueSpartan, montserrat, rozhaOne } from "@/lib/fonts";
import LenisProvider from "@/components/ui/LenisProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strathmore Marketing Club — The Agency",
  description:
    "The premier launchpad for the next generation of marketing talent at Strathmore University, Kenya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${montserrat.variable} ${rozhaOne.variable} antialiased`}
    >
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
