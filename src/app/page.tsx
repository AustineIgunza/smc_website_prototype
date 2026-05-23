import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import Events from "@/components/Events";
import Portfolio from "@/components/Portfolio";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Membership />
      <Events />
      <Portfolio />
      <Team />
      <Footer />
    </>
  );
}
