"use client";

import { User, Wallet, ShieldAlert, Info, Trash2, Edit2, Moon, Sun, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [username, setUsername] = useState("Pengguna");
  const [budget, setBudget] = useState("1.500.000");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    const storedBudget = localStorage.getItem("budget");
    if (storedBudget) setBudget(storedBudget);

    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setIsDarkMode(false);
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("username", username);
    setIsEditingProfile(false);
    // Dispatch event so Sidebar updates
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveBudget = () => {
    // Hanya simpan angka
    const numericBudget = budget.replace(/[^0-9]/g, '');
    if (numericBudget) {
      const formattedBudget = Number(numericBudget).toLocaleString('id-ID');
      setBudget(formattedBudget);
      localStorage.setItem("budget", numericBudget);
    }
    setIsEditingBudget(false);
  };


  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleResetData = async () => {
    if (!confirm("Peringatan: Seluruh data langganan di aplikasi akan dihapus secara permanen. Lanjutkan?")) return;
    
    setIsResetting(true);
    try {
      const userId = localStorage.getItem("user_id") || "default";
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/reset`, { 
        method: "DELETE",
        headers: { "x-user-id": userId }
      });
      localStorage.removeItem("username");
      localStorage.removeItem("user_id");
      router.push("/login");
    } catch (e) {
      console.error(e);
      alert("Gagal mereset data.");
      setIsResetting(false);
    }
  };

  return (
    <div className="p-8 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pengaturan</h1>
        <p className="text-muted-foreground">Sesuaikan preferensi akun dan batas anggaran Anda.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Profil</h2>
                <p className="text-sm text-muted-foreground">Informasi akun Anda.</p>
              </div>
            </div>
            <button 
              onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-lg text-sm font-medium transition-colors text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
            >
              <Edit2 className="w-4 h-4" /> {isEditingProfile ? "Simpan Profil" : "Ubah Profil"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Nama Tampilan</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditingProfile} 
                className={`w-full bg-background border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none transition-all ${isEditingProfile ? 'border-primary ring-1 ring-primary/20' : 'border-border/50 opacity-90 cursor-not-allowed'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <input 
                type="text" 
                value={`${username.toLowerCase().replace(/\s+/g, '')}@example.com`} 
                disabled 
                className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground opacity-90 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Budget Preference Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Preferensi Keuangan</h2>
                <p className="text-sm text-muted-foreground">Atur batas anggaran bulanan Anda.</p>
              </div>
            </div>
            <button 
              onClick={() => isEditingBudget ? handleSaveBudget() : setIsEditingBudget(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-lg text-sm font-medium transition-colors text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
            >
              <Edit2 className="w-4 h-4" /> {isEditingBudget ? "Simpan Anggaran" : "Edit Anggaran"}
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Batas Anggaran Bulanan (Rp)</label>
            <input 
              type="text" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              disabled={!isEditingBudget} 
              className={`w-full bg-background border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none transition-all ${isEditingBudget ? 'border-primary ring-1 ring-primary/20' : 'border-border/50 opacity-90 cursor-not-allowed'}`}
            />
          </div>
        </div>

        {/* Appearance Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Tampilan</h2>
                <p className="text-sm text-muted-foreground">Sesuaikan tema aplikasi sesuai kenyamanan Anda.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium">Mode {isDarkMode ? "Gelap" : "Terang"}</p>
                <p className="text-xs text-muted-foreground">Tema aplikasi saat ini</p>
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-border'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-danger/5 dark:bg-[#1a1114] border border-danger/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-danger">Zona Berbahaya</h2>
              <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
          
          <button 
            onClick={handleResetData}
            disabled={isResetting}
            className="flex items-center gap-2 px-5 py-2.5 border border-danger/30 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors disabled:opacity-50 relative z-10 w-fit"
          >
            <Trash2 className="w-4 h-4" /> {isResetting ? "Menghapus..." : "Hapus Semua Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
