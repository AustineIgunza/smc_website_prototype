"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { MembershipContent, Benefit, JoinStep } from "@/data/membership-defaults";

const INPUT =
  "w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors disabled:opacity-50";
const TEXTAREA = INPUT + " resize-y min-h-[100px]";
const SELECT =
  "w-full px-4 py-2.5 rounded-lg bg-teal border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber transition-colors";
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

const AVAILABLE_ICONS = [
  { value: "target", label: "Target" },
  { value: "brain", label: "Brain" },
  { value: "handshake", label: "Handshake" },
  { value: "trophy", label: "Trophy" },
  { value: "chart", label: "Chart" },
  { value: "palette", label: "Palette" },
  { value: "heart", label: "Heart" },
  { value: "users", label: "Users" },
  { value: "briefcase", label: "Briefcase" },
  { value: "award", label: "Award" },
  { value: "sparkles", label: "Sparkles" },
];

export default function MembershipForm({ initial }: { initial: MembershipContent }) {
  const router = useRouter();
  const [form, setForm] = useState<MembershipContent>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "benefits" | "steps">("general");

  const [uploadingSteps, setUploadingSteps] = useState<Record<number, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<number, string | null>>({});

  async function handleUploadScreenshot(idx: number, file: File) {
    setUploadingSteps(prev => ({ ...prev, [idx]: true }));
    setUploadErrors(prev => ({ ...prev, [idx]: null }));

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/membership-content/screenshot", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadErrors(prev => ({ ...prev, [idx]: data.error || "Upload failed" }));
        return;
      }
      
      updateStep(idx, { screenshotUrl: data.url });
    } catch {
      setUploadErrors(prev => ({ ...prev, [idx]: "Upload failed. Please try again." }));
    } finally {
      setUploadingSteps(prev => ({ ...prev, [idx]: false }));
    }
  }

  function updateField<K extends keyof MembershipContent>(key: K, value: MembershipContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (success) setSuccess(false);
  }

  // Benefits handlers
  function updateBenefit(index: number, updated: Partial<Benefit>) {
    const next = [...form.benefits];
    next[index] = { ...next[index], ...updated };
    updateField("benefits", next);
  }

  function addBenefit() {
    const newBenefit: Benefit = {
      id: `new-benefit-${Date.now()}`,
      icon: "target",
      title: "New Benefit",
      desc: "Benefit description.",
    };
    updateField("benefits", [...form.benefits, newBenefit]);
  }

  function removeBenefit(index: number) {
    const next = form.benefits.filter((_, i) => i !== index);
    updateField("benefits", next);
  }

  function moveBenefit(index: number, direction: "up" | "down") {
    const next = [...form.benefits];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    updateField("benefits", next);
  }

  // Steps handlers
  function updateStep(index: number, updated: Partial<JoinStep>) {
    const next = [...form.joinSteps];
    next[index] = { ...next[index], ...updated };
    updateField("joinSteps", next);
  }

  function addStep() {
    const num = String(form.joinSteps.length + 1).padStart(2, "0");
    const newStep: JoinStep = {
      num,
      title: `Step ${num}`,
      desc: "Instructions for this step.",
      screenshotUrl: null,
    };
    updateField("joinSteps", [...form.joinSteps, newStep]);
  }

  function removeStep(index: number) {
    const next = form.joinSteps.filter((_, i) => i !== index);
    const resequenced = next.map((step, idx) => ({
      ...step,
      num: String(idx + 1).padStart(2, "0"),
    }));
    updateField("joinSteps", resequenced);
  }

  function moveStep(index: number, direction: "up" | "down") {
    const next = [...form.joinSteps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    const resequenced = next.map((step, idx) => ({
      ...step,
      num: String(idx + 1).padStart(2, "0"),
    }));
    updateField("joinSteps", resequenced);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/membership-content", {
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
        setError(json.error ?? "Failed to save content");
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
      {/* Tabs navigation */}
      <div className="flex border-b border-cream/10 gap-2 mb-4">
        {(["general", "benefits", "steps"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-display text-sm font-semibold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === tab
                ? "border-amber text-amber"
                : "border-transparent text-cream/40 hover:text-cream/60"
            }`}
          >
            {tab === "general" ? "General & Onboarding" : tab === "benefits" ? "Member Benefits" : "Onboarding Steps"}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="space-y-6">
          <Section title="Page Headers" description="Main headings displayed at the top of the Membership page.">
            <Field label="Hero Title">
              <input
                className={INPUT}
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </Field>
            <Field label="Subtitle">
              <input
                className={INPUT}
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                required
              />
            </Field>
            <Field label="Description">
              <textarea
                className={TEXTAREA}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
              />
            </Field>
          </Section>

          <Section title="Onboarding Section Copy" description="The 'How to Join' banner copy.">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Section Header Title">
                <input
                  className={INPUT}
                  value={form.joinTitle}
                  onChange={(e) => updateField("joinTitle", e.target.value)}
                  required
                />
              </Field>
              <Field label="CTA Button Label">
                <input
                  className={INPUT}
                  value={form.joinCtaLabel}
                  onChange={(e) => updateField("joinCtaLabel", e.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label="CTA Button URL Link">
              <input
                className={INPUT}
                type="url"
                value={form.joinCtaHref}
                onChange={(e) => updateField("joinCtaHref", e.target.value)}
                required
              />
            </Field>
            <Field label="Section Body Copy">
              <textarea
                className={TEXTAREA}
                value={form.joinDescription}
                onChange={(e) => updateField("joinDescription", e.target.value)}
                required
              />
            </Field>
          </Section>
        </div>
      )}

      {activeTab === "benefits" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="font-body text-xs text-cream/40 uppercase tracking-wider font-semibold">
              Manage benefits cards ({form.benefits.length} items)
            </p>
            <button
              type="button"
              onClick={addBenefit}
              className="px-4 py-2 rounded-lg bg-amber/15 border border-amber/30 text-amber font-body text-xs font-bold hover:bg-amber/25 transition-all"
            >
              + Add Benefit
            </button>
          </div>

          <div className="space-y-6">
            {form.benefits.map((b, idx) => (
              <div
                key={b.id}
                className="relative rounded-2xl bg-navy/60 border border-cream/10 p-6 space-y-4 hover:border-cream/20 transition-all"
              >
                {/* Control buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveBenefit(idx, "up")}
                    className="w-8 h-8 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === form.benefits.length - 1}
                    onClick={() => moveBenefit(idx, "down")}
                    className="w-8 h-8 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBenefit(idx)}
                    className="w-8 h-8 rounded bg-red-950/20 border border-red-800/40 text-red-400/80 flex items-center justify-center hover:bg-red-900/30 hover:border-red-700 transition-all font-semibold"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-display font-bold text-amber text-xs uppercase tracking-widest pb-1 border-b border-cream/5 pr-28">
                  Benefit Item #{idx + 1}
                </h3>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="System ID (slug)">
                    <input
                      className={INPUT}
                      value={b.id}
                      onChange={(e) => updateBenefit(idx, { id: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Benefit Title (Header)">
                    <input
                      className={INPUT}
                      value={b.title}
                      onChange={(e) => updateBenefit(idx, { title: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Visual Icon">
                    <select
                      className={SELECT}
                      value={b.icon}
                      onChange={(e) => updateBenefit(idx, { icon: e.target.value })}
                    >
                      {AVAILABLE_ICONS.map((i) => (
                        <option key={i.value} value={i.value}>{i.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div>
                  <Field label="Description">
                    <textarea
                      className={TEXTAREA}
                      value={b.desc}
                      onChange={(e) => updateBenefit(idx, { desc: e.target.value })}
                      required
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "steps" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="font-body text-xs text-cream/40 uppercase tracking-wider font-semibold">
              Manage onboarding steps ({form.joinSteps.length} items)
            </p>
            <button
              type="button"
              onClick={addStep}
              className="px-4 py-2 rounded-lg bg-amber/15 border border-amber/30 text-amber font-body text-xs font-bold hover:bg-amber/25 transition-all"
            >
              + Add Step
            </button>
          </div>

          <div className="space-y-6">
            {form.joinSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-xl bg-navy/40 border border-cream/10 p-5 space-y-4 hover:border-cream/20 transition-all"
              >
                {/* Control buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveStep(idx, "up")}
                    className="w-8 h-8 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === form.joinSteps.length - 1}
                    onClick={() => moveStep(idx, "down")}
                    className="w-8 h-8 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    disabled={form.joinSteps.length <= 1}
                    onClick={() => removeStep(idx)}
                    className="w-8 h-8 rounded bg-red-950/20 border border-red-800/40 text-red-400/80 flex items-center justify-center hover:bg-red-900/30 hover:border-red-700 transition-all font-semibold disabled:opacity-30 disabled:pointer-events-none"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-display font-bold text-amber text-xs uppercase tracking-widest border-b border-cream/5 pb-1 pr-28">
                  Step {step.num} Details
                </h3>
                <div className="grid sm:grid-cols-[100px_1fr] gap-4">
                    <Field label="Step Index">
                      <input
                        className={INPUT}
                        value={step.num}
                        onChange={(e) => updateStep(idx, { num: e.target.value })}
                        required
                      />
                    </Field>
                    <Field label="Step Title">
                      <input
                        className={INPUT}
                        value={step.title}
                        onChange={(e) => updateStep(idx, { title: e.target.value })}
                        required
                      />
                    </Field>
                  </div>
                  <Field label="Step Instructions">
                    <textarea
                      className={TEXTAREA}
                      value={step.desc}
                      onChange={(e) => updateStep(idx, { desc: e.target.value })}
                      required
                    />
                  </Field>

                  {/* Screenshot upload zone */}
                  <div className="space-y-2 mt-4">
                    <label className={LABEL}>Step Navigation Screenshot</label>
                    {step.screenshotUrl ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={step.screenshotUrl}
                          alt={`Step ${step.num} screenshot preview`}
                          className="w-32 h-20 rounded-lg object-cover border border-cream/20 shadow-md"
                        />
                        <div className="space-y-1">
                          <p className="font-body text-xs text-cream/40">Screenshot active</p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`step-file-${idx}`) as HTMLInputElement;
                                input?.click();
                              }}
                              className="font-body text-[10px] text-amber hover:underline transition-all cursor-pointer"
                            >
                              Replace Screenshot
                            </button>
                            <span className="text-cream/20 text-[10px]">|</span>
                            <button
                              type="button"
                              onClick={() => updateStep(idx, { screenshotUrl: null })}
                              className="font-body text-[10px] text-red-400 hover:underline transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          const input = document.getElementById(`step-file-${idx}`) as HTMLInputElement;
                          input?.click();
                        }}
                        className={`flex flex-col items-center justify-center gap-1.5 p-6 rounded-xl border border-dashed border-cream/20 bg-cream/5 cursor-pointer hover:border-cream/40 transition-colors ${
                          uploadingSteps[idx] ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        <svg className="w-6 h-6 text-cream/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <span className="font-body text-xs text-cream/50">
                          {uploadingSteps[idx] ? "Uploading..." : "Click to upload step screenshot"}
                        </span>
                        <span className="font-body text-[9px] text-cream/20">Max 4 MB · JPG, PNG, or WebP</span>
                      </div>
                    )}
                    <input
                      id={`step-file-${idx}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadScreenshot(idx, file);
                        e.target.value = "";
                      }}
                    />
                    {uploadErrors[idx] && (
                      <p className="font-body text-red-400 text-xs mt-1">{uploadErrors[idx]}</p>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 font-body text-sm text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 font-body text-sm text-green-200">
          Saved. The Membership page content has been updated successfully.
        </div>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full bg-amber text-teal font-body font-bold text-sm tracking-wide hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "Saving…" : "Save Membership Content"}
        </button>
      </div>
    </form>
  );
}
