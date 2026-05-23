"use client";

import Logo from "./Logo";
import Reveal from "./ui/Reveal";

export default function About() {
  return (
    <section id="about" className="py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="flex items-center justify-center">
              <Logo variant="full" theme="light" size={160} />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="font-accent text-amber text-sm tracking-widest uppercase mb-4">
              Who We Are
            </p>
            <h2 className="font-display text-navy text-4xl md:text-5xl font-bold leading-tight mb-6">
              Where Bold Ideas
              <br />
              Meet <span className="text-amber">Real Campaigns</span>
            </h2>
            <p className="font-body text-navy/70 text-lg leading-relaxed mb-6">
              The Strathmore Marketing Club is the premier student-run marketing
              organization at Strathmore University. We bridge the gap between
              classroom theory and industry practice — giving members hands-on
              experience in branding, digital strategy, content creation, and
              campaign execution.
            </p>
            <p className="font-body text-navy/70 text-lg leading-relaxed">
              Whether you&apos;re a first-year exploring marketing or a
              final-year sharpening your portfolio, SMC is where you grow from
              student to strategist.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
