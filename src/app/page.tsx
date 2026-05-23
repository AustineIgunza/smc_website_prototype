import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      {/* Logo preview — both themes side by side (remove after approval) */}
      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-navy text-2xl font-bold mb-10 text-center">Logo Preview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* On cream/light background */}
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-navy/10 bg-cream p-10">
              <p className="text-navy/60 font-body text-sm uppercase tracking-widest">Light Background</p>
              <Logo variant="full" theme="light" size={110} />
              <Logo variant="mark" theme="light" size={72} />
            </div>
            {/* On teal/dark background */}
            <div className="flex flex-col items-center gap-6 rounded-2xl bg-teal p-10">
              <p className="text-cream/60 font-body text-sm uppercase tracking-widest">Dark Background</p>
              <Logo variant="full" theme="dark" size={110} />
              <Logo variant="mark" theme="dark" size={72} />
            </div>
          </div>
        </div>
      </section>

      <div className="h-screen bg-cream" />
    </>
  );
}
