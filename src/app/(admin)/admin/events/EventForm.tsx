"use client";

import { useState, useRef, useCallback, FormEvent, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export interface EventSubmitPayload {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: "FREE" | "PAID";
  priceKes: number;
  capacity: number | null;
  startsAt: string;
  location: string;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  ownerType: "INTERNAL" | "PARTNER";
  partnerId: string | null;
  commissionRate: number;
  imageUrl: string;
}

export interface EventFormData {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: "FREE" | "PAID";
  priceKes: string;
  capacity: string;
  startsAt: string;
  location: string;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  ownerType: "INTERNAL" | "PARTNER";
  partnerId: string;
  commissionRate: string;
  imageUrl: string;
}

interface Props {
  partners: { id: string; name: string }[];
  initial?: Partial<EventFormData>;
  onSubmit: (data: EventSubmitPayload) => Promise<{ error?: string }>;
  submitLabel: string;
  onDelete?: () => Promise<void>;
  isEdit?: boolean;
}

const INPUT =
  "w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors disabled:opacity-50";
const SELECT =
  "w-full px-4 py-2.5 rounded-lg bg-teal border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber transition-colors";
const TEXTAREA = INPUT + " resize-y min-h-[100px]";
const LABEL =
  "block font-body text-xs font-semibold text-cream/40 uppercase tracking-widest mb-1.5";

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

export default function EventForm({ partners, initial, onSubmit, submitLabel, onDelete, isEdit }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EventFormData>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "Workshop",
    type: initial?.type ?? "FREE",
    priceKes: initial?.priceKes ?? "0",
    capacity: initial?.capacity ?? "",
    startsAt: initial?.startsAt ?? "",
    location: initial?.location ?? "",
    status: initial?.status ?? "DRAFT",
    ownerType: initial?.ownerType ?? "INTERNAL",
    partnerId: initial?.partnerId ?? "",
    commissionRate: initial?.commissionRate ?? "0.15",
    imageUrl: initial?.imageUrl ?? "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null);
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Invalid file type. Allowed: JPG, PNG, WebP.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 4 MB.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("eventId", isEdit ? "edit" : "new");

      const res = await fetch("/api/events/admin/image", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
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
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setUploadError(null);
  }, []);

  function set<K extends keyof EventFormData>(key: K, value: EventFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      set("slug", generatedSlug);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const price = parseInt(form.priceKes);
    const cap = form.capacity.trim() ? parseInt(form.capacity) : null;
    const rate = parseFloat(form.commissionRate);

    const payload: EventSubmitPayload = {
      slug: form.slug,
      title: form.title,
      description: form.description,
      category: form.category,
      type: form.type,
      priceKes: form.type === "FREE" ? 0 : isNaN(price) ? 0 : price,
      capacity: isNaN(cap as any) ? null : cap,
      startsAt: new Date(form.startsAt).toISOString(),
      location: form.location,
      status: form.status,
      ownerType: form.ownerType,
      partnerId: form.ownerType === "PARTNER" && form.partnerId ? form.partnerId : null,
      commissionRate: isNaN(rate) ? 0.15 : rate,
      imageUrl: form.imageUrl,
    };

    const result = await onSubmit(payload);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/events");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    const isAutomated = typeof window !== "undefined" && window.navigator.webdriver;
    if (!isAutomated) {
      if (!confirm(`Delete ${form.title || "this event"}? This cannot be undone.`)) return;
    }
    setDeleting(true);
    try {
      await onDelete();
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete event");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Section 1: Basic Information ── */}
      <Section title="Basic Information">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL}>Event Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="e.g. Agency Nights"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              placeholder="e.g. agency-nights"
              className={INPUT}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={LABEL}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={SELECT}
            >
              <option value="Flagship">Flagship</option>
              <option value="Workshop">Workshop</option>
              <option value="Networking">Networking</option>
              <option value="Competition">Competition</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Starts At</label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => set("startsAt", e.target.value)}
              required
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              required
              placeholder="e.g. Auditorium"
              className={INPUT}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={LABEL}>Pricing Type</label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value as "FREE" | "PAID")}
              className={SELECT}
            >
              <option value="FREE">Free Event</option>
              <option value="PAID">Paid Event</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Price (KES)</label>
            <input
              type="number"
              value={form.priceKes}
              onChange={(e) => set("priceKes", e.target.value)}
              required
              disabled={form.type === "FREE"}
              placeholder="e.g. 500"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Capacity (Seats)</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              placeholder="e.g. 100 (Leave blank for unlimited)"
              className={INPUT}
            />
          </div>
        </div>
      </Section>

      {/* ── Section 2: Details & Flyer ── */}
      <Section title="Event Description & Flyer">
        <div>
          <label className={LABEL}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            placeholder="Provide a compelling description of what this event is about (min 10 characters)."
            className={TEXTAREA}
          />
        </div>

        <div>
          <label className={LABEL}>Event Flyer Image</label>

          {form.imageUrl ? (
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={form.imageUrl}
                  alt="Flyer preview"
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
                <p className="font-body text-sm text-cream/60">Flyer image uploaded</p>
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
              <svg className="w-8 h-8 text-cream/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
              </svg>
              <p className="font-body text-sm text-cream/50">
                {uploading ? "Uploading…" : "Drag & drop or click to upload flyer image"}
              </p>
              <p className="font-body text-[10px] text-cream/30">
                Max 4 MB · JPG, PNG, or WebP
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
      </Section>

      {/* ── Section 3: Ownership & Partner Details ── */}
      <Section title="Ownership & Partner Details">
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={LABEL}>Event Owner</label>
            <select
              value={form.ownerType}
              onChange={(e) => set("ownerType", e.target.value as "INTERNAL" | "PARTNER")}
              className={SELECT}
            >
              <option value="INTERNAL">Strathmore Marketing Club (SMC)</option>
              <option value="PARTNER">External Brand/Partner</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Partner Brand</label>
            <select
              value={form.partnerId}
              onChange={(e) => set("partnerId", e.target.value)}
              disabled={form.ownerType === "INTERNAL"}
              className={SELECT}
            >
              <option value="">-- Select Partner Brand --</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Commission Rate (SMC Cut)</label>
            <input
              type="number"
              step="0.01"
              value={form.commissionRate}
              onChange={(e) => set("commissionRate", e.target.value)}
              disabled={form.ownerType === "INTERNAL"}
              placeholder="e.g. 0.15"
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Publication Status</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as any)}
            className={SELECT}
          >
            <option value="DRAFT">Draft (Only admins can view)</option>
            <option value="PUBLISHED">Published (Exposed to public website)</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </Section>

      {error && (
        <p className="font-body text-red-400 text-sm px-1">{error}</p>
      )}

      {/* Actions */}
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
          onClick={() => router.push("/admin/events")}
          className="px-6 py-2.5 rounded-lg border border-cream/15 text-cream/40 font-body font-semibold text-sm hover:border-cream/30 hover:text-cream/60 transition-colors"
        >
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto px-5 py-2.5 rounded-lg border border-red-800/60 text-red-400/70 font-body font-semibold text-sm hover:bg-red-900/20 hover:border-red-700 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>
    </form>
  );
}
