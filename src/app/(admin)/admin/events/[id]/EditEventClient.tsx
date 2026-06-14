"use client";

import EventForm, {
  type EventSubmitPayload,
  type EventFormData,
} from "../EventForm";

interface Props {
  event: {
    id: string;
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
    imageUrl: string | null;
    createdAt: string;
  };
  partners: { id: string; name: string }[];
}

export default function EditEventClient({ event, partners }: Props) {
  // Format ISO date string into datetime-local value format: YYYY-MM-DDTHH:MM
  const formatToDateTimeLocal = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const initial: EventFormData = {
    slug: event.slug,
    title: event.title,
    description: event.description,
    category: event.category,
    type: event.type,
    priceKes: String(event.priceKes),
    capacity: event.capacity !== null && event.capacity !== undefined ? String(event.capacity) : "",
    startsAt: formatToDateTimeLocal(event.startsAt),
    location: event.location,
    status: event.status,
    ownerType: event.ownerType,
    partnerId: event.partnerId ?? "",
    commissionRate: String(event.commissionRate),
    imageUrl: event.imageUrl ?? "",
  };

  async function handleUpdate(data: EventSubmitPayload) {
    const res = await fetch(`/api/events/admin/${event.id}`, {
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
      return { error: json.error ?? "Failed to update event" };
    }
    return {};
  }

  async function handleDelete() {
    const res = await fetch(`/api/events/admin/${event.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? "Failed to delete event");
    }
  }

  return (
    <EventForm
      partners={partners}
      initial={initial}
      onSubmit={handleUpdate}
      submitLabel="Save Changes"
      onDelete={handleDelete}
      isEdit
    />
  );
}
