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
  { name: "Sisuru D. Samarathunga", role: "Chair-Person", photo: "/organizers/sisuru.jpg", linkedin: "https://www.linkedin.com/in/sisuru-disnaka-samarathunga-90b9602b1", github: "https://github.com/SisuruDisnaka"},
  { name: "Easara Kulindu", role: "Quiz Master", photo: "/public/organizers/easara.jpg", linkedin: "https://www.linkedin.com/in/easara-kulindu-90b9602b1", github: "https://github.com/EasaraKulindu"},
  { name: "TBA", role: "Web Master" },
  { name: "TBA", role: "Quiz Coordinator" },
  { name: "Thisal Methwidu", role: "Quiz Coordinator", photo: "/organizers/thisal.jpeg", linkedin: "https://www.linkedin.com/in/thisal000", github: "https://github.com/ThisalMethwidu"},
];
