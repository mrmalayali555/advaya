import { z } from "zod";

export const complaintSchema = z
  .object({
    anonymous: z.boolean().default(true),
    name: z.string().trim().max(120).optional().or(z.literal("")),
    email: z.string().trim().email().max(160).optional().or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(10, "Please write at least 10 characters.")
      .max(4000, "That's too long (max 4000 characters)."),
  })
  .refine(
    (d) => d.anonymous || (d.name && d.name.length > 0),
    { message: "Name is required for a named complaint.", path: ["name"] }
  );

export type ComplaintInput = z.infer<typeof complaintSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email.").max(160),
  message: z.string().trim().min(10, "Message is too short.").max(4000),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});
