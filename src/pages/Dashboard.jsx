import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setAdminUser).catch(() => {});
  }, []);

  const { data: disputes } = useQuery({
    queryKey: ["disputes-count"],
    queryFn: () => base44.entities.Dispute.list(),
    initialData: [],
  });

  const { data: users } = useQuery({
    queryKey: ["users-count"],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const openDisputes = disputes.filter(d => d.status === "open" || d.status === "under_review").length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{adminUser?.full_name ? `, ${adminUser.full_name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with TrustPay today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Users" value={users.length.toLocaleString()} change="12.5%" changeType="up" icon={Users} />
        <StatCard title="Revenue (MTD)" value="$98,420" change="8.2%" changeType="up" icon={DollarSign} />
        <StatCard title="Open Disputes" value={openDisputes} change="3.1%" changeType="down" icon={AlertTriangle} iconBg="bg-amber-500/10" />
        <StatCard title="Transaction Vol." value="2,847" change="15.3%" changeType="up" icon={TrendingUp} />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}