type GoogleDriveFileID = string;

interface Profile {
  name: string;
  title: string;
  location: string;
  avatar: GoogleDriveFileID;
  background: GoogleDriveFileID;
  hireLink: string;
}

interface Experience {
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
