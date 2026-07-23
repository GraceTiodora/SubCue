"use client";

import { useEffect, useState } from "react";

interface SubData {
  score: number;
  status: string;
  monthly_spending: number;
  potential_saving: number;
  recommendations: string[];
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<SubData | null>(null);

  useEffect(() => {
    // In MVP, we might mock this if backend is not running yet
    // but let's try to fetch from FastAPI
    fetch("http://127.0.0.1:8000/api/health-score")
      .then((res) => res.json())
      .then((data) => {
        setHealthData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // Fallback Mock Data for demo purposes if backend offline
        setHealthData({
          score: 83,
          status: "Healthy",
          monthly_spending: 785000,
          potential_saving: 265000,
          recommendations: [
            "Consider cancelling Canva Pro due to low usage.",
            "Your ChatGPT Plus subscription is well utilized."
          ]
        });
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 lg:p-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SubWise <span className="gradient-text">AI</span></h1>
          <p className="text-muted-foreground mt-1">Smarter subscriptions. Healthier spending.</p>
        </div>
        <button className="bg-primary hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          + Add Subscription
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">AI is analyzing your spending...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Health Score Card */}
          <div className="col-span-1 md:col-span-2 glass-panel p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
            <h2 className="text-lg font-medium text-muted-foreground mb-6">Subscription Health</h2>
            
            <div className="flex items-end gap-6 mb-8">
              <span className="text-7xl font-bold text-foreground">
                {healthData?.score}
              </span>
              <div className="pb-2">
                <span className="text-xl font-medium text-muted-foreground">/ 100</span>
                <div className="flex items-center gap-2 mt-1 text-success">
                  <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_#10b981]"></div>
                  <span className="font-medium">{healthData?.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Spending</p>
                <p className="text-2xl font-semibold">Rp{healthData?.monthly_spending.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Potential Saving</p>
                <p className="text-2xl font-semibold text-success">Rp{healthData?.potential_saving.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="col-span-1 glass-panel p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                ✨
              </div>
              <h2 className="text-lg font-semibold">AI Insights</h2>
            </div>
            
            <div className="flex-1 space-y-4">
              {healthData?.recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-card border border-border/50 text-sm leading-relaxed">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions List placeholder */}
      <div className="mt-12 glass-panel p-6">
        <h2 className="text-lg font-semibold mb-6">Active Subscriptions</h2>
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
           <p className="text-muted-foreground">List will be populated here.</p>
        </div>
      </div>
    </main>
  );
}
