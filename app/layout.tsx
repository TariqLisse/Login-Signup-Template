import type { Metadata } from "next";
import { Orbitron, Press_Start_2P, Audiowide } from "next/font/google";
import "./globals.css";

// Load retro fonts
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press" });
const audiowide = Audiowide({ weight: "400", subsets: ["latin"], variable: "--font-audio" });

export const metadata: Metadata = {
  title: "EGOBAR",
  description: "Express. Grow. Build",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${pressStart.variable} ${audiowide.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
