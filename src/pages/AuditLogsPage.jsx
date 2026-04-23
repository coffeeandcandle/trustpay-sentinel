import React, { useState } from "react";
import adminApi from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShieldCheck, User, AlertTriangle, FileText, Bell, Zap, Ticket, MapPin, Globe } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const actionLabels = {
  // User activity
  user_registered:       "User Registered",
  user_login:            "User Login",
  transaction_created:   "Transaction Created",
  transaction_confirmed: "Transaction Confirmed",
  transaction_cancelled: "Transaction Cancelled",
  dispute_filed:         "Dispute Filed",
  // Admin actions
  user_suspended:        "User Suspended",
  user_banned:           "User Banned",
  user_activated:        "User Activated",
  user_deleted:          "User Deleted",
  kyc_approved:          "KYC Approved",
  kyc_rejected:          "KYC Rejected",
  dispute_resolved:      "Dispute Resolved",
  dispute_rejected:      "Dispute Rejected",
  dispute_under_review:  "Dispute Under Review",
  ticket_resolved:       "Ticket Resolved",
  ticket_closed:         "Ticket Closed",
  notification_sent:     "Notification Sent",
  transaction_flagged:   "Transaction Flagged",
  transaction_unflagged: "Transaction Unflagged",
  report_generated:      "Report Generated",
  other:                 "Other",
};

const severityStyles = {
  low:      "bg-muted text-muted-foreground",
  medium:   "bg-amber-500/10 text-amber-600",
  high:     "bg-orange-500/10 text-orange-600",
  critical: "bg-red-500/10 text-red-500",
};

const targetIcons = {
  user:         User,
  dispute:      AlertTriangle,
  ticket:       Ticket,
  transaction:  Zap,
  notification: Bell,
  report:       FileText,
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => adminApi.getAuditLogs(),
    initialData: [],
    refetchInterval: 30000,
  });

  const filtered = logs.filter(log => {
    const detailsStr = log.details ? JSON.stringify(log.details) : "";
    const matchSearch = !search ||
      log.admin_email?.toLowerCase().includes(search.toLowerCase()) ||
      log.admin_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.target_label?.toLowerCase().includes(search.toLowerCase()) ||
      log.target_id?.toLowerCase().includes(search.toLowerCase()) ||
      detailsStr.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchTarget = targetFilter === "all" || log.target_type === targetFilter;
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchSearch && matchAction && matchTarget && matchSeverity;
  });

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          </div>
          <p className="text-sm text-muted-foreground">Track all user &amp; admin activity for security and compliance</p>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium self-start sm:self-auto">
          {filtered.length} records
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by admin, target, details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Actions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(actionLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={targetFilter} onValueChange={setTargetFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Resources" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="dispute">Dispute</SelectItem>
            <SelectItem value="ticket">Ticket</SelectItem>
            <SelectItem value="transaction">Transaction</SelectItem>
            <SelectItem value="notification">Notification</SelectItem>
            <SelectItem value="report">Report</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Timestamp</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actor</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Action</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Resource</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Target</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Severity</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">IP Address</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Location</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    {Array(9).fill(0).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <ShieldCheck className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No audit logs found</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">User &amp; admin actions will appear here automatically</p>
                  </td>
                </tr>
              ) : filtered.map(log => {
                const TargetIcon = targetIcons[log.target_type] || ShieldCheck;
                const detailsStr = log.details
                  ? (typeof log.details === "string" ? log.details : JSON.stringify(log.details))
                  : "—";
                return (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {log.created_date ? format(new Date(log.created_date), "MMM d, yyyy HH:mm:ss") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary">
                            {log.admin_name?.[0]?.toUpperCase() || log.admin_email?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground whitespace-nowrap">{log.admin_name || "—"}</p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">{log.admin_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize whitespace-nowrap">
                        <TargetIcon className="w-3.5 h-3.5" />
                        {log.target_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-foreground whitespace-nowrap">
                        {log.target_label || log.target_id || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize whitespace-nowrap", severityStyles[log.severity] || severityStyles.low)}>
                        {log.severity || "low"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground whitespace-nowrap">
                        <Globe className="w-3 h-3 flex-shrink-0" />
                        {log.ip_address || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {log.location || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-[200px] truncate">
                      {detailsStr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
