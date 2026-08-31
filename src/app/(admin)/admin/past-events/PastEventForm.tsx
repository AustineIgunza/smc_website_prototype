"use client";

import { useState, useRef, useCallback, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Trash2,
  X,
  Plus,
  ImageIcon,
  Images,
  ArrowLeft,
} from "@/components/icons";

export interface PastEventSubmitPayload {
  slug: string;
  title: string;
  description: string;
  category?: string;
  date?: string;
  location?: string;
  attendanceCount?: number | null;
  coverImageUrl?: string;
  galleryUrls: string[];
  highlights?: string[];
  keyTakeaways?: string[];
  speakers?: string[];
  partnerName?: string | null;
  testimonial?: string | null;
  testimonialAuthor?: string | null;
  status: "PUBLISHED" | "DRAFT";
}

interface Props {
  initial?: Partial<PastEventSubmitPayload>;
  onSubmit: (data: PastEventSubmitPayload) => Promise<{ error?: string }>;
  submitLabel: string;
  onDelete?: () => Promise<void>;
  isEdit?: boolean;
}

const INPUT =
  "w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors disabled:opacity-50";
const SELECT =
  "w-full px-4 py-2.5 rounded-lg bg-teal border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber transition-colors";
const TEXTAREA = INPUT + " resize-y min-h-[120px]";
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

export default function PastEventForm({
  initial,
  onSubmit,
  submitLabel,
  onDelete,
  isEdit,
}: Props) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<{
    slug: string;
    title: string;
    description: string;
    coverImageUrl: string;
    galleryUrls: string[];
    status: "PUBLISHED" | "DRAFT";
  }>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    coverImageUrl: initial?.coverImageUrl ?? "",
    galleryUrls: initial?.galleryUrls ?? [],
    status: initial?.status ?? "PUBLISHED",
  });

  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setForm((prev) => {
      const autoSlug = !isEdit && !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        : prev.slug;
      return { ...prev, title: val, slug: autoSlug };
    });
  };

  const handleCoverUpload = useCallback(async (file: File) => {
    setUploadingCover(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("eventId", form.slug || "past");

      const res = await fetch("/api/past-events/admin/image", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Cover upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, coverImageUrl: data.url }));
    } catch {
      setError("Cover upload failed. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  }, [form.slug]);

  const handleGalleryUpload = useCallback(async (files: FileList) => {
    setUploadingGallery(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const body = new FormData();
        body.append("file", file);
        body.append("eventId", form.slug || "past");

        const res = await fetch("/api/past-events/admin/image", { method: "POST", body });
        const data = await res.json();
        if (res.ok && data.url) {
          urls.push(data.url);
        }
      }
      setForm((prev) => ({
        ...prev,
        galleryUrls: [...prev.galleryUrls, ...urls],
      }));
    } catch {
      setError("Gallery upload failed. Please try again.");
    } finally {
      setUploadingGallery(false);
    }
  }, [form.slug]);

  const addGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setForm((prev) => ({ ...prev, galleryUrls: [...prev.galleryUrls, galleryUrlInput.trim()] }));
    setGalleryUrlInput("");
  };

  const removeGalleryPhoto = (index: number) => {
    setForm((prev) => ({ ...prev, galleryUrls: prev.galleryUrls.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: PastEventSubmitPayload = {
      slug: form.slug,
      title: form.title,
      description: form.description,
      category: initial?.category || "",
      date: initial?.date || new Date().toISOString(),
      location: initial?.location || "",
      attendanceCount: initial?.attendanceCount ?? null,
      coverImageUrl: form.coverImageUrl,
      galleryUrls: form.galleryUrls,
      highlights: initial?.highlights || [],
      keyTakeaways: initial?.keyTakeaways || [],
      speakers: initial?.speakers || [],
      partnerName: initial?.partnerName || null,
      testimonial: initial?.testimonial || null,
      testimonialAuthor: initial?.testimonialAuthor || null,
      status: form.status,
    };

    const res = await onSubmit(payload);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/admin/past-events");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !confirm("Are you sure you want to permanently delete this past event archive?")) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete();
      router.push("/admin/past-events");
      router.refresh();
    } catch {
      setError("Failed to delete event.");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body">
          {error}
        </div>
      )}

      {/* 1. Core Event Info */}
      <Section title="Basic Details">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Event Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Strathmore Marketing Summit 2025"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>URL Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="e.g. marketing-summit-2025"
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Event Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Comprehensive description of the past event..."
            className={TEXTAREA}
          />
        </div>
      </Section>

      {/* 2. Cover Image & Gallery Photos */}
      <Section title="Cover Image & Photo Gallery">
        {/* Cover Photo */}
        <div>
          <label className={LABEL}>Cover Photo</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {form.coverImageUrl ? (
              <div className="relative w-44 h-28 rounded-xl overflow-hidden border border-cream/20 bg-navy/80 shrink-0">
                <img src={form.coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, coverImageUrl: "" }))}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="w-44 h-28 rounded-xl border-2 border-dashed border-cream/20 hover:border-amber/50 flex flex-col items-center justify-center text-cream/40 hover:text-amber cursor-pointer transition-colors shrink-0"
              >
                <UploadCloud size={24} className="mb-1" />
                <span className="text-[11px] font-body">Upload Cover</span>
              </div>
            )}

            <div className="flex-1 w-full space-y-2">
              <input
                type="url"
                value={form.coverImageUrl}
                onChange={(e) => setForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
                placeholder="Or paste cover image URL..."
                className={INPUT}
              />
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
              />
              {uploadingCover && (
                <p className="text-xs text-amber font-body">Uploading cover photo...</p>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Photos */}
        <div className="pt-4 border-t border-cream/10">
          <label className={LABEL}>Photo Gallery ({form.galleryUrls.length} photos)</label>

          {/* Grid of gallery photos */}
          {form.galleryUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {form.galleryUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-cream/20 group">
                  <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryPhoto(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/80 hover:bg-red-600 text-white cursor-pointer transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Gallery upload / URL controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
              placeholder="Paste photo URL..."
              className={INPUT}
            />
            <button
              type="button"
              onClick={addGalleryUrl}
              className="px-4 py-2 rounded-lg bg-navy/80 border border-cream/15 text-cream font-body text-xs font-semibold hover:border-amber cursor-pointer whitespace-nowrap"
            >
              + Add URL
            </button>

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-amber/10 border border-amber/30 text-amber font-body text-xs font-semibold hover:bg-amber hover:text-teal transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <UploadCloud size={14} />
              <span>Upload Photos</span>
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleGalleryUpload(e.target.files);
              }}
            />
          </div>
          {uploadingGallery && (
            <p className="text-xs text-amber font-body mt-2">Uploading gallery photos...</p>
          )}
        </div>
      </Section>

      {/* 3. Status & Submit */}
      <Section title="Publishing">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <label className={LABEL}>Status:</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
              className={SELECT + " w-auto"}
            >
              <option value="PUBLISHED">PUBLISHED (Visible on site)</option>
              <option value="DRAFT">DRAFT (Hidden)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {isEdit && onDelete && (
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-body font-semibold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>{deleting ? "Deleting..." : "Delete Archive"}</span>
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-amber text-teal font-body font-bold text-sm hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
            >
              {loading ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </Section>
    </form>
  );
}

