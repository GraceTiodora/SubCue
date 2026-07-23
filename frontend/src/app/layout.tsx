import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubCue AI | Smart Subscription Manager",
  description: "AI Financial Wellness for Digital Subscriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
