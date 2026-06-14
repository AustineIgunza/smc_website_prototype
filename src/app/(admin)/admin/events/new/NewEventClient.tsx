"use client";

import EventForm, { type EventSubmitPayload } from "../EventForm";

interface Props {
  partners: { id: string; name: string }[];
}

export default function NewEventClient({ partners }: Props) {
  async function handleCreate(data: EventSubmitPayload) {
    const res = await fetch("/api/events/admin", {
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
      return { error: json.error ?? "Failed to create event" };
    }
    return {};
  }

  return (
    <EventForm partners={partners} onSubmit={handleCreate} submitLabel="Create Event" />
  );
}
