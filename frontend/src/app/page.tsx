"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Activity, Wallet, Bell, Plus } from "lucide-react";
import SubscriptionList from "../components/SubscriptionList";

interface SubData {
  score: number;
  status: string;
  monthly_spending: number;
  potential_saving: number;
  recommendations: string[];
}

export default function Dashboard() {
  const [healthData, setHealthData] = useState<SubData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/health-score")
      .then(res => res.json())
      .then(data => {
        setHealthData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setHealthData({
          score: 0,
          status: "Error",
          monthly_spending: 0,
          potential_saving: 0,
          recommendations: ["Gagal memuat data."]
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHealthData();

    // Listen to updates from SubscriptionList
    window.addEventListener('subscription-updated', fetchHealthData);
    return () => window.removeEventListener('subscription-updated', fetchHealthData);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Column */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <header className="flex justify-between items-start mb-8">
          <div>
            <p className="text-muted-foreground text-sm mb-1 flex items-center gap-1">
              Selamat datang kembali, Grace! <span className="text-lg">👋</span>
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Kecerdasan Langganan</h1>
            <p className="text-muted-foreground">Kelola, analisis, dan optimalkan seluruh langganan Anda di satu tempat.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-card transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center font-bold text-sm cursor-pointer">
              G
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">AI sedang menganalisis pengeluaran Anda...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Health Score Card */}
            <div className="glass-panel p-6 flex flex-col">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Kesehatan Langganan
              </h2>
              
              <div className="flex items-end gap-6 mb-8">
                <span className="text-7xl font-bold tracking-tight">
                  {healthData?.score || 0}
                </span>
                <div className="mb-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${(healthData?.score || 0) > 70 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {healthData?.status || "Unknown"}
                  </span>
                  <p className="text-success text-sm font-medium flex items-center gap-1">
                    ↑ 3 poin bulan ini
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-6 mt-auto">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pengeluaran Bulanan</p>
                  <p className="text-xl font-bold">Rp{healthData?.monthly_spending?.toLocaleString('id-ID') || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Anggaran</p>
                  <p className="text-xl font-bold">Rp1.500.000</p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Penggunaan Anggaran</span>
                  <span className="text-muted-foreground font-medium">{Math.round(((healthData?.monthly_spending || 0) / 1500000) * 100)}% terpakai</span>
                </div>
                <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${(healthData?.monthly_spending || 0) > 1500000 ? 'bg-danger' : (healthData?.monthly_spending || 0) > 1000000 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${Math.min(((healthData?.monthly_spending || 0) / 1500000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="glass-panel p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Insights</h2>
              </div>
              
              <div className="flex-1 space-y-4">
                {healthData?.recommendations?.map((rec, i) => (
                  <div key={i} className="flex gap-3 text-sm text-foreground/90 leading-relaxed items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p>{rec}</p>
                  </div>
                ))}
                {healthData?.potential_saving ? (
                  <div className="flex gap-3 text-sm text-foreground/90 leading-relaxed items-start mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p>
                      Potensi hemat bulanan: <br/>
                      <span className="text-success font-semibold text-base block mt-1">Rp{healthData.potential_saving.toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                ) : null}
              </div>
              
              <button className="w-full mt-6 py-3 border border-border/50 rounded-lg text-sm text-muted-foreground hover:bg-card hover:text-foreground transition-colors flex items-center justify-between px-4">
                Lihat Semua Insight
                <span className="text-lg">›</span>
              </button>
            </div>
          </div>
        )}

        <SubscriptionList readonly={true} />
      </main>
    </div>
  );
}
