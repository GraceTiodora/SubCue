import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import ChatAssistant from "../components/ChatAssistant";

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
    <html lang="en">
      <body className="antialiased bg-background text-foreground min-h-screen flex">
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>
        <ChatAssistant />
      </body>
    </html>
  );
}
