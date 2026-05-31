import { AboutData } from "../types";

export const getAboutData = async (): Promise<AboutData> => {
  const fileId = process.env.GOOGLE_DRIVE_FILE_ID!;
  const res = await fetch(
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    {
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch resume data");
  return res.json();
};
