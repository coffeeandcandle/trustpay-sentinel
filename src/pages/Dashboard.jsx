import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

import { Users, AlertTriangle, TrendingUp, ArrowLeftRight, Wallet } from "lucide-react";
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
    queryFn: async () => {
      const res = await base44.functions.invoke("getUsers", {});
      return res.data.users || [];
    },
    initialData: [],
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions-count"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 500),
    initialData: [],
  });

  const openDisputes = disputes.filter(d => d.status === "open" || d.status === "under_review").length;
  const pendingTx = transactions.filter(t => t.status === "pending" || t.status === "sender_ok").length;
  const totalVolume = transactions.reduce((s, t) => s + (t.amount || 0), 0);

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
        <StatCard title="Total Volume" value={`AED ${(totalVolume / 1000).toFixed(0)}k`} change="8.2%" changeType="up" icon={Wallet} />
        <StatCard title="Open Disputes" value={openDisputes} change="3.1%" changeType="down" icon={AlertTriangle} iconBg="bg-amber-500/10" />
        <StatCard title="Pending Escrows" value={pendingTx} change="5.4%" changeType="up" icon={ArrowLeftRight} />
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