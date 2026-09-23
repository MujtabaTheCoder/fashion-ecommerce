"use client";

import React, { useState } from "react";
import { Sparkles, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";

export function AdminLoginGate() {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const ok = login(username, password);
      setLoading(false);
      if (!ok) {
        setError("Invalid username or password. Please try again.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setPassword("");
      }
    }, 600);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0c0b]">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-amber-600/[0.08] blur-[100px]" />

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px)}
          30%{transform:translateX(8px)}
          45%{transform:translateX(-6px)}
          60%{transform:translateX(6px)}
          75%{transform:translateX(-3px)}
          90%{transform:translateX(3px)}
        }
        .shake-anim { animation: shake 0.6s ease; }
      `}</style>

      <div className={`relative z-10 w-full max-w-md px-4 ${shake ? "shake-anim" : ""}`}>
        <div className="rounded-3xl border border-white/10 bg-[#141311]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
              <span className="text-2xl font-bold text-black">✦</span>
            </div>
            <p className="font-display text-2xl tracking-[0.28em] text-white">ATELIER</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-400">
              Owner Portal
            </p>
            <p className="mt-2 text-xs text-white/40">
              Sign in to access your salon command centre
            </p>
          </div>

          <div className="mb-6 h-px w-full bg-white/10" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/20 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Access Owner Portal
                </span>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
