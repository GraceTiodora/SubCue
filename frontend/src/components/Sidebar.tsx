"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, BarChart2, Settings, Moon, Sun } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("Pengguna");

  useEffect(() => {
    // Check authentication
    const userId = localStorage.getItem("user_id");
    if (!userId && pathname !== "/login") {
      router.push("/login");
      return;
    }
    // Load username
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }

    const handleStorageChange = () => {
      const name = localStorage.getItem("username");
      if (name) setUsername(name);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (pathname === "/login") return null;

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Langganan", href: "/langganan", icon: <CreditCard className="w-4 h-4" /> },
    { name: "Analitik", href: "/analitik", icon: <BarChart2 className="w-4 h-4" /> },
    { name: "Pengaturan", href: "/pengaturan", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border/50 flex flex-col justify-between h-screen">
      <div>
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SubCue <span className="text-primary">AI</span></span>
        </div>
        
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              href={item.href} 
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.href 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium truncate">{username}</h4>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
