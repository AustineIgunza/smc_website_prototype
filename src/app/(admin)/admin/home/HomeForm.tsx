"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { HomeContent } from "@/data/home-defaults";

const INPUT =
  "w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors";
const TEXTAREA = INPUT + " resize-y min-h-[100px]";
const LABEL =
  "block font-body text-xs font-semibold text-cream/40 uppercase tracking-widest mb-1.5";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-navy/60 border border-cream/10 p-6 space-y-5">
      <div>
        <h2 className="font-display font-bold text-cream/80 text-sm uppercase tracking-widest">
          {title}
        </h2>
        {description && (
          <p className="font-body text-cream/40 text-xs mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
    </div>
  );
}

export default function HomeForm({ initial }: { initial: HomeContent }) {
  const router = useRouter();
  const [form, setForm] = useState<HomeContent>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set<K extends keyof HomeContent>(key: K, value: HomeContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (success) setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/home-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        const fieldErrors = json.error?.fieldErrors;
        if (fieldErrors) {
          const first = Object.values(fieldErrors).flat()[0];
          if (first) {
            setError(String(first));
            return;
          }
        }
        setError(json.error ?? "Failed to save");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Hero" description="The big landing block at the top of the homepage.">
        <Field label="Eyebrow (small label above the title)">
          <input className={INPUT} value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Title line 1">
            <input className={INPUT} value={form.heroTitleLine1} onChange={(e) => set("heroTitleLine1", e.target.value)} />
          </Field>
          <Field label="Title line 2">
            <input className={INPUT} value={form.heroTitleLine2} onChange={(e) => set("heroTitleLine2", e.target.value)} />
          </Field>
          <Field label="Title accent (highlighted)">
            <input className={INPUT} value={form.heroTitleAccent} onChange={(e) => set("heroTitleAccent", e.target.value)} />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea className={TEXTAREA} value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Primary button label">
            <input className={INPUT} value={form.heroPrimaryCtaLabel} onChange={(e) => set("heroPrimaryCtaLabel", e.target.value)} />
          </Field>
          <Field label="Primary button link">
            <input className={INPUT} value={form.heroPrimaryCtaHref} onChange={(e) => set("heroPrimaryCtaHref", e.target.value)} placeholder="/membership" />
          </Field>
          <Field label="Secondary button label">
            <input className={INPUT} value={form.heroSecondaryCtaLabel} onChange={(e) => set("heroSecondaryCtaLabel", e.target.value)} />
          </Field>
          <Field label="Secondary button link">
            <input className={INPUT} value={form.heroSecondaryCtaHref} onChange={(e) => set("heroSecondaryCtaHref", e.target.value)} placeholder="/portfolio" />
          </Field>
        </div>
      </Section>

      <Section title="Mission">
        <Field label="Eyebrow">
          <input className={INPUT} value={form.missionEyebrow} onChange={(e) => set("missionEyebrow", e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title">
            <input className={INPUT} value={form.missionTitle} onChange={(e) => set("missionTitle", e.target.value)} />
          </Field>
          <Field label="Title accent (highlighted)">
            <input className={INPUT} value={form.missionTitleAccent} onChange={(e) => set("missionTitleAccent", e.target.value)} />
          </Field>
        </div>
        <Field label="Body">
          <textarea className={TEXTAREA} value={form.missionBody} onChange={(e) => set("missionBody", e.target.value)} />
        </Field>
      </Section>

      <Section title="Vision">
        <Field label="Eyebrow">
          <input className={INPUT} value={form.visionEyebrow} onChange={(e) => set("visionEyebrow", e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title">
            <input className={INPUT} value={form.visionTitle} onChange={(e) => set("visionTitle", e.target.value)} />
          </Field>
          <Field label="Title accent (highlighted)">
            <input className={INPUT} value={form.visionTitleAccent} onChange={(e) => set("visionTitleAccent", e.target.value)} />
          </Field>
        </div>
        <Field label="Body">
          <textarea className={TEXTAREA} value={form.visionBody} onChange={(e) => set("visionBody", e.target.value)} />
        </Field>
      </Section>

      <Section title="Our Story">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input className={INPUT} value={form.storyEyebrow} onChange={(e) => set("storyEyebrow", e.target.value)} />
          </Field>
          <Field label="Heading">
            <input className={INPUT} value={form.storyHeading} onChange={(e) => set("storyHeading", e.target.value)} />
          </Field>
        </div>
        <Field label="Paragraph 1">
          <textarea className={TEXTAREA} value={form.storyParagraph1} onChange={(e) => set("storyParagraph1", e.target.value)} />
        </Field>
        <Field label="Paragraph 2">
          <textarea className={TEXTAREA} value={form.storyParagraph2} onChange={(e) => set("storyParagraph2", e.target.value)} />
        </Field>
      </Section>

      <Section title="Stats" description="The three numbers shown next to the Our Story section.">
        <div className="grid sm:grid-cols-[100px_1fr] gap-4 items-end">
          <Field label="Number 1">
            <input className={INPUT} type="number" min={0} value={form.stat1Value} onChange={(e) => set("stat1Value", Number(e.target.value))} />
          </Field>
          <Field label="Label 1">
            <input className={INPUT} value={form.stat1Label} onChange={(e) => set("stat1Label", e.target.value)} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-[100px_1fr] gap-4 items-end">
          <Field label="Number 2">
            <input className={INPUT} type="number" min={0} value={form.stat2Value} onChange={(e) => set("stat2Value", Number(e.target.value))} />
          </Field>
          <Field label="Label 2">
            <input className={INPUT} value={form.stat2Label} onChange={(e) => set("stat2Label", e.target.value)} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-[100px_1fr] gap-4 items-end">
          <Field label="Number 3 (featured)">
            <input className={INPUT} type="number" min={0} value={form.stat3Value} onChange={(e) => set("stat3Value", Number(e.target.value))} />
          </Field>
          <Field label="Label 3 (featured)">
            <input className={INPUT} value={form.stat3Label} onChange={(e) => set("stat3Label", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Inside the Agency">
        <Field label="Eyebrow">
          <input className={INPUT} value={form.insideEyebrow} onChange={(e) => set("insideEyebrow", e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title (start)">
            <input className={INPUT} value={form.insideTitleStart} onChange={(e) => set("insideTitleStart", e.target.value)} />
          </Field>
          <Field label="Title accent (highlighted)">
            <input className={INPUT} value={form.insideTitleAccent} onChange={(e) => set("insideTitleAccent", e.target.value)} />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea className={TEXTAREA} value={form.insideSubtitle} onChange={(e) => set("insideSubtitle", e.target.value)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tile 1 label">
            <input className={INPUT} value={form.insideTile1Label} onChange={(e) => set("insideTile1Label", e.target.value)} />
          </Field>
          <Field label="Tile 2 label">
            <input className={INPUT} value={form.insideTile2Label} onChange={(e) => set("insideTile2Label", e.target.value)} />
          </Field>
          <Field label="Tile 3 label">
            <input className={INPUT} value={form.insideTile3Label} onChange={(e) => set("insideTile3Label", e.target.value)} />
          </Field>
          <Field label="Tile 4 label">
            <input className={INPUT} value={form.insideTile4Label} onChange={(e) => set("insideTile4Label", e.target.value)} />
          </Field>
        </div>
      </Section>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 font-body text-sm text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 font-body text-sm text-green-200">
          Saved. The homepage now reflects your changes.
        </div>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full bg-amber text-teal font-body font-bold text-sm tracking-wide hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "Saving…" : "Save Homepage"}
        </button>
      </div>
    </form>
  );
}
