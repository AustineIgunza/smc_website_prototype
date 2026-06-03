"use client";

import ProjectForm, { type ProjectFormData } from "../ProjectForm";

interface Props {
  project: {
    id: string;
    slug: string;
    title: string;
    category: string;
    clientName: string | null;
    desc: string;
    problem: string;
    approach: string;
    outcome: string;
    metrics: string[];
    tags: string[];
    team: string[];
    duration: string;
    status: "DRAFT" | "PUBLISHED";
    featured: boolean;
    coverImageUrl: string | null;
    liveUrl: string | null;
    testimonial: string | null;
    testimonialAuthor: string | null;
  };
}

export default function EditProjectClient({ project }: Props) {
  const initial: ProjectFormData = {
    slug: project.slug,
    title: project.title,
    category: project.category,
    clientName: project.clientName ?? "",
    desc: project.desc,
    problem: project.problem,
    approach: project.approach,
    outcome: project.outcome,
    metrics: (project.metrics ?? []).join(", "),
    tags: (project.tags ?? []).join(", "),
    team: (project.team ?? []).join(", "),
    duration: project.duration,
    status: project.status,
    featured: project.featured,
    coverImageUrl: project.coverImageUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    testimonial: project.testimonial ?? "",
    testimonialAuthor: project.testimonialAuthor ?? "",
  };

  async function handleUpdate(data: ProjectFormData) {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error?.formErrors?.[0] ?? json.error ?? "Failed to update project" };
    return {};
  }

  async function handleDelete() {
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
  }

  return (
    <ProjectForm
      initial={initial}
      onSubmit={handleUpdate}
      submitLabel="Save changes"
      onDelete={handleDelete}
      isEdit
    />
  );
}
