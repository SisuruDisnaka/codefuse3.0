export interface TeamMemberInput {
  memberNumber: 1 | 2 | 3;
  fullName: string;
  registrationNumber: string;
  email: string;
  whatsappNumber: string;
}

export interface RegistrationInput {
  teamName: string;
  teamSize: 1 | 2 | 3;
  teamEmail: string;
  teamWhatsapp: string;
  hackerrankTeamName: string;
  githubUrl?: string;
  additionalInformation?: string;
  members: TeamMemberInput[];
}

export interface RegistrationSuccess {
  success: true;
  registrationCode: string;
}

export interface RegistrationFailure {
  success: false;
  message: string;
  fieldErrors?: Record<string, string>;
}

export type RegistrationResponse = RegistrationSuccess | RegistrationFailure;
