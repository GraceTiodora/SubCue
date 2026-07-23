"use client";

import { useEffect, useState } from "react";
import { PieChart, BarChart } from "lucide-react";

interface Subscription {
  cost: number;
  category: string;
  billing_cycle: string;
}

export default function AnalyticsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/subscriptions/")
      .then(res => res.json())
      .then(data => {
        setSubs(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalMonthly = subs.reduce((acc, sub) => {
    return acc + (sub.billing_cycle === 'monthly' ? sub.cost : sub.cost / 12);
  }, 0);

  const categorySpending = subs.reduce((acc, sub) => {
    const monthlyCost = sub.billing_cycle === 'monthly' ? sub.cost : sub.cost / 12;
    acc[sub.category] = (acc[sub.category] || 0) + monthlyCost;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analitik Pengeluaran</h1>
        <p className="text-muted-foreground">Pahami ke mana uang Anda pergi setiap bulannya.</p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat data analitik...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Distribusi Kategori
            </h2>
            <div className="space-y-4">
              {Object.entries(categorySpending)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{category}</span>
                        <span className="text-muted-foreground">Rp {amount.toLocaleString('id-ID')} ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              {Object.keys(categorySpending).length === 0 && (
                <p className="text-muted-foreground text-sm">Tidak ada data untuk dianalisis.</p>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BarChart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Total Pengeluaran Bulanan</h3>
            <p className="text-4xl font-extrabold text-foreground mb-4">
              Rp {totalMonthly.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Ini adalah estimasi uang yang keluar setiap bulan berdasarkan biaya langganan bulanan dan tahunan Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
