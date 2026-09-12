export interface RoadmapMilestone {
  order: string;
  title: string;
  description: string;
  date: string;
}

// Dates pull from eventConfig so there is a single source of truth.
import { eventConfig } from "./event";

export const roadmap: RoadmapMilestone[] = [
  {
    order: "01",
    title: "Registration Open",
    description:
      "Open to every eligible student in the Faculty of Computing. Sign up solo or as a team of up to three and stake your claim on the web.",
    date: eventConfig.dates.registrationOpens,
  },
  {
    order: "02",
    title: "Registration Closed",
    description:
      "The entry point seals shut. Teams are locked in and the roster is finalized as the web settles into place.",
    date: eventConfig.dates.registrationCloses,
  },
  {
    order: "03",
    title: "Awareness Session",
    description:
      "A guided briefing covering the platform, format, and rules — everyone spins up ready and clear on what's ahead.",
    date: "TBA",
  },
  {
    order: "04",
    title: "Hackathon Day",
    description:
      "The main event. Teams solve, submit, and battle in real time as the strongest threads rise to the top of the web.",
    date: eventConfig.dates.competitionDay,
  },
  {
    order: "05",
    title: "Winners Announcement",
    description:
      "Top performers are recognized based on accuracy, speed, and overall score as the web's champions are revealed.",
    date: eventConfig.dates.winnersAnnouncement,
  },
];
