export interface Organizer {
  name: string;
  role: string;
  photo?: string;
  linkedin?: string;
  github?: string;
}

// Replace with the official CODEFUSE 3.0 committee once confirmed.
// Structure kept consistent with prior editions (chair, quiz master, web master, coordinators).
export const organizers: Organizer[] = [
  { name: "TBA", role: "Chair-Person" },
  { name: "TBA", role: "Quiz Master" },
  { name: "TBA", role: "Web Master" },
  { name: "TBA", role: "Quiz Coordinator" },
  { name: "TBA", role: "Quiz Coordinator" },
];
