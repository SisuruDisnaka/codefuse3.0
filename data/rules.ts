export interface RuleSection {
  id: string;
  title: string;
  items: string[];
}

// Structured from the CODEFUSE 2.0 guidelines, reorganized for 3.0.
// Organizers can edit this file directly to update published rules.
export const rules: RuleSection[] = [
  {
    id: "registration",
    title: "Registration Guidelines",
    items: [
      "Open exclusively to students of the Faculty of Computing, University of Sri Jayewardenepura.",
      "Teams may have between 1 and 3 members.",
      "The team leader is responsible for completing the registration form.",
      "The registered team name should match the team's official HackerRank handle once created.",
    ],
  },
  {
    id: "team",
    title: "Team Guidelines",
    items: [
      "Each participant may belong to only one team.",
      "Team composition cannot be changed after registration closes.",
      "The team leader is the primary point of contact for all competition communications.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    items: [
      "Open to all currently registered students of the Faculty of Computing.",
      "Participants from any batch/academic year may form or join a team.",
    ],
  },
  {
    id: "hackerrank",
    title: "HackerRank Guidelines",
    items: [
      "The team leader creates a single HackerRank account for the entire team.",
      "Sign up at hackerrank.com using an email address — do not use Google, Facebook, or GitHub sign-in.",
      "Under Settings > Personal Information, set the HackerRank username to the team's official registered name.",
      "Share the account credentials securely with all team members.",
      "Only one account per team may join the contest — do not create duplicate accounts.",
    ],
  },
  {
    id: "competition",
    title: "Competition Rules",
    items: [
      "The competition runs as a timed online round on the HackerRank platform.",
      "All team members may collaborate on solutions during the contest window.",
      "Use of unauthorized external assistance is not permitted; see the Code of Conduct.",
    ],
  },
  {
    id: "submission",
    title: "Submission Rules",
    items: [
      "Submissions are made directly through the HackerRank contest interface.",
      "Only submissions made before the contest deadline will be scored.",
      "Rankings are determined by problem-solving accuracy, speed, and overall score.",
    ],
  },
  {
    id: "conduct",
    title: "Code of Conduct",
    items: [
      "Plagiarism, account sharing across teams, or impersonation results in disqualification.",
      "Participants are expected to engage respectfully with organizers and fellow competitors.",
      "Organizer decisions on scoring and disputes are final.",
    ],
  },
];
