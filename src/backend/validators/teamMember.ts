import { z } from "zod";

const commaSeparated = z
  .string()
  .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean));

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  role: z.string().trim().min(2, "Role must be at least 2 characters"),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  course: z.string().trim().min(2, "Course must be at least 2 characters"),
  year: z.string().trim().min(1, "Year is required"),
  bio: z.string().trim().min(10, "Biography must be at least 10 characters"),
  focus: commaSeparated,
  quote: z.string().trim().min(5, "Quote must be at least 5 characters"),
  socials: z.array(
    z.object({
      platform: z.string().trim().min(1),
      handle: z.string().trim().min(1),
    })
  ),
  avatarGradient: z.array(z.string().trim()).length(2, "Avatar gradient must have exactly 2 colors"),
  avatarUrl: z.string().url("Must be a valid URL").nullish().or(z.literal("")),
});

export const teamMemberUpdateSchema = teamMemberSchema.partial();
