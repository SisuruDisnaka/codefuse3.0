import { z } from "zod";

const whatsappRegex = /^\+?[0-9]{9,15}$/;
const registrationNumberRegex = /^[A-Za-z0-9/\-]{3,20}$/;

export const teamMemberSchema = z.object({
  memberNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  registrationNumber: z
    .string()
    .trim()
    .regex(registrationNumberRegex, "Enter a valid registration number"),
  email: z.string().trim().email("Enter a valid email address"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(whatsappRegex, "Enter a valid WhatsApp number"),
});

export const registrationSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(3, "Group name must be at least 3 characters")
      .max(60),
    teamSize: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    teamEmail: z.string().trim().email("Enter a valid team email"),
    teamWhatsapp: z
      .string()
      .trim()
      .regex(whatsappRegex, "Enter a valid WhatsApp number"),
    hackerrankTeamName: z.string().trim().min(2).max(60),
    githubUrl: z
      .string()
      .trim()
      .url("Enter a valid URL")
      .optional()
      .or(z.literal("")),
    additionalInformation: z.string().trim().max(500).optional().or(z.literal("")),
    members: z.array(teamMemberSchema).min(1).max(3),
  })
  .refine((data) => data.members.length === data.teamSize, {
    message: "Member count must match team size",
    path: ["members"],
  })
  .refine(
    (data) => {
      const ids = data.members.map((m) => m.registrationNumber.toLowerCase());
      return new Set(ids).size === ids.length;
    },
    { message: "Duplicate registration numbers within the same team", path: ["members"] }
  );

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
