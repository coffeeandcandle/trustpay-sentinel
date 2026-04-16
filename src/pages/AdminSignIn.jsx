import { base44 } from "@/api/base44Client";
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
            <img
              src="https://media.base44.com/images/public/69e096635a9256978131bd05/608378266_Asset12x.png"
              alt="Sando Pay Icon"
              className="w-16 h-16 rounded-2xl object-contain mb-5"
            />
            <img
              src="https://media.base44.com/images/public/69e096635a9256978131bd05/c6893f589_Asset22x.png"
              alt="Sando Pay"
              className="h-8 object-contain"
            />
            <p className="text-sm text-slate-400 mt-2">Admin Operations Portal</p>
          </div>

          <div className="border-t border-white/10 mb-8" />

          <p className="text-slate-300 text-sm text-center mb-8">
            This portal is restricted to authorized Sando Pay administrators only.
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
          © {new Date().getFullYear()} Sando Pay. All rights reserved.
        </p>
      </div>
    </div>
  );
}