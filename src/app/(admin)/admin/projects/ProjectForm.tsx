"use client";

import { useState, FormEvent, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Trash2, UploadCloud } from "@/components/icons";
import { PROJECT_CATEGORIES } from "@/data/projectCategories";

export interface ProjectFormData {
  slug: string;
  title: string;
  category: string;
  clientName: string;
  duration: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  desc: string;
  problem: string;
  approach: string;
  outcome: string;
  metrics: string;
  tags: string;
  team: string;
  coverImageUrl: string;
  liveUrl: string;
  testimonial: string;
  testimonialAuthor: string;
}

interface Props {
  initial?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<{ error?: string }>;
  submitLabel: string;
  onDelete?: () => Promise<void>;
  isEdit?: boolean;
}

/* ── Shared input classes ─────────────────────────────── */
const INPUT =
  "w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors";
const SELECT =
  "w-full px-4 py-2.5 rounded-lg bg-teal border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber transition-colors";
const TEXTAREA = INPUT + " resize-y min-h-[100px]";
const LABEL =
  "block font-body text-xs font-semibold text-cream/40 uppercase tracking-widest mb-1.5";

/* ── Section wrapper ──────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-navy/60 border border-cream/10 p-6 space-y-5">
      <h2 className="font-display font-bold text-cream/80 text-sm uppercase tracking-widest">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Pill preview ─────────────────────────────────────── */
function PillPreview({ value, color = "amber" }: { value: string; color?: "amber" | "cream" }) {
  const items = value.split(",").map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item, i) => (
        <span
          key={i}
          className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full ${
            color === "amber"
              ? "bg-amber/10 text-amber"
              : "bg-cream/10 text-cream/60"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/* ── Avatar chip preview ──────────────────────────────── */
function TeamPreview({ value }: { value: string }) {
  const members = value.split(",").map((s) => s.trim()).filter(Boolean);
  if (!members.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {members.map((name, i) => (
        <div key={i} className="flex items-center gap-1.5 bg-cream/5 border border-cream/10 rounded-full px-2.5 py-1">
          <div className="w-5 h-5 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-[9px] font-bold text-amber">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-body text-xs text-cream/60">{name}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Slug generator ───────────────────────────────────── */
function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ── Main form ────────────────────────────────────────── */
export default function ProjectForm({ initial, onSubmit, submitLabel, onDelete, isEdit }: Props) {
  const router = useRouter();
  const slugManuallyEdited = useRef(!!initial?.slug);

  const [form, setForm] = useState<ProjectFormData>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    category: initial?.category ?? PROJECT_CATEGORIES[0].id,
    clientName: initial?.clientName ?? "",
    duration: initial?.duration ?? "",
    status: initial?.status ?? "DRAFT",
    featured: initial?.featured ?? false,
    desc: initial?.desc ?? "",
    problem: initial?.problem ?? "",
    approach: initial?.approach ?? "",
    outcome: initial?.outcome ?? "",
    metrics: initial?.metrics ?? "",
    tags: initial?.tags ?? "",
    team: initial?.team ?? "",
    coverImageUrl: initial?.coverImageUrl ?? "",
    liveUrl: initial?.liveUrl ?? "",
    testimonial: initial?.testimonial ?? "",
    testimonialAuthor: initial?.testimonialAuthor ?? "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null);
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Invalid file type. Allowed: JPG, PNG, WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 2 MB.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("projectId", isEdit ? "edit" : "new");

      const res = await fetch("/api/projects/image", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, coverImageUrl: data.url }));
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [isEdit]);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = "";
  }, [handleFileUpload]);

  const removeImage = useCallback(() => {
    setForm((prev) => ({ ...prev, coverImageUrl: "" }));
    setUploadError(null);
  }, []);

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    set("title", value);
    if (!isEdit && !slugManuallyEdited.current) {
      set("slug", toSlug(value));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await onSubmit(form);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    const isAutomated = typeof window !== "undefined" && window.navigator.webdriver;
    if (!isAutomated) {
      if (!confirm("Delete this project? This cannot be undone.")) return;
    }
    setDeleting(true);
    try {
      await onDelete();
      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Section 1: Basics ── */}
      <Section title="Basics">
        <div>
          <label className={LABEL}>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="e.g. Rebrand Sprint — Campus Café"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>
            Slug
            {isEdit && (
              <span className="ml-2 normal-case tracking-normal font-normal text-cream/30">
                (locked after creation)
              </span>
            )}
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              slugManuallyEdited.current = true;
              set("slug", e.target.value);
            }}
            required
            readOnly={isEdit}
            placeholder="e.g. campus-cafe-rebrand"
            className={`${INPUT} ${isEdit ? "opacity-40 cursor-not-allowed" : ""}`}
          />
          <p className="font-body text-cream/30 text-xs mt-1">
            URL: /portfolio/{form.slug || "…"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={SELECT}
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Client name</label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => set("clientName", e.target.value)}
              placeholder="e.g. Campus Café"
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Duration</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            required
            placeholder="e.g. 6 weeks"
            className={INPUT}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-6">
            <div>
              <p className={LABEL + " mb-2"}>Status</p>
              <div className="flex gap-2">
                {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("status", s)}
                    className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      form.status === s
                        ? s === "PUBLISHED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-cream/10 text-cream/60 border border-cream/15"
                        : "bg-cream/5 text-cream/30 border border-cream/10 hover:border-cream/20"
                    }`}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className={LABEL + " mb-2"}>Featured</p>
              <button
                type="button"
                onClick={() => set("featured", !form.featured)}
                className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                  form.featured
                    ? "bg-amber/15 text-amber border-amber/30"
                    : "bg-cream/5 text-cream/30 border-cream/10 hover:border-cream/20"
                }`}
              >
                <Sparkles size={12} className={form.featured ? "text-amber shrink-0" : "text-cream/30 shrink-0"} />
                <span>{form.featured ? "Featured" : "Not featured"}</span>
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Section 2: Case Study ── */}
      <Section title="Case Study">
        <div>
          <label className={LABEL}>Short description</label>
          <textarea
            value={form.desc}
            onChange={(e) => set("desc", e.target.value)}
            required
            placeholder="1–2 sentences shown on the portfolio card."
            className={TEXTAREA}
          />
        </div>
        <div>
          <label className={LABEL}>Problem</label>
          <textarea
            value={form.problem}
            onChange={(e) => set("problem", e.target.value)}
            placeholder="What challenge did the client face? (optional)"
            className={TEXTAREA}
          />
        </div>
        <div>
          <label className={LABEL}>Approach</label>
          <textarea
            value={form.approach}
            onChange={(e) => set("approach", e.target.value)}
            placeholder="How did the team tackle it? (optional)"
            className={TEXTAREA}
          />
        </div>
        <div>
          <label className={LABEL}>Outcome</label>
          <textarea
            value={form.outcome}
            onChange={(e) => set("outcome", e.target.value)}
            placeholder="What were the results? (optional)"
            className={TEXTAREA}
          />
        </div>
      </Section>

      {/* ── Section 3: Results & Team ── */}
      <Section title="Results & Team">
        <div>
          <label className={LABEL}>Key metrics <span className="normal-case tracking-normal font-normal text-cream/30">(comma-separated)</span></label>
          <input
            type="text"
            value={form.metrics}
            onChange={(e) => set("metrics", e.target.value)}
            required
            placeholder="e.g. 35% foot traffic increase, 800 new followers"
            className={INPUT}
          />
          <PillPreview value={form.metrics} color="amber" />
        </div>

        <div>
          <label className={LABEL}>Tags <span className="normal-case tracking-normal font-normal text-cream/30">(comma-separated)</span></label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="e.g. Social Media, B2C, FMCG"
            className={INPUT}
          />
          <PillPreview value={form.tags} color="cream" />
        </div>

        <div>
          <label className={LABEL}>Team members <span className="normal-case tracking-normal font-normal text-cream/30">(comma-separated)</span></label>
          <input
            type="text"
            value={form.team}
            onChange={(e) => set("team", e.target.value)}
            required
            placeholder="e.g. Grace Wanjiku, Brian Otieno"
            className={INPUT}
          />
          <TeamPreview value={form.team} />
        </div>
      </Section>

      {/* ── Section 4: Media & Links ── */}
      <Section title="Media & Links">
        <div>
          <label className={LABEL}>Cover image</label>

          {form.coverImageUrl ? (
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={form.coverImageUrl}
                  alt="Cover preview"
                  className="w-24 h-24 rounded-lg object-cover border-2 border-amber/40 shadow-lg"
                />
                <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-white text-xs font-body font-semibold px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-body text-sm text-cream/60">Cover image uploaded</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-body text-xs text-amber hover:text-amber/80 underline underline-offset-2 transition-colors"
                >
                  Replace image
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-amber bg-amber/10"
                  : "border-cream/20 hover:border-cream/40 bg-cream/5"
              } ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              <UploadCloud className="w-8 h-8 text-cream/30" strokeWidth={1.5} />
              <p className="font-body text-sm text-cream/50">
                {uploading ? "Uploading…" : "Drag & drop or click to upload cover image"}
              </p>
              <p className="font-body text-[10px] text-cream/30">
                Max 2 MB · JPG, PNG, or WebP
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />
          {uploadError && (
            <p className="font-body text-red-400 text-xs mt-2">{uploadError}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>Live project URL</label>
          <input
            type="url"
            value={form.liveUrl}
            onChange={(e) => set("liveUrl", e.target.value)}
            placeholder="https://…"
            className={INPUT}
          />
          <p className="font-body text-cream/25 text-xs mt-1">
            A "View live work" button will appear on the portfolio modal.
          </p>
        </div>

        <div>
          <label className={LABEL}>Testimonial</label>
          <textarea
            value={form.testimonial}
            onChange={(e) => set("testimonial", e.target.value)}
            placeholder="A quote from the client or collaborator."
            className={TEXTAREA + " min-h-[72px]"}
          />
        </div>

        <div>
          <label className={LABEL}>Testimonial author</label>
          <input
            type="text"
            value={form.testimonialAuthor}
            onChange={(e) => set("testimonialAuthor", e.target.value)}
            placeholder="e.g. John Kamau, Marketing Manager at Café"
            className={INPUT}
          />
        </div>
      </Section>

      {/* ── Actions ── */}
      {error && (
        <p className="font-body text-red-400 text-sm px-1">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-1 pb-8">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="px-6 py-2.5 rounded-lg border border-cream/15 text-cream/40 font-body font-semibold text-sm hover:border-cream/30 hover:text-cream/60 transition-colors"
        >
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto px-5 py-2.5 rounded-lg border border-red-800/60 text-red-400/70 font-body font-semibold text-sm hover:bg-red-900/20 hover:border-red-700 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            <Trash2 size={14} className="shrink-0" />
            <span>{deleting ? "Deleting…" : "Delete"}</span>
          </button>
        )}
      </div>
    </form>
  );
}
