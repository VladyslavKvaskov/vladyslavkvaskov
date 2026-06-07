import { AboutData } from "../types";

const fileId = process.env.GOOGLE_DRIVE_FILE_ID!;
const tag = process.env.TAG;

export const getAboutData = async (): Promise<AboutData> => {
  const res = await fetch(
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    {
      next: {
        revalidate: 60 * 60 * 24 * 30,
        ...(!!tag && { tags: [tag] }),
      },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch resume data");
  return res.json();
};
