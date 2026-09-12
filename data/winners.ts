export interface WinnerMember {
  name: string;
  photo?: string; // path to a headshot, once supplied
}

export interface WinnerTeam {
  label: string; // e.g. "1st Place", "1st Year Winners"
  rank?: 1 | 2 | 3; // set for overall placement editions; omit for category winners
  teamName: string;
  members: WinnerMember[];
  teamPhoto?: string; // optional group/team photo
}

export interface WinnerEdition {
  edition: string;
  teams: WinnerTeam[];
  poster?: string; // official recap/announcement graphic for this edition
  description?: string; // short recap shown alongside the poster
  fullImage?: string; // one complete winner graphic — takes over the section
                       // display entirely (no per-member cards) when set
  fullImageSize?: { width: number; height: number }; // intrinsic px size of fullImage
}

// Update this file after each edition concludes. List teams in the
// order they should be shown — the first team in an edition is the
// one featured in the homepage preview.
export const winners: WinnerEdition[] = [
  {
    edition: "CODEFUSE 1.0",
    teams: [
      {
        label: "1st Place",
        rank: 1,
        teamName: "Xterminators",
        members: [
          { name: "Heshani Maddage", photo: "/winners/codefuse1-heshani-maddage.jpg" },
          { name: "Vidusahan Perera", photo: "/winners/codefuse1-vidusahan-perera.jpg" },
          { name: "Methuli Mewanya", photo: "/winners/codefuse1-methuli-mewanya.jpg" },
        ],
      },
      {
        label: "2nd Place",
        rank: 2,
        teamName: "TrackX",
        members: [],
      },
      {
        label: "3rd Place",
        rank: 3,
        teamName: "JthonX",
        members: [],
      },
    ],
    poster: "/winners/codefuse1-poster.png",
    description:
      "Our inaugural edition brought together 40+ participants, including both solo coders and teams. It marked the beginning of a vibrant culture of coding, creativity, and friendly competition. Join us as CODEFUSE 2.0 continues the journey of innovation and excellence!",
  },
  {
    edition: "CODEFUSE 2.0",
    teams: [
      {
        label: "1st Year Winners",
        teamName: "Team Logora",
        members: [
          { name: "Raihan Muieen" },
          { name: "Sisuru Samarathunga" },
          { name: "Kulindu De Silva" },
        ],
      },
      {
        label: "2nd Year Winners",
        teamName: "Team Cypher Sentinals",
        members: [{ name: "Anushka Rodrigo" }, { name: "Tharindu Nimsara" }],
      },
      {
        label: "3rd Year Winners",
        teamName: "Team Debuggers",
        members: [{ name: "Amandi Thathsarani" }, { name: "Chami Dilshika" }],
      },
    ],
    // A complete official winner graphic exists for this edition, so it's
    // shown as one whole image (see WinnerCinematicReveal) instead of the
    // per-member card grid — the `teams` above stay as plain metadata.
    fullImage: "/winners/codefuse2-winners-full.png",
    fullImageSize: { width: 1050, height: 582 },
  },
  {
    edition: "CODEFUSE 3.0",
    teams: [
      // Populated after the competition concludes.
    ],
  },
];
