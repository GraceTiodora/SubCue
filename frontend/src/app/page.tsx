"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [showNotif, setShowNotif] = useState(false);
  const [username, setUsername] = useState("Pengguna");
  const [upcomingBill, setUpcomingBill] = useState<{name: string, cost: number} | null>(null);
  const router = useRouter();

  const fetchHealthData = () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id") || "default";
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/health-score`, {
      headers: {
        "x-user-id": userId
      }
    })
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

    // Ambil data langganan untuk notifikasi dinamis
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/subscriptions/`, {
      headers: { "x-user-id": userId }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Ambil langganan pertama sebagai contoh tagihan terdekat
          setUpcomingBill({ name: data[0].name, cost: data[0].cost });
        } else {
          setUpcomingBill(null);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    fetchHealthData();

    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

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
              Selamat datang kembali, {username}! <span className="text-lg">👋</span>
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Kecerdasan Langganan</h1>
            <p className="text-muted-foreground">Kelola, analisis, dan optimalkan seluruh langganan Anda di satu tempat.</p>
          </div>
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowNotif(!showNotif)} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-card transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            
            {showNotif && (
              <div className="absolute top-12 right-12 w-72 bg-card border border-border/50 rounded-xl shadow-lg p-4 z-50">
                <h4 className="font-semibold text-sm mb-3">Notifikasi</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 text-sm border-b border-border/50 pb-3">
                    <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      {upcomingBill ? (
                        <>
                          <p className="font-medium">Tagihan Hampir Tiba</p>
                          <p className="text-muted-foreground text-xs mt-0.5">{upcomingBill.name} (Rp {upcomingBill.cost.toLocaleString('id-ID')}) akan ditagih dalam waktu dekat.</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Semua Aman!</p>
                          <p className="text-muted-foreground text-xs mt-0.5">Belum ada tagihan langganan dalam waktu dekat.</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Sistem Pemantauan Aktif</p>
                      <p className="text-muted-foreground text-xs mt-0.5">AI terus memantau efisiensi pengeluaran Anda.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center font-bold text-sm cursor-pointer">
              {username.charAt(0).toUpperCase()}
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
            <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Skor Efisiensi</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Skor 0-100 mengukur seberapa optimal Anda memanfaatkan langganan yang dibayar.</p>
              
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8 mt-2 justify-center">
                
                {/* Circular Gauge SVG */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" fill="none" className="stroke-border" strokeWidth="10" />
                    {/* Foreground circle */}
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      className={`transition-all duration-1000 ease-out ${(healthData?.score || 0) > 70 ? 'stroke-success' : (healthData?.score || 0) > 40 ? 'stroke-warning' : 'stroke-danger'}`} 
                      strokeWidth="10" strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * (healthData?.score || 0)) / 100}
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold tracking-tighter">
                      {healthData?.score || 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-2 ${(healthData?.score || 0) > 70 ? 'bg-success/10 text-success' : (healthData?.score || 0) > 40 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                    {healthData?.status || "Belum Ada Data"}
                  </span>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mt-2">
                    Skor dinilai oleh AI
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
