"use client";

import SubscriptionList from "@/components/SubscriptionList";
import { Plus } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="p-8">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Langganan</h1>
          <p className="text-muted-foreground">Kelola semua langganan aktif, hentikan yang tidak perlu,<br/>dan catat yang baru.</p>
        </div>
        <button 
          onClick={() => window.dispatchEvent(new Event('trigger-add-form'))}
          className="bg-primary hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)]"
        >
          <Plus className="w-4 h-4" /> Tambah Langganan
        </button>
      </header>

      <SubscriptionList />
    </div>
  );
}
