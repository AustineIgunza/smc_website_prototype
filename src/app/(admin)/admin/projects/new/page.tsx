"use client";

import Link from "next/link";
import ProjectForm, { type ProjectFormData } from "../ProjectForm";
import { ArrowLeft } from "@/components/icons";

export default function NewProjectPage() {
  async function handleCreate(data: ProjectFormData) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error?.formErrors?.[0] ?? json.error ?? "Failed to create project" };
    return {};
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-2xl mx-auto">
      <div className="mb-8 pb-6 border-b border-cream/10">
        <Link
          href="/admin/projects"
          className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} className="shrink-0" />
          <span>Projects</span>
        </Link>
        <h1 className="font-accent text-amber text-3xl sm:text-4xl font-bold tracking-wide mt-3">New Project</h1>
        <p className="font-body text-cream/40 text-sm mt-1.5">Fill in the sections below — only required fields are marked.</p>
      </div>
      <ProjectForm onSubmit={handleCreate} submitLabel="Create project" />
    </div>
  );
}
