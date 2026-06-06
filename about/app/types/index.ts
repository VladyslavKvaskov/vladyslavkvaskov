import { AppName } from "@/enums";

type GoogleDriveFileID = string;

interface Contact {
  name: AppName;
  link: string;
}
interface Social {
  name: AppName;
  link: string;
}

interface Profile {
  name: string;
  title: string;
  email: string;
  shortDescription: string;
  location: string;
  avatar: GoogleDriveFileID;
  background: GoogleDriveFileID;
  contacts: Contact[];
  socials: Social[];
}

export interface Experience {
  companyName: string;
  from: string;
  to: string;
  logo: GoogleDriveFileID;
  linkedInLink: string;
  role: string;
  type: string;
  description: string[];
}

interface Skill {
  name: string;
  logo: GoogleDriveFileID;
  description: string;
}

interface Language {
  title: string;
  progress: number;
  description: string;
}

export interface AboutData {
  profile: Profile;
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
}
