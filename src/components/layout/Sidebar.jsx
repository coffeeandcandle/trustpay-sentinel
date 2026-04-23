import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart3, FileText, AlertTriangle,
  Bell, MessageCircle, ChevronLeft, ChevronRight, Shield, LogOut,
  Zap, Ticket, Settings, ArrowUpCircle, X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/",             label: "Dashboard",    icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: Zap },
  { path: "/users",        label: "Users",        icon: Users },
  { path: "/analytics",    label: "Analytics",    icon: BarChart3 },
  { path: "/reports",      label: "Reports",      icon: FileText },
  { path: "/disputes",     label: "Disputes",     icon: AlertTriangle },
  { path: "/tickets",      label: "Complaints",   icon: Ticket },
  { path: "/notifications",label: "Notifications",icon: Bell },
  { path: "/chat",         label: "Live Chat",    icon: MessageCircle },
  { path: "/withdrawals",  label: "Withdrawals",  icon: ArrowUpCircle },
  { path: "/audit-logs",   label: "Audit Logs",   icon: Shield },
  { path: "/settings",     label: "Settings",     icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, isMobile, mobileOpen, onMobileClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const showLabels = isMobile || !collapsed;

  const handleNavClick = () => {
    if (isMobile) onMobileClose();
  };

  if (isMobile) {
    return (
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-[280px] bg-sidebar flex flex-col z-50 transition-transform duration-300 border-r border-sidebar-border",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TrustDepo" className="h-8 object-contain" />
            <span className="text-primary text-[10px] font-semibold tracking-widest uppercase">Admin</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-sm")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => { logout(); onMobileClose(); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }

  // Desktop / Tablet sidebar
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar flex flex-col z-50 transition-all duration-300 border-r border-sidebar-border",
      collapsed ? "w-[72px]" : "w-[260px]"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[72px] border-b border-sidebar-border overflow-hidden">
        <img
          src="/logo.png"
          alt="TrustDepo"
          className={cn("object-contain flex-shrink-0 transition-all duration-300", collapsed ? "h-7 w-7" : "h-8")}
        />
        {!collapsed && (
          <span className="text-primary text-[10px] font-semibold tracking-widest uppercase">Admin</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                collapsed && "justify-center",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-sm")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={logout}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
