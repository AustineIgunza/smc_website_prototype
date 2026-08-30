"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type {
  PartnershipsContent,
  InternalPartner,
  ExternalPartner,
} from "@/data/partnerships";
import { Upload, X, CheckCircle2, Sparkles } from "@/components/icons";

const INPUT =
  "w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors disabled:opacity-50";
const TEXTAREA = INPUT + " resize-y min-h-[100px]";
const LABEL =
  "block font-body text-xs font-semibold text-cream/40 uppercase tracking-widest mb-1.5";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PartnershipsForm({
  initial,
}: {
  initial: PartnershipsContent;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PartnershipsContent>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"external" | "internal" | "general">(
    "external"
  );

  // Logo upload state per external partner index
  const [uploadingLogo, setUploadingLogo] = useState<Record<number, boolean>>({});
  const [logoErrors, setLogoErrors] = useState<Record<number, string | null>>({});
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function updateField<K extends keyof PartnershipsContent>(
    key: K,
    value: PartnershipsContent[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (success) setSuccess(false);
  }

  // External Partners handlers
  function updateExternalPartner(index: number, updated: Partial<ExternalPartner>) {
    const next = [...form.externalPartners];
    const current = next[index];
    const newName = updated.name !== undefined ? updated.name : current.name;
    
    // Auto-update id if current id looks auto-generated or default
    let newId = updated.id !== undefined ? updated.id : current.id;
    if (updated.name && (!current.id || current.id.startsWith("partner-"))) {
      const slug = slugify(updated.name);
      if (slug) newId = slug;
    }

    next[index] = { ...current, ...updated, id: newId, name: newName };
    updateField("externalPartners", next);
  }

  function addExternalPartner() {
    const newPartner: ExternalPartner = {
      id: `partner-${Date.now()}`,
      name: "New Corporate Partner",
      industry: "Industry / Sector",
      description: "Describe the collaboration and value delivered to members.",
      logoUrl: null,
    };
    updateField("externalPartners", [...form.externalPartners, newPartner]);
  }

  function removeExternalPartner(index: number) {
    const next = form.externalPartners.filter((_, i) => i !== index);
    updateField("externalPartners", next);
  }

  function moveExternalPartner(index: number, direction: "up" | "down") {
    const next = [...form.externalPartners];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    updateField("externalPartners", next);
  }

  // Handle partner logo upload
  async function handleLogoFileChange(
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo((prev) => ({ ...prev, [index]: true }));
    setLogoErrors((prev) => ({ ...prev, [index]: null }));

    try {
      const partner = form.externalPartners[index];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("partnerId", partner.id || slugify(partner.name) || "partner");

      const res = await fetch("/api/partnerships-content/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload logo");
      }

      updateExternalPartner(index, { logoUrl: data.url });
    } catch (err: any) {
      setLogoErrors((prev) => ({
        ...prev,
        [index]: err.message || "Failed to upload logo",
      }));
    } finally {
      setUploadingLogo((prev) => ({ ...prev, [index]: false }));
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = "";
      }
    }
  }

  function handleRemoveLogo(index: number) {
    updateExternalPartner(index, { logoUrl: null });
  }

  // Internal Partners handlers
  function updateInternalPartner(index: number, updated: Partial<InternalPartner>) {
    const next = [...form.internalPartners];
    const current = next[index];
    const newName = updated.name !== undefined ? updated.name : current.name;

    let newId = updated.id !== undefined ? updated.id : current.id;
    if (updated.name && (!current.id || current.id.startsWith("internal-"))) {
      const slug = slugify(updated.name);
      if (slug) newId = slug;
    }

    next[index] = { ...current, ...updated, id: newId, name: newName };
    updateField("internalPartners", next);
  }

  function addInternalPartner() {
    const newPartner: InternalPartner = {
      id: `internal-${Date.now()}`,
      name: "University Body Name",
      category: "Institutional Department",
    };
    updateField("internalPartners", [...form.internalPartners, newPartner]);
  }

  function removeInternalPartner(index: number) {
    const next = form.internalPartners.filter((_, i) => i !== index);
    updateField("internalPartners", next);
  }

  function moveInternalPartner(index: number, direction: "up" | "down") {
    const next = [...form.internalPartners];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    updateField("internalPartners", next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/partnerships-content", {
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
        setError(json.error ?? "Failed to save partnerships content");
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
        {(
          [
            { id: "external", label: "External Partnerships" },
            { id: "internal", label: "Internal Partnerships" },
            { id: "general", label: "Headings & Overview" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-display text-sm font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-amber text-amber"
                : "border-transparent text-cream/40 hover:text-cream/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 font-body text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 font-body text-sm flex items-center justify-between">
          <span>Partnerships content saved successfully!</span>
          <span className="text-xs opacity-75">Live on /portfolio</span>
        </div>
      )}

      {/* ── Tab 1: External Corporate Partnerships ───────────── */}
      {activeTab === "external" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="font-body text-xs text-cream/40 uppercase tracking-wider font-semibold">
              Manage external corporate partners ({form.externalPartners.length} items)
            </p>
            <button
              type="button"
              onClick={addExternalPartner}
              className="px-4 py-2 rounded-lg bg-amber/15 border border-amber/30 text-amber font-body text-xs font-bold hover:bg-amber/25 transition-all cursor-pointer"
            >
              + Add External Partner
            </button>
          </div>

          <div className="space-y-6">
            {form.externalPartners.map((p, idx) => (
              <div
                key={p.id || idx}
                className="relative rounded-2xl bg-navy/60 border border-cream/10 p-6 space-y-5 hover:border-cream/20 transition-all"
              >
                {/* Control buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveExternalPartner(idx, "up")}
                    className="w-8 h-8 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === form.externalPartners.length - 1}
                    onClick={() => moveExternalPartner(idx, "down")}
                    className="w-8 h-8 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExternalPartner(idx)}
                    className="w-8 h-8 rounded bg-red-950/20 border border-red-800/40 text-red-400/80 flex items-center justify-center hover:bg-red-900/30 hover:border-red-700 transition-all font-semibold cursor-pointer"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-display font-bold text-amber text-xs uppercase tracking-widest pb-1 border-b border-cream/5 pr-28">
                  Corporate Partner #{idx + 1}
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Partner Name">
                    <input
                      className={INPUT}
                      value={p.name}
                      onChange={(e) =>
                        updateExternalPartner(idx, { name: e.target.value })
                      }
                      placeholder="e.g. Kenya Commercial Bank"
                      required
                    />
                  </Field>
                  <Field label="Industry / Sector Tag">
                    <input
                      className={INPUT}
                      value={p.industry || ""}
                      onChange={(e) =>
                        updateExternalPartner(idx, { industry: e.target.value })
                      }
                      placeholder="e.g. Banking & Financial Services"
                    />
                  </Field>
                </div>

                {/* Optional Partner Logo */}
                <div>
                  <label className={LABEL}>Partner Logo (Optional)</label>
                  <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-cream/5 border border-cream/10">
                    {p.logoUrl ? (
                      <div className="relative w-16 h-16 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={p.logoUrl}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveLogo(idx)}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors cursor-pointer"
                          title="Remove Logo"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center font-display font-bold text-amber text-sm shrink-0">
                        {p.name ? p.name.substring(0, 2).toUpperCase() : "LOGO"}
                      </div>
                    )}

                    <div className="flex-1 min-w-[200px] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[idx] = el;
                          }}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={(e) => handleLogoFileChange(idx, e)}
                        />
                        <button
                          type="button"
                          disabled={uploadingLogo[idx]}
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          className="px-3.5 py-1.5 rounded-lg bg-cream/10 border border-cream/20 text-cream font-body text-xs font-semibold hover:bg-cream/20 disabled:opacity-50 transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Upload size={13} />
                          <span>
                            {uploadingLogo[idx]
                              ? "Uploading..."
                              : p.logoUrl
                              ? "Replace Logo"
                              : "Upload Logo"}
                          </span>
                        </button>

                        {p.logoUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLogo(idx)}
                            className="px-3 py-1.5 rounded-lg bg-transparent text-cream/40 hover:text-red-400 font-body text-xs transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="font-body text-[11px] text-cream/40">
                        Recommended: PNG or SVG with transparent background (Max 4MB)
                      </p>
                      {logoErrors[idx] && (
                        <p className="font-body text-xs text-red-400">
                          {logoErrors[idx]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Field label="Collaboration Impact Description">
                    <textarea
                      className={TEXTAREA}
                      value={p.description}
                      onChange={(e) =>
                        updateExternalPartner(idx, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Explain how this partnership provides real-world marketing value or exposure to members."
                      required
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 2: Internal University Partnerships ──────────── */}
      {activeTab === "internal" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="font-body text-xs text-cream/40 uppercase tracking-wider font-semibold">
              Manage internal university partners ({form.internalPartners.length} items)
            </p>
            <button
              type="button"
              onClick={addInternalPartner}
              className="px-4 py-2 rounded-lg bg-amber/15 border border-amber/30 text-amber font-body text-xs font-bold hover:bg-amber/25 transition-all cursor-pointer"
            >
              + Add Internal Partner
            </button>
          </div>

          <div className="space-y-4">
            {form.internalPartners.map((p, idx) => (
              <div
                key={p.id || idx}
                className="relative rounded-2xl bg-navy/60 border border-cream/10 p-5 space-y-3 hover:border-cream/20 transition-all"
              >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveInternalPartner(idx, "up")}
                    className="w-7 h-7 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === form.internalPartners.length - 1}
                    onClick={() => moveInternalPartner(idx, "down")}
                    className="w-7 h-7 rounded bg-cream/5 border border-cream/10 text-cream/60 flex items-center justify-center hover:bg-cream/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => removeInternalPartner(idx)}
                    className="w-7 h-7 rounded bg-red-950/20 border border-red-800/40 text-red-400/80 flex items-center justify-center hover:bg-red-900/30 hover:border-red-700 transition-all font-semibold cursor-pointer text-xs"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-display font-bold text-amber text-xs uppercase tracking-widest pb-1 border-b border-cream/5 pr-28">
                  Internal Partner #{idx + 1}
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Partner Name">
                    <input
                      className={INPUT}
                      value={p.name}
                      onChange={(e) =>
                        updateInternalPartner(idx, { name: e.target.value })
                      }
                      placeholder="e.g. Strathmore University Foundation"
                      required
                    />
                  </Field>
                  <Field label="Category / Subtitle">
                    <input
                      className={INPUT}
                      value={p.category || ""}
                      onChange={(e) =>
                        updateInternalPartner(idx, { category: e.target.value })
                      }
                      placeholder="e.g. Student Leadership & Governance"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 3: Headings & Copy ──────────────────────────── */}
      {activeTab === "general" && (
        <Section
          title="Section Headings & Overview"
          description="Control the main titles and introductory copy on the Portfolio page."
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Section Eyebrow / Badge">
              <input
                className={INPUT}
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </Field>
            <Field label="Section Heading">
              <input
                className={INPUT}
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Introductory Summary">
            <textarea
              className={TEXTAREA}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </Field>
        </Section>
      )}

      {/* Save Button Bar */}
      <div className="pt-4 flex items-center justify-end gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 rounded-full bg-amber text-teal font-body font-bold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-amber/10 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? "Saving..." : "Save Partnerships Changes"}
        </button>
      </div>
    </form>
  );
}
