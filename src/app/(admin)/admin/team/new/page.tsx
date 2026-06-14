"use client";

import Link from "next/link";
import TeamForm, { type TeamMemberSubmitPayload } from "../TeamForm";

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
      <div className="mb-8">
        <Link href="/admin/team" className="font-body text-cream/40 text-sm hover:text-cream/60 transition-colors">
          ← Executive Team
        </Link>
        <h1 className="font-display text-2xl font-bold text-cream mt-3">New Team Member</h1>
        <p className="font-body text-cream/40 text-sm mt-1">Fill in the sections below to add a member to the club leadership.</p>
      </div>
      <TeamForm onSubmit={handleCreate} submitLabel="Create Profile" />
    </div>
  );
}
