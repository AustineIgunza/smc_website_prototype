"use client";

import Link from "next/link";
import TeamForm, { type TeamMemberSubmitPayload } from "../TeamForm";
import { ArrowLeft } from "@/components/icons";

export default function NewTeamMemberPage() {
  async function handleCreate(data: TeamMemberSubmitPayload) {
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      if (json.error && typeof json.error === "object") {
        const fieldErrors = json.error.fieldErrors;
        if (fieldErrors) {
          const firstError = Object.values(fieldErrors).flat()[0];
          if (firstError) return { error: String(firstError) };
        }
        const formErrors = json.error.formErrors;
        if (formErrors && formErrors.length > 0) {
          return { error: formErrors[0] };
        }
      }
      return { error: json.error ?? "Failed to create team member" };
    }
    return {};
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 sm:px-10 max-w-2xl mx-auto">
      <div className="mb-8 pb-6 border-b border-cream/10">
        <Link
          href="/admin/team"
          className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} className="shrink-0" />
          <span>Executive Team</span>
        </Link>
        <h1 className="font-accent text-amber text-3xl sm:text-4xl font-bold tracking-wide mt-3">New Team Member</h1>
        <p className="font-body text-cream/40 text-sm mt-1.5">Fill in the sections below to add a member to the club leadership.</p>
      </div>
      <TeamForm onSubmit={handleCreate} submitLabel="Create Profile" />
    </div>
  );
}
