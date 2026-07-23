"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, CalendarDays } from "lucide-react";

// Helper function to generate GCal URL for H-3
const getGcalUrl = (name: string, cost: number, next_renewal: string) => {
  if (!next_renewal) return "#";
  const d = new Date(next_renewal);
  d.setDate(d.getDate() - 3);
  const reminderDateStr = d.toISOString().split('T')[0].replace(/-/g, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pengingat+Tagihan+${encodeURIComponent(name)}+%28H-3%29&dates=${reminderDateStr}T090000Z/${reminderDateStr}T100000Z&details=Pengingat+otomatis+SubWise+AI+untuk+tagihan+${encodeURIComponent(name)}+sebesar+Rp${cost.toLocaleString('id-ID')}+pada+tanggal+${next_renewal}`;
};

interface Subscription {
  id?: number;
  name: string;
  cost: number;
  billing_cycle: string;
  start_date: string;
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
    name: "", cost: 0, billing_cycle: "monthly", start_date: "", next_renewal: "", category: "Entertainment", usage_level: "high"
  });
  const [addToCalendar, setAddToCalendar] = useState(true);

  const fetchSubs = () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id") || "default";
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/subscriptions/`, {
      headers: { "x-user-id": userId }
    })
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
    const userId = localStorage.getItem("user_id") || "default";
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/subscriptions/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      setShowAddForm(false);
      fetchSubs(); // refresh list
      
      // Dispatch custom event to notify Dashboard to refresh health score
      window.dispatchEvent(new Event('subscription-updated'));

      // If user checked add to calendar, open the link
      if (addToCalendar && formData.name && formData.next_renewal) {
        const gcalUrl = getGcalUrl(formData.name, formData.cost, formData.next_renewal);
        window.open(gcalUrl, '_blank');
      }
      
      // Reset form
      setFormData({name: "", cost: 0, billing_cycle: "monthly", start_date: "", next_renewal: "", category: "Entertainment", usage_level: "high"});
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id: number) => {
    const userId = localStorage.getItem("user_id") || "default";
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/subscriptions/${id}`, { 
      method: "DELETE",
      headers: { "x-user-id": userId }
    })
      .then(() => {
        fetchSubs(); // refresh list
        // Dispatch custom event to notify Dashboard to refresh health score
        window.dispatchEvent(new Event('subscription-updated'));
      });
  };

  return (
    <div className="mt-8">
      {/* Modal Form Tambah Langganan */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">Tambah Langganan Baru</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm text-muted-foreground mb-1">Mulai Berlangganan</label>
                <input required type="date" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.start_date || ""} onChange={e => setFormData({...formData, start_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Tagihan Berikutnya</label>
                <input required type="date" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.next_renewal} onChange={e => setFormData({...formData, next_renewal: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Kategori</label>
                <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Music">Music</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Cloud Storage">Cloud Storage</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Software">Software</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Tingkat Penggunaan</label>
                <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.usage_level} onChange={e => setFormData({...formData, usage_level: e.target.value})}>
                  <option value="high">Tinggi</option>
                  <option value="medium">Sedang</option>
                  <option value="low">Rendah</option>
                </select>
              </div>
              
              <div className="md:col-span-2 mt-2 bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="gcal-sync" 
                  checked={addToCalendar}
                  onChange={e => setAddToCalendar(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-primary text-primary focus:ring-primary/50 cursor-pointer"
                />
                <label htmlFor="gcal-sync" className="text-sm cursor-pointer">
                  <span className="font-semibold text-primary block">Integrasi Google Calendar</span>
                  <span className="text-muted-foreground text-xs">Jadwalkan pengingat secara otomatis saat langganan ini disimpan.</span>
                </label>
              </div>

              <div className="md:col-span-2 mt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="w-full bg-background border border-border hover:bg-border/50 text-foreground py-2.5 rounded-lg transition-colors font-medium">
                  Batal
                </button>
                <button type="submit" className="w-full bg-primary hover:bg-indigo-500 text-white py-2.5 rounded-lg transition-colors shadow-lg font-medium">
                  Simpan Langganan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcoming Renewals Widget */}
      {!loading && subs.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Pengingat Tagihan Terdekat</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subs
            .slice()
            .sort((a, b) => new Date(a.next_renewal).getTime() - new Date(b.next_renewal).getTime())
            .filter(a => new Date(a.next_renewal).getTime() >= new Date().setHours(0,0,0,0))
            .slice(0, 3)
            .map((sub, i) => {
              const daysLeft = Math.ceil((new Date(sub.next_renewal).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const logoUrl = `https://logo.clearbit.com/${sub.name.toLowerCase().replace(/\s/g, '')}.com`;
              
              return (
                <div 
                  key={i} 
                  className="bg-card border border-border/50 rounded-xl p-5 flex items-center justify-between shadow-sm hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center overflow-hidden border border-border/50 group-hover:scale-105 transition-transform">
                      <img src={logoUrl} alt={sub.name} className="w-full h-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + sub.name + '&background=1E212B&color=fff';
                      }} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-foreground flex items-center gap-2">
                        {sub.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {sub.next_renewal}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className={`font-medium ${daysLeft <= 3 ? 'text-danger' : daysLeft <= 7 ? 'text-warning' : 'text-success'}`}>
                      {daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}
                    </p>
                    <p className="text-base font-bold text-foreground mt-0.5">Rp {sub.cost.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              );
            })
          }
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Memuat data langganan...</p>
      ) : subs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
           <p className="text-muted-foreground">Belum ada langganan ditambahkan. Tambahkan satu untuk melihat skor keuangan Anda!</p>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border/50 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Langganan Aktif</h2>
          </div>
          <div className="overflow-x-auto p-2">
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
              {subs?.map((sub, i) => {
                const logoUrl = `https://logo.clearbit.com/${sub.name.toLowerCase().replace(/\s/g, '')}.com`;
                const gcalUrl = getGcalUrl(sub.name, sub.cost, sub.next_renewal);
                
                return (
                <tr key={i} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                  <td className="py-4 px-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background overflow-hidden border border-border/50 flex items-center justify-center">
                      <img src={logoUrl} alt={sub.name} className="w-full h-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + sub.name + '&background=0B0E14&color=fff';
                      }} />
                    </div>
                    {sub.name}
                  </td>
                  <td className="py-4 text-warning">Rp {sub.cost.toLocaleString('id-ID')}</td>
                  <td className="py-4 capitalize">{sub.billing_cycle}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {sub.next_renewal}
                      <a href={gcalUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-indigo-400 p-1 rounded-md hover:bg-primary/10 transition-colors" title="Simpan ke Google Calendar">
                        <CalendarDays className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 text-xs text-muted-foreground border-t border-border/50">
          Menampilkan {subs.length} dari {subs.length} langganan
        </div>
      </div>
      )}
    </div>
  );
}
