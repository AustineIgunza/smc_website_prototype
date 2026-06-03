import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
