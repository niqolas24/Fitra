import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fitra — AI Application Copilot",
  description:
    "Upload your resume, paste any job description, and get fit scores, keywords, ATS checks, and tailored suggestions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${sans.variable}`}>
      <body className={`${sans.className} h-full min-h-screen bg-[var(--background)] text-[var(--foreground)]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
