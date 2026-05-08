import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Speckit",
  description: "Design-system driven project scaffold"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
