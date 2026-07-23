"use client";

import { useEffect, useState } from "react";

interface Subscription {
  id?: number;
  name: string;
  cost: number;
  billing_cycle: string;
  next_renewal: string;
  category: string;
  usage_level: string;
}

export default function SubscriptionList() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Subscription>({
    name: "", cost: 0, billing_cycle: "monthly", next_renewal: "", category: "Entertainment", usage_level: "high"
  });

  const fetchSubs = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/subscriptions/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSubs(data);
        } else {
          console.error("Expected array but got:", data);
          setSubs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setSubs([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/subscriptions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      setShowAddForm(false);
      fetchSubs(); // refresh list
      // Tell parent to refresh health score in a real app, 
      // but for hackathon we might just reload the window
      window.location.reload();
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id: number) => {
    fetch(`http://127.0.0.1:8000/subscriptions/${id}`, { method: "DELETE" })
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <div className="mt-12 glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Langganan Aktif</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-card hover:bg-border text-sm px-4 py-2 rounded-lg transition-colors border border-border"
        >
          {showAddForm ? "Batal" : "+ Tambah Baru"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-card/50 rounded-xl border border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Nama Layanan</label>
            <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Netflix" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Biaya (Rp)</label>
            <input 
              required 
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" 
              value={formData.cost === 0 ? "" : formData.cost} 
              onChange={e => setFormData({...formData, cost: Number(e.target.value.replace(/\D/g, ''))})} 
              placeholder="e.g. 150000"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Siklus Tagihan</label>
            <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.billing_cycle} onChange={e => setFormData({...formData, billing_cycle: e.target.value})}>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Tagihan Berikutnya</label>
            <input required type="date" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.next_renewal} onChange={e => setFormData({...formData, next_renewal: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Kategori</label>
            <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Entertainment">Entertainment (Netflix, Disney+)</option>
              <option value="Music">Music (Spotify, Apple Music)</option>
              <option value="Productivity">Productivity (Notion, Office)</option>
              <option value="Cloud Storage">Cloud Storage (Google Drive, iCloud)</option>
              <option value="AI Tools">AI Tools (ChatGPT, Claude)</option>
              <option value="Gaming">Gaming (Xbox, PlayStation)</option>
              <option value="Software">Software (Adobe, Figma)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Tingkat Penggunaan</label>
            <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.usage_level} onChange={e => setFormData({...formData, usage_level: e.target.value})}>
              <option value="high">Tinggi (Harian/Mingguan)</option>
              <option value="medium">Sedang (Bulanan)</option>
              <option value="low">Rendah (Jarang)</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-primary hover:bg-indigo-500 text-white py-2 rounded-md transition-colors">
              Simpan Langganan
            </button>
          </div>
        </form>
      )}

      {/* Upcoming Renewals Widget */}
      {!loading && subs.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {subs
            .slice()
            .sort((a, b) => new Date(a.next_renewal).getTime() - new Date(b.next_renewal).getTime())
            .filter(a => new Date(a.next_renewal).getTime() >= new Date().setHours(0,0,0,0))
            .slice(0, 3)
            .map((sub, i) => {
              const daysLeft = Math.ceil((new Date(sub.next_renewal).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">{sub.next_renewal}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${daysLeft <= 3 ? 'text-danger' : daysLeft <= 7 ? 'text-warning' : 'text-success'}`}>
                      {daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}
                    </p>
                    <p className="text-xs text-muted-foreground">Rp {sub.cost.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              );
            })
          }
        </div>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Memuat data langganan...</p>
      ) : subs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
           <p className="text-muted-foreground">Belum ada langganan ditambahkan. Tambahkan satu untuk melihat skor keuangan Anda!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-sm">
                <th className="pb-3 font-medium">Layanan</th>
                <th className="pb-3 font-medium">Biaya</th>
                <th className="pb-3 font-medium">Siklus</th>
                <th className="pb-3 font-medium">Tagihan Berikutnya</th>
                <th className="pb-3 font-medium">Penggunaan</th>
                <th className="pb-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {subs?.map((sub, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-card/30 transition-colors">
                  <td className="py-4 font-medium">{sub.name}</td>
                  <td className="py-4 text-warning">Rp {sub.cost.toLocaleString('id-ID')}</td>
                  <td className="py-4 capitalize">{sub.billing_cycle}</td>
                  <td className="py-4">{sub.next_renewal}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${sub.usage_level === 'high' ? 'bg-success/20 text-success' : sub.usage_level === 'low' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>
                      {sub.usage_level}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => sub.id && handleDelete(sub.id)} className="text-danger hover:text-red-400 text-sm">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
