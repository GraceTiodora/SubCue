"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const existingName = localStorage.getItem("username");
    if (existingName) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("username", name.trim());
      if (!localStorage.getItem("user_id")) {
        localStorage.setItem("user_id", crypto.randomUUID());
      }
      // Arahkan ke dashboard dan force reload agar context/komponen klien ter-update
      window.location.href = "/"; 
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">SubCue <span className="text-primary">AI</span></span>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Selamat Datang! 👋</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">
          Masukkan nama Anda untuk mulai mengelola langganan digital dan mengoptimalkan pengeluaran Anda.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Siapa nama Anda?</label>
            <input 
              type="text" 
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Budi Santoso"
              className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            Mulai Sekarang 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-6">
          <Sparkles className="w-3 h-3 text-primary" />
          Didukung oleh Groq Llama-3 AI
        </div>
      </div>
    </div>
  );
}
