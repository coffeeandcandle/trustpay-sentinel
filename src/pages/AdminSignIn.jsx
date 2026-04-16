import { base44 } from "@/api/base44Client";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSignIn() {
  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.origin + "/");
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,11%)] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-[hsl(222,47%,9%)] border border-white/10 rounded-2xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">TrustPay</h1>
            <p className="text-sm text-slate-400 mt-1">Admin Operations Portal</p>
          </div>

          <div className="border-t border-white/10 mb-8" />

          <p className="text-slate-300 text-sm text-center mb-8">
            This portal is restricted to authorized TrustPay administrators only.
          </p>

          <Button
            onClick={handleLogin}
            className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            Sign in to Admin Portal
          </Button>

          <p className="text-xs text-slate-500 text-center mt-6">
            Unauthorized access is prohibited and monitored.
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © {new Date().getFullYear()} TrustPay. All rights reserved.
        </p>
      </div>
    </div>
  );
}