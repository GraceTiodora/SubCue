"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, LineChart, Clock, CalendarDays } from "lucide-react";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("Pengguna");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleSend = async (e?: React.FormEvent, presetMessage?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetMessage || message;
    if (!textToSend.trim()) return;

    setHistory(prev => [...prev, {role: 'user', content: textToSend}]);
    setMessage("");
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id") || "default";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      setHistory(prev => [...prev, {role: 'ai', content: data.reply || "Maaf, ada kesalahan koneksi."}]);
    } catch (err) {
      setHistory(prev => [...prev, {role: 'ai', content: "Server AI sedang sibuk atau mati. Coba lagi nanti."}]);
    }
    setLoading(false);
  };

  const suggestions = [
    { icon: <LineChart className="w-5 h-5 text-primary" />, text: "Gimana caranya hemat lebih banyak?" },
    { icon: <Clock className="w-5 h-5 text-primary" />, text: "Langganan mana yang gak worth it?" },
    { icon: <CalendarDays className="w-5 h-5 text-primary" />, text: "Rencanakan anggaran bulan depan" }
  ];

  return (
    <>
      {/* Floating Action Button (Shows when closed) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-500 hover:scale-105 transition-all z-40"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Slide-in Chat Panel */}
      <div 
        className={`fixed top-0 right-0 h-screen w-96 bg-background border-l border-border/50 shadow-2xl flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-card">
          <h3 className="font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> SubCue AI
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground hover:bg-background p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {history.length === 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Hai {username}! 👋</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ada yang bisa saya bantu terkait pengaturan pengeluaran hari ini?
              </p>
            </div>
            
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(undefined, s.text)}
                  className="w-full text-left p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors flex items-center gap-4 group"
                >
                  <div className="p-2 rounded-lg bg-background group-hover:bg-primary/10 transition-colors">
                    {s.icon}
                  </div>
                  <span className="text-sm font-medium">{s.text}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-card border border-border/50 text-foreground rounded-tl-none leading-relaxed'}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <div className="bg-card border border-border/50 rounded-2xl rounded-tl-none p-4 text-sm flex gap-1.5 items-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 pt-2">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tanyakan apa saja..." 
            className="w-full bg-card border border-border/50 hover:border-border focus:border-primary/50 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none transition-colors shadow-sm"
          />
          <button 
            type="submit" 
            disabled={loading || !message.trim()} 
            className="absolute right-2 bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-3">
          Asisten AI dapat membuat kesalahan.
        </p>
      </div>
      </div>
      
      {/* Overlay for mobile/desktop to close when clicking outside */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        ></div>
      )}
    </>
  );
}
