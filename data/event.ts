export type RegistrationStatus = "OPEN" | "CLOSED" | "COMING_SOON";

export const eventConfig = {
  eventName: "CODEFUSE",
  edition: "3.0",
  tagline: "The Web of Code",
  quote: "Where algorithms meet innovation",
  description:
    "CODEFUSE 3.0 is an intra-faculty coding competition organized for students of the Faculty of Computing, University of Sri Jayewardenepura.",
  faculty: "Faculty of Computing",
  university: "University of Sri Jayewardenepura",

  // Update this to control the registration flow site-wide.
  registrationStatus: "OPEN" as RegistrationStatus,

  // Placeholders — replace with official values once confirmed.
  dates: {
    registrationOpens: "TBA",
    registrationCloses: "TBA",
    competitionDay: "TBA",
    winnersAnnouncement: "TBA",
  },
  teamSize: "1–3 members",
  platform: "HackerRank",
  eligibility: "Open to all registered students of the Faculty of Computing",
  mode: "Online",

  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    email: "",
  },
} as const;
