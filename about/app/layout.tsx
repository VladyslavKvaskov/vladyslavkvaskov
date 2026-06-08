import { cookies } from "next/headers";
import type { Metadata } from "next";
import "./style.css";
import ThemeProviderWrapper from "./providers/theme-provider";
import { DataProvider } from "./providers/data-provider";
import { getAboutData } from "./lib/get-about-data";

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await getAboutData();

  return {
    title: `${data.profile.name} – ${data.profile.title}`,
    description: `${data.profile.title} based in ${data.profile.location}`,
    openGraph: {
      title: data.profile.name,
      description: data.profile.title,
      images: [
        {
          url: `https://drive.google.com/uc?export=view&id=${data.profile.avatar}`,
          alt: `${data.profile.name} avatar`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.profile.name,
      description: data.profile.title,
      images: [
        `https://drive.google.com/uc?export=view&id=${data.profile.avatar}`,
      ],
    },
  };
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const initialMode = themeCookie?.value === "light" ? "light" : "dark";
  const data = await getAboutData();

  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <ThemeProviderWrapper initialMode={initialMode}>
          <DataProvider value={data}>{children}</DataProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
