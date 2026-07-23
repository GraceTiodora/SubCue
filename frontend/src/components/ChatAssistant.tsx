"use client";

import { useState } from "react";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setHistory([...history, { role: 'user', content: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setHistory(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'ai', content: "Failed to connect to AI server." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center text-2xl hover:bg-indigo-500 transition-all z-50"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="p-4 bg-background border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="text-primary">✨</span> SubWise AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {history.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                Tanyakan tentang langganan Anda, misal: <br/>
                "Gimana caranya hemat Rp 200.000 bulan ini?"
              </div>
            )}
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-background border border-border rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border p-3 rounded-xl rounded-bl-none flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-background border-t border-border flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik sesuatu..." 
              className="flex-1 bg-card border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button type="submit" disabled={loading} className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50">
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}
