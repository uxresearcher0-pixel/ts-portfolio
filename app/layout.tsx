import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taslima Akter Rumky — UX/UI Designer",
  description: "Taslima Akter Rumky’s UX/UI design portfolio, experience, skills, and education."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
