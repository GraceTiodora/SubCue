"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, CalendarDays } from "lucide-react";

interface Subscription {
  id?: number;
  name: string;
  cost: number;
  billing_cycle: string;
  next_renewal: string;
  category: string;
  usage_level: string;
}

interface Props {
  readonly?: boolean;
}

export default function SubscriptionList({ readonly = false }: Props) {
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
    
    // Listen for custom event from Header to open the form
    const handleTriggerForm = () => {
      setShowAddForm(true);
      // Optional: Scroll to the form
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    
    window.addEventListener('trigger-add-form', handleTriggerForm);
    return () => window.removeEventListener('trigger-add-form', handleTriggerForm);
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
      
      // Dispatch custom event to notify Dashboard to refresh health score
      window.dispatchEvent(new Event('subscription-updated'));
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id: number) => {
    fetch(`http://127.0.0.1:8000/subscriptions/${id}`, { method: "DELETE" })
      .then(() => {
        fetchSubs(); // refresh list
        // Dispatch custom event to notify Dashboard to refresh health score
        window.dispatchEvent(new Event('subscription-updated'));
      });
  };

  return (
    <div className="mt-12 glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Langganan Aktif</h2>
        {!readonly && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-indigo-500 text-white text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 font-medium shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            {showAddForm ? "Batal" : <><Plus className="w-4 h-4" /> Tambah Langganan</>}
          </button>
        )}
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
                <div key={i} className="bg-background border border-border/50 rounded-xl p-5 flex items-center justify-between shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.next_renewal}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${daysLeft <= 3 ? 'text-danger' : daysLeft <= 7 ? 'text-warning' : 'text-success'}`}>
                      {daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">Rp {sub.cost.toLocaleString('id-ID')}</p>
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
              <tr className="border-b border-border/50 text-muted-foreground text-sm">
                <th className="pb-4 font-medium uppercase tracking-wider text-xs">Layanan</th>
                <th className="pb-4 font-medium uppercase tracking-wider text-xs">Biaya</th>
                <th className="pb-4 font-medium uppercase tracking-wider text-xs">Siklus</th>
                <th className="pb-4 font-medium uppercase tracking-wider text-xs">Tagihan Berikutnya</th>
                <th className="pb-4 font-medium uppercase tracking-wider text-xs">Penggunaan</th>
                {!readonly && <th className="pb-4 font-medium uppercase tracking-wider text-xs text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {subs?.map((sub, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-card/30 transition-colors">
                  <td className="py-4 font-medium">{sub.name}</td>
                  <td className="py-4 text-warning">Rp {sub.cost.toLocaleString('id-ID')}</td>
                  <td className="py-4 capitalize">{sub.billing_cycle}</td>
                  <td className="py-4">{sub.next_renewal}</td>
                  <td className="py-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${sub.usage_level === 'high' ? 'bg-success/10 text-success border border-success/20' : sub.usage_level === 'low' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                      {sub.usage_level.toUpperCase()}
                    </span>
                  </td>
                  {!readonly && (
                    <td className="py-5 text-right">
                      <button onClick={() => sub.id && handleDelete(sub.id)} className="text-muted-foreground hover:text-danger hover:bg-danger/10 p-2 rounded-lg transition-all" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
