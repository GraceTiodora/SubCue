"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, BarChart2, Settings, Moon, Sun } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [username, setUsername] = useState("Pengguna");

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.add("light-mode");
    }

    // Load username
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

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
        <div className="p-4 px-8 mb-2">
          <button 
            className="w-full flex items-center justify-between"
            onClick={toggleTheme}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{isDarkMode ? "Mode Gelap" : "Mode Terang"}</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-border'}`}>
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </button>
        </div>
        
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium truncate">{username}</h4>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
