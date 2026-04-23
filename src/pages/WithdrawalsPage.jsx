import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, DollarSign, User, CreditCard, RefreshCw } from "lucide-react";

const STATUS_TABS = ["pending", "approved", "rejected"];

function statusBadge(status) {
  switch (status) {
    case "pending":   return <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30">Pending</Badge>;
    case "approved":  return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Approved</Badge>;
    case "rejected":  return <Badge className="bg-red-500/15 text-red-400 border-red-500/30">Rejected</Badge>;
    default:          return <Badge variant="outline">{status}</Badge>;
  }
}

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function WithdrawalsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: withdrawals = [], isLoading, refetch } = useQuery({
    queryKey: ["withdrawals", activeTab],
    queryFn: () => api.get(`/api/admin/withdrawals?status=${activeTab}`),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.post(`/api/admin/withdrawals/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => api.post(`/api/admin/withdrawals/${id}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      setRejectingId(null);
      setRejectReason("");
    },
  });

  const handleApprove = (wr) => {
    if (!window.confirm(`Approve withdrawal of £${formatAmount(wr.amount)} for ${wr.user?.email}?\n\nStripe will automatically transfer funds to their connected bank account.`)) return;
    approveMutation.mutate(wr.id);
  };

  const handleRejectConfirm = (id) => {
    if (!rejectReason.trim()) return;
    rejectMutation.mutate({ id, reason: rejectReason });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdrawal Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Approve to auto-transfer via Stripe to seller's bank</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Clock className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No {activeTab} withdrawal requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((wr) => (
            <div key={wr.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left info */}
                <div className="flex-1 space-y-3">
                  {/* Amount + status */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">£{formatAmount(wr.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(wr.created_at)}</p>
                    </div>
                    {statusBadge(wr.status)}
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{wr.user?.full_name || "—"}</span>
                    <span className="text-muted-foreground">{wr.user?.email}</span>
                  </div>

                  {/* Stripe Connect status */}
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    {wr.user?.stripe_connect_onboarded ? (
                      <span className="text-emerald-400 font-medium">✓ Stripe account connected</span>
                    ) : (
                      <span className="text-red-400">✗ Stripe account not connected</span>
                    )}
                    {wr.user?.stripe_connect_account_id && (
                      <span className="text-muted-foreground text-xs font-mono">
                        ({wr.user.stripe_connect_account_id.slice(0, 16)}...)
                      </span>
                    )}
                  </div>

                  {/* Stripe transfer ID if approved */}
                  {wr.stripe_transfer_id && (
                    <div className="text-xs text-muted-foreground font-mono bg-muted/30 px-3 py-1.5 rounded-lg">
                      Transfer: {wr.stripe_transfer_id}
                    </div>
                  )}

                  {/* Rejection reason */}
                  {wr.rejection_reason && (
                    <div className="text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">
                      Rejected: {wr.rejection_reason}
                    </div>
                  )}

                  {/* Reject input */}
                  {rejectingId === wr.id && (
                    <div className="flex gap-2 mt-2">
                      <input
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        placeholder="Reason for rejection..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectConfirm(wr.id)}
                        disabled={rejectMutation.isPending || !rejectReason.trim()}
                      >
                        Confirm
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Action buttons — only for pending */}
                {wr.status === "pending" && rejectingId !== wr.id && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(wr)}
                      disabled={approveMutation.isPending || !wr.user?.stripe_connect_onboarded}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Transfer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setRejectingId(wr.id); setRejectReason(""); }}
                      className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    {!wr.user?.stripe_connect_onboarded && (
                      <p className="text-xs text-red-400 text-center max-w-[140px]">
                        User must connect Stripe first
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
