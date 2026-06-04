import LenisProvider from "@/components/ui/LenisProvider";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LenisProvider>
        <Navbar />
        {children}
        <Footer />
      </LenisProvider>
    </ThemeProvider>
  );
}
