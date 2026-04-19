import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-card">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <main
        className="min-h-screen transition-all duration-300 bg-card"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        <Outlet />
      </main>
    </div>
  );
}
