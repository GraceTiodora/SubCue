"use client";

import { useEffect, useState } from "react";
import { PieChart, BarChart, TrendingUp, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Subscription {
  cost: number;
  category: string;
  billing_cycle: string;
  start_date?: string;
}

export default function AnalyticsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'3m' | '6m' | '1y'>('6m');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/subscriptions/`)
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

  // Generate trend data factoring in the subscription start date
  const generateTrendData = (monthsCount: number) => {
    const monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const result = [];
    
    for (let i = monthsCount - 1; i >= 0; i--) {
      let m = currentMonth - i;
      let y = currentYear;
      while (m < 0) {
        m += 12;
        y -= 1;
      }
      
      let monthlyAmount = 0;
      subs.forEach(sub => {
        let isActive = true;
        if (sub.start_date) {
           const startDate = new Date(sub.start_date);
           const startY = startDate.getFullYear();
           const startM = startDate.getMonth();
           
           if (startY > y || (startY === y && startM > m)) {
               isActive = false;
           }
        }
        
        if (isActive) {
           monthlyAmount += sub.billing_cycle === 'monthly' ? sub.cost : sub.cost / 12;
        }
      });
      
      result.push({ month: monthsStr[m], amount: monthlyAmount });
    }
    return result;
  };

  const mockTrendData = generateTrendData(timeFrame === '3m' ? 3 : timeFrame === '6m' ? 6 : 12);

  const formatRupiah = (val: number) => {
    if (val === 0) return "Rp 0";
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="p-8 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analitik Pengeluaran</h1>
        <p className="text-muted-foreground">Pahami ke mana uang Anda pergi setiap bulannya.</p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat data analitik...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-8 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Distribusi Kategori
              </h2>
              <div className="space-y-6">
                {Object.entries(categorySpending)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => {
                    const percentage = totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-foreground">{category}</span>
                          <span className="text-muted-foreground">Rp {amount.toLocaleString('id-ID')} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-1.5 overflow-hidden border border-border/50">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(categorySpending).length === 0 && (
                  <p className="text-muted-foreground text-sm">Tidak ada data untuk dianalisis.</p>
                )}
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Pengeluaran Bulanan</h3>
              <p className="text-5xl font-extrabold text-foreground mb-6">
                Rp {totalMonthly.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ini adalah estimasi uang yang keluar setiap bulan berdasarkan biaya langganan bulanan dan tahunan Anda.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Tren Pengeluaran
              </h2>
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-medium bg-background border border-border/50 px-3 py-1.5 rounded-md hover:bg-border/30 transition-colors"
                >
                  {timeFrame === '3m' ? '3 Bulan Terakhir' : timeFrame === '6m' ? '6 Bulan Terakhir' : '1 Tahun Terakhir'} 
                  <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-1 w-40 bg-card border border-border/50 rounded-md shadow-lg z-20 py-1 overflow-hidden">
                      <button 
                        onClick={() => { setTimeFrame('3m'); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors ${timeFrame === '3m' ? 'text-primary' : 'text-foreground'}`}
                      >
                        3 Bulan Terakhir
                      </button>
                      <button 
                        onClick={() => { setTimeFrame('6m'); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors ${timeFrame === '6m' ? 'text-primary' : 'text-foreground'}`}
                      >
                        6 Bulan Terakhir
                      </button>
                      <button 
                        onClick={() => { setTimeFrame('1y'); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors ${timeFrame === '1y' ? 'text-primary' : 'text-foreground'}`}
                      >
                        1 Tahun Terakhir
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2e3340" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10} 
                  />
                  <YAxis 
                    tickFormatter={formatRupiah} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    width={80} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e212b', borderColor: '#2e3340', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#6366f1' }}
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pengeluaran']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6366f1" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#1e212b' }}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    name="Total Pengeluaran"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
