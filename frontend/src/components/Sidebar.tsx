"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, BarChart2, Settings, Moon, Sun } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check local storage for theme preference
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.add("light-mode");
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

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Langganan", href: "/langganan", icon: <CreditCard className="w-4 h-4" /> },
    { name: "Analitik", href: "/analitik", icon: <BarChart2 className="w-4 h-4" /> },
    { name: "Pengaturan", href: "/pengaturan", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border h-screen flex flex-col hidden md:flex flex-shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="font-extrabold text-sm">S</span>
          </div>
          SubCue <span className="text-primary font-normal">AI</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? "bg-card/80 text-primary border border-border/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              {item.icon}
              <span className={`text-sm ${isActive ? "font-medium" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border/50">
        <div 
          className="p-4 flex items-center justify-between border-t border-border/50 cursor-pointer hover:bg-card/50 transition-colors" 
          onClick={toggleTheme}
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>{isDarkMode ? "Mode Gelap" : "Mode Terang"}</span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-border'}`}>
            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center font-bold text-sm border border-border">
            G
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Grace</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
