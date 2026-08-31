"use client";

import { useState, useRef, useCallback, FormEvent, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Trash2, X } from "@/components/icons";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export interface TeamMemberSubmitPayload {
  name: string;
  role: string;
  title: string;
  course: string;
  year: string;
  bio: string;
  avatarGradient: string[];
  avatarUrl: string;
}

export interface TeamMemberFormData {
  name: string;
  role: string;
  title: string;
  course: string;
  year: string;
  bio: string;
  gradientStart: string;
  gradientEnd: string;
  avatarUrl: string;
}

interface Props {
  initial?: Partial<TeamMemberFormData>;
  onSubmit: (data: TeamMemberSubmitPayload) => Promise<{ error?: string }>;
  submitLabel: string;
  onDelete?: () => Promise<void>;
  isEdit?: boolean;
}

/* ── Shared input classes ─────────────────────────────── */
const INPUT =
  "w-full px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/15 text-cream font-body text-sm outline-none focus:border-amber placeholder:text-cream/25 transition-colors disabled:opacity-50";
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

export default function TeamForm({ initial, onSubmit, submitLabel, onDelete, isEdit }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<TeamMemberFormData>({
    name: initial?.name ?? "",
    role: initial?.role ?? "MEMBER",
    title: initial?.title ?? "",
    course: initial?.course ?? "",
    year: initial?.year ?? "1st Year",
    bio: initial?.bio ?? "",
    gradientStart: initial?.gradientStart ?? "#0D3B4C",
    gradientEnd: initial?.gradientEnd ?? "#FFA829",
    avatarUrl: initial?.avatarUrl ?? "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /* ── File upload handler ────────────────────────────── */
  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null);

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Invalid file type. Allowed: JPG, PNG, WebP.");
      return;
    }
    // Validate size (4 MB)
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 4 MB.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("teamMemberId", isEdit ? "edit" : "new");

      const res = await fetch("/api/team/avatar", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }

      setForm((prev) => ({ ...prev, avatarUrl: data.url }));
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
    // Reset so the same file can be re-selected
    e.target.value = "";
  }, [handleFileUpload]);

  const removeAvatar = useCallback(() => {
    setForm((prev) => ({ ...prev, avatarUrl: "" }));
    setUploadError(null);
  }, []);

  function set<K extends keyof TeamMemberFormData>(key: K, value: TeamMemberFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: TeamMemberSubmitPayload = {
      name: form.name,
      role: form.role,
      title: form.title,
      course: form.course,
      year: form.year,
      bio: form.bio,
      avatarGradient: [form.gradientStart, form.gradientEnd],
      avatarUrl: form.avatarUrl,
    };

    const result = await onSubmit(payload);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/team");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await onDelete();
      router.push("/admin/team");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete team member");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Section 1: Basic Information ── */}
      <Section title="Basic Information">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL}>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              placeholder="e.g. Amara Osei"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Role</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              required
              placeholder="e.g. Chairperson"
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Title / Short Responsibilities</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            placeholder="e.g. Overall club leadership and strategy"
            className={INPUT}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL}>Course</label>
            <input
              type="text"
              value={form.course}
              onChange={(e) => set("course", e.target.value)}
              required
              placeholder="e.g. Bachelor of Commerce — Marketing"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Year of Study</label>
            <input
              type="text"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              required
              placeholder="e.g. 4th Year"
              className={INPUT}
            />
          </div>
        </div>
      </Section>

      {/* ── Section 2: Biography ── */}
      <Section title="Biography">
        <div>
          <label className={LABEL}>Biography</label>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            required
            placeholder="Describe background, achievements, and aspirations (min 10 characters)."
            className={TEXTAREA}
          />
        </div>
      </Section>

      {/* ── Section 3: Profile Picture ── */}
      <Section title="Profile Picture">
        <div className="space-y-4">
          <label className={LABEL}>Upload Photo</label>

          {/* Current photo preview or drop zone */}
          {form.avatarUrl ? (
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={form.avatarUrl}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-amber/40 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-white text-xs font-body font-semibold px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-body text-sm text-cream/60">Photo uploaded</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-body text-xs text-amber hover:text-amber/80 underline underline-offset-2 transition-colors"
                >
                  Replace photo
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
              {/* Upload icon */}
              <UploadCloud className="w-8 h-8 text-cream/30" strokeWidth={1.5} />
              <p className="font-body text-sm text-cream/50">
                {uploading ? "Uploading…" : "Drag & drop or click to upload"}
              </p>
              <p className="font-body text-[10px] text-cream/30">
                Max 2 MB · JPG, PNG, or WebP
              </p>
              {uploading && (
                <div className="absolute bottom-3 left-6 right-6 h-1 bg-cream/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
              )}
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
            <p className="font-body text-red-400 text-xs">{uploadError}</p>
          )}
        </div>
      </Section>

      {/* ── Section 4: Avatar Fallback Gradient ── */}
      <Section title="Avatar Fallback Gradient">
        <div className="space-y-4">
          <label className={LABEL}>Fallback Gradient Colors</label>
          <p className="text-[10px] text-cream/30 -mt-3">Used when no profile picture is set</p>
          <div className="flex gap-4 items-center">
            <div>
              <p className="text-[10px] text-cream/40 mb-1">Start Color</p>
              <input
                type="color"
                value={form.gradientStart}
                onChange={(e) => set("gradientStart", e.target.value)}
                className="w-12 h-10 rounded bg-transparent border border-cream/20 cursor-pointer"
              />
            </div>
            <div>
              <p className="text-[10px] text-cream/40 mb-1">End Color</p>
              <input
                type="color"
                value={form.gradientEnd}
                onChange={(e) => set("gradientEnd", e.target.value)}
                className="w-12 h-10 rounded bg-transparent border border-cream/20 cursor-pointer"
              />
            </div>
            
            {/* Live Preview Avatar */}
            <div className="ml-auto flex flex-col items-center">
              <p className="text-[10px] text-cream/40 mb-1">Preview</p>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-cream font-display font-bold border border-cream/10 text-lg shadow-inner select-none transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${form.gradientStart}, ${form.gradientEnd})`,
                }}
              >
                {form.name ? form.name.charAt(0).toUpperCase() : "S"}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Actions */}
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
          onClick={() => router.push("/admin/team")}
          className="px-6 py-2.5 rounded-lg border border-cream/15 text-cream/40 font-body font-semibold text-sm hover:border-cream/30 hover:text-cream/60 transition-colors"
        >
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="ml-auto px-5 py-2.5 rounded-lg border border-red-800/60 text-red-400/70 font-body font-semibold text-sm hover:bg-red-900/20 hover:border-red-700 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        itemName={form.name || "this team member"}
        description="Are you sure you want to permanently delete this team member profile? This cannot be undone."
        isDeleting={deleting}
      />
    </form>
  );
}
