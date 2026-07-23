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
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground min-h-screen flex">
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>
        {/* Right Sidebar Column for ChatAssistant (Global) */}
        <aside className="w-96 border-l border-border bg-background flex-shrink-0 flex flex-col h-screen">
          <ChatAssistant />
        </aside>
      </body>
    </html>
  );
}
