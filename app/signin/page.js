"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Lock, ArrowRight, Loader2, 
  CheckCircle2, AlertCircle, Apple, Eye, EyeOff 
} from "lucide-react";

export default function App() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const [showPass,    setShowPass]    = useState(false);
  const [status,      setStatus]      = useState("idle");
  const [error,       setError]       = useState("");
  const [oauthLoading, setOauthLoading] = useState(""); // "google" | "apple" | ""

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.identifier.trim() || !credentials.password) {
      setError("Please fill in all fields");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/auth/signin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          identifier: credentials.identifier.trim(),
          password:   credentials.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch {
      setError("Network error. Please check your connection.");
      setStatus("idle");
    }
  };

  // ── OAuth handlers ────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    try {
      setOauthLoading("google");
      setError("");
      const result = await signIn("google", {
        callbackUrl:  "/dashboard",
        redirect:     false,
      });
      if (result?.error) {
        setError("Google sign-in failed. Please try again.");
        setOauthLoading("");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError("Google sign-in failed. Please try again.");
      setOauthLoading("");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setOauthLoading("apple");
      setError("");
      const result = await signIn("apple", {
        callbackUrl: "/dashboard",
        redirect:    false,
      });
      if (result?.error) {
        setError("Apple sign-in failed. Please try again.");
        setOauthLoading("");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError("Apple sign-in failed. Please try again.");
      setOauthLoading("");
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setCredentials({ identifier: "", password: "" });
    setError("");
    setStatus("idle");
  };

  const inputContainer = "relative group";
  const icon           = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 z-20 transition-colors";
  const inputStyle     = "w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-white text-sm outline-none transition-all duration-300 placeholder:text-gray-500";
  const viewToggle     = "absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer z-20";
  const helperLinkStyle = "text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] relative overflow-hidden font-sans">

      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="z-10 w-full max-w-md px-6 py-10"
      >
        <form 
          onSubmit={handleSignin} 
          className="bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl"
        >
          <h1 className="text-3xl text-white text-center mb-2 font-bold tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-center text-sm mb-10 font-medium">Please enter your details</p>

          <div className="space-y-5">
            <div className={inputContainer}>
              <User className={icon} />
              <input 
                type="text"
                className={inputStyle} 
                placeholder="Email or Username" 
                value={credentials.identifier}
                onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
                required
              />
            </div>

            <div className={inputContainer}>
              <Lock className={icon} />
              <input 
                type={showPass ? "text" : "password"} 
                className={inputStyle} 
                placeholder="Password" 
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className={viewToggle}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-between items-center px-1">
              <button type="button" onClick={handleReset} className={helperLinkStyle}>Reset</button>
              <button type="button" className={helperLinkStyle}>Forgot password?</button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 text-red-400 text-xs font-medium mt-4 bg-red-500/10 p-3 rounded-xl border border-red-500/20"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`w-full mt-8 py-3.5 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all shadow-xl ${
              status === "success" ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
            } text-white disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : status === "success" ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1">
                <CheckCircle2 size={18} /> Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-2">Sign In <ArrowRight size={16} /></div>
            )}
          </motion.button>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Or login with</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          {/* ── WIRED: Social Buttons ── */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!!oauthLoading}
              className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all text-sm font-medium text-white group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "google" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                  <path fill="#34A853" d="M16.04 18.013c-1.09.303-2.23.477-3.414.477a7.086 7.086 0 0 1-7.36-4.84L1.24 16.765C3.198 20.717 7.27 23.415 12 23.415c2.972 0 5.711-1.01 7.82-2.731l-3.78-2.671Z" />
                  <path fill="#4285F4" d="M19.82 20.684c2.215-1.808 3.553-4.476 3.553-7.684 0-.792-.073-1.558-.205-2.296H12v4.354h6.354a5.434 5.434 0 0 1-2.354 3.553l3.82 3.073Z" />
                  <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.792.137-1.558.39-2.275L1.24 6.65a11.962 11.962 0 0 0 0 10.7l4.037-3.082Z" />
                </svg>
              )}
              Google
            </button>

            <button 
              type="button"
              onClick={handleAppleSignIn}
              disabled={!!oauthLoading}
              className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all text-sm font-medium text-white group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "apple" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Apple className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              )}
              Apple
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-blue-400 font-semibold hover:underline underline-offset-4"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}