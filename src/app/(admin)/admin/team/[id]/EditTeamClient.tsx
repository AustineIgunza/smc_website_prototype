"use client";

import TeamForm, {
  type TeamMemberSubmitPayload,
  type TeamMemberFormData,
} from "../TeamForm";

interface Props {
  member: {
    id: string;
    name: string;
    role: string;
    title: string;
    course: string;
    year: string;
    bio: string;
    focus?: string[];
    quote?: string | null;
    socials?: any;
    avatarGradient: string[];
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export default function EditTeamClient({ member }: Props) {
  const initial: TeamMemberFormData = {
    name: member.name,
    role: member.role,
    title: member.title,
    course: member.course,
    year: member.year,
    bio: member.bio,
    gradientStart: member.avatarGradient?.[0] ?? "#FFA829",
    gradientEnd: member.avatarGradient?.[1] ?? "#CC8802",
    avatarUrl: member.avatarUrl ?? "",
  };

  async function handleUpdate(data: TeamMemberSubmitPayload) {
    const res = await fetch(`/api/team/${member.id}`, {
      method: "PATCH",
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
      return { error: json.error ?? "Failed to update team member" };
    }
    return {};
  }

  async function handleDelete() {
    const res = await fetch(`/api/team/${member.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? "Failed to delete team member");
    }
  }

  return (
    <TeamForm
      initial={initial}
      onSubmit={handleUpdate}
      submitLabel="Save Changes"
      onDelete={handleDelete}
      isEdit
    />
  );
}
