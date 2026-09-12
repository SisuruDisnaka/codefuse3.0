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
  { name: "Easara Kulindu", role: "Quiz Master", photo: "/organizers/easara.jpeg", linkedin: "https://www.linkedin.com/in/easara-kulindu-de-silva-a953b7365", github: "https://github.com/easarakulindu"},
  { name: "Akila Omal", role: "Web Master", photo:"/organizers/akila.jpeg" ,linkedin:"https://www.linkedin.com/in/akila-omal-a0a115353", github:"https://github.com/AkilaOmal"  },
  { name: "Sasun Nethsilu", role: "Quiz Coordinator", photo:"/organizers/sasun.jpeg", linkedin:"https://www.linkedin.com/in/sasun-nethsilu-27a41a201", github:"https://github.com/SasunNethsilu" },
  { name: "Thisal Methwidu", role: "Quiz Coordinator", photo: "/organizers/thisal.jpeg", linkedin: "https://www.linkedin.com/in/thisal000", github: "https://github.com/ThisalMethwidu"},
];
