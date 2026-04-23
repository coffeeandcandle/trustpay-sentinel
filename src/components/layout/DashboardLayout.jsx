import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(() => window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
      if (w < 768) setMobileOpen(false);
      if (w >= 768 && w < 1024) setCollapsed(true);
      if (w >= 1024) setCollapsed(false);
    };
    // Set initial collapsed state for tablet
    if (window.innerWidth >= 768 && window.innerWidth < 1024) setCollapsed(true);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const marginLeft = isMobile ? 0 : collapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-card">
      {/* Mobile top bar */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-4 z-40 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src="/logo.png" alt="TrustDepo" className="h-7 object-contain" />
          <span className="text-primary text-[10px] font-semibold tracking-widest uppercase">Admin</span>
        </header>
      )}

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        className="min-h-screen transition-all duration-300 bg-card"
        style={{
          marginLeft,
          paddingTop: isMobile ? 56 : 0,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
