import type { Metadata } from "next";
import { Mulish, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "block",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Scale — Workshop & Learning Platform",
  description: "Browse workshops, book slots, and access premium video content powered by AI Scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className={`${mulish.className} min-h-full flex flex-col overflow-x-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

