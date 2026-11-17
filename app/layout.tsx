import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sleuthiverse — A Universe of Clues",
  description: "A gathering place for mystery readers, puzzle solvers and curious minds.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}