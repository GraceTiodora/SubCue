"use client";

import { Settings2, Shield, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pengaturan</h1>
        <p className="text-muted-foreground">Sesuaikan preferensi akun dan batas anggaran Anda.</p>
      </header>

      <div className="max-w-2xl space-y-6">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Profil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Nama Tampilan</label>
              <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" defaultValue="Grace" disabled />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <input type="email" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" defaultValue="grace@example.com" disabled />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" /> Preferensi Keuangan
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Batas Anggaran Bulanan (Rp)</label>
              <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" defaultValue="1.500.000" disabled />
              <p className="text-xs text-muted-foreground mt-1">*Fitur ubah anggaran dinonaktifkan untuk versi purwarupa.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-danger">
            <Shield className="w-5 h-5" /> Zona Berbahaya
          </h2>
          <button className="bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Hapus Semua Data
          </button>
        </div>
      </div>
    </div>
  );
}
