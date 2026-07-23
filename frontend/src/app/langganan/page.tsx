"use client";

import SubscriptionList from "@/components/SubscriptionList";
import { Plus } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Langganan</h1>
          <p className="text-muted-foreground">Kelola semua langganan aktif, hentikan yang tidak perlu, dan catat yang baru.</p>
        </div>
      </header>

      <SubscriptionList />
    </div>
  );
}
