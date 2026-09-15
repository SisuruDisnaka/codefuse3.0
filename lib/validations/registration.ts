import { z } from "zod";

const whatsappRegex = /^\+?[0-9]{9,15}$/;
const registrationNumberRegex = /^[A-Za-z0-9/\-]{3,20}$/;
// Stricter than zod's default .email(): requires a real-looking domain with
// a dot + TLD, no leading/trailing dots in the local part, and no
// consecutive dots anywhere. Catches things like "a@b" or "a..b@c.com"
// that would otherwise slip through.
const emailRegex =
  /^(?!.*\.\.)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?!-)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const emailField = (message: string) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(1, message)
    .regex(emailRegex, message);

const whatsappField = z
  .string()
  .trim()
  // Normalize spaces/dashes/parens people naturally type, e.g. "+94 71 234 5678"
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .refine((v) => whatsappRegex.test(v), "Enter a valid WhatsApp number");

export const teamMemberSchema = z.object({
  memberNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  registrationNumber: z
    .string()
    .trim()
    .regex(registrationNumberRegex, "Enter a valid registration number"),
  email: emailField("Enter a valid email address"),
  whatsappNumber: whatsappField,
});

export const registrationSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(3, "Group name must be at least 3 characters")
      .max(60)
      .regex(
        /^[A-Za-z0-9][A-Za-z0-9 _.'-]*$/,
        "Group name can only contain letters, numbers, spaces and . _ ' -"
      ),
    teamSize: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year"], {
      errorMap: () => ({ message: "Select your year of study" }),
    }),
    teamEmail: emailField("Enter a valid team email"),
    teamWhatsapp: whatsappField,
    hackerrankTeamName: z.string().trim().min(2).max(60),
    githubUrl: z
      .string()
      .trim()
      .url("Enter a valid URL")
      .refine((v) => /^https?:\/\/(www\.)?github\.com\//i.test(v), {
        message: "Enter a valid GitHub URL (https://github.com/...)",
      })
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
  )
  .refine(
    (data) => {
      const emails = data.members.map((m) => m.email);
      return new Set(emails).size === emails.length;
    },
    { message: "Each member must use a different email address", path: ["members"] }
  )
  .refine(
    (data) => {
      const numbers = data.members.map((m) => m.whatsappNumber);
      return new Set(numbers).size === numbers.length;
    },
    { message: "Each member must use a different WhatsApp number", path: ["members"] }
  )
  .superRefine((data, ctx) => {
    // Per-member duplicate flags so the exact offending field(s) can be
    // highlighted in the UI, not just the shared "members" array error.
    const regNumberCounts = new Map<string, number>();
    const emailCounts = new Map<string, number>();
    const whatsappCounts = new Map<string, number>();
    for (const m of data.members) {
      const regKey = m.registrationNumber.toLowerCase();
      regNumberCounts.set(regKey, (regNumberCounts.get(regKey) ?? 0) + 1);
      emailCounts.set(m.email, (emailCounts.get(m.email) ?? 0) + 1);
      whatsappCounts.set(
        m.whatsappNumber,
        (whatsappCounts.get(m.whatsappNumber) ?? 0) + 1
      );
    }
    data.members.forEach((m, i) => {
      if ((regNumberCounts.get(m.registrationNumber.toLowerCase()) ?? 0) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "This registration number is already used by another member",
          path: ["members", i, "registrationNumber"],
        });
      }
      if ((emailCounts.get(m.email) ?? 0) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "This email is already used by another member",
          path: ["members", i, "email"],
        });
      }
      if ((whatsappCounts.get(m.whatsappNumber) ?? 0) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "This WhatsApp number is already used by another member",
          path: ["members", i, "whatsappNumber"],
        });
      }
    });
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
