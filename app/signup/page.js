"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Calendar, Users, ArrowRight,
  Loader2, CheckCircle2, ShieldCheck, AlertCircle,
  Apple, Eye, EyeOff, AtSign
} from "lucide-react";

export default function App() {
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    openGender: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUser((prev) => ({ ...prev, openGender: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // DOB formatting
  const handleDOBChange = (e) => {
    const input = e.target.value;
    const isDeleting = e.nativeEvent.inputType?.includes("delete");
    let val = input.replace(/\D/g, "").slice(0, 8);

    let formatted = "";

    if (val.length > 0) {
      formatted = val.slice(0, 2);
      if (val.length === 2 && !isDeleting) formatted += "/";
      else if (val.length > 2) {
        formatted += "/" + val.slice(2, 4);
        if (val.length === 4 && !isDeleting) formatted += "/";
        else if (val.length > 4) {
          formatted += "/" + val.slice(4, 8);
        }
      }
    }

    setUser({ ...user, dob: formatted });
  };

  // Convert DD/MM/YYYY → ISO date string for backend
  const parseDOB = (dob) => {
    const [dd, mm, yyyy] = dob.split("/");
    if (!dd || !mm || !yyyy) return null;
    const date = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(date.getTime()) ? null : date.toISOString();
  };

  // ── REPLACED: now calls real API ─────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (user.dob.length < 10) {
      setError("Enter a valid date of birth (DD/MM/YYYY)");
      return;
    }
    if (!user.gender) {
      setError("Please select your gender");
      return;
    }

    const dobISO = parseDOB(user.dob);
    if (!dobISO) {
      setError("Invalid date of birth");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     user.name.trim(),
          username: user.username.trim(),
          email:    user.email.trim(),
          password: user.password,
          dob:      dobISO,
          gender:   user.gender,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed. Please try again.");
        setStatus("idle");
        return;
      }

      // Show success state briefly, then redirect
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1200);

    } catch {
      setError("Network error. Please check your connection.");
      setStatus("idle");
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const inputContainer = "relative group";
  const icon = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 z-20 transition-colors";
  const inputStyle = "w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-white text-sm outline-none transition-all duration-300 placeholder:text-gray-500";
  const viewToggle = "absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer z-20";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] relative overflow-hidden font-sans">

      {/* Background Decor */}
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
          onSubmit={handleSignup} 
          className="bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl"
        >

          <h1 className="text-3xl text-white text-center mb-2 font-bold tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-center text-sm mb-8 font-medium">Start your journey today</p>

          <div className="space-y-4">

            {/* Name */}
            <div className={inputContainer}>
              <User className={icon} />
              <input 
                className={inputStyle} 
                placeholder="Full Name" 
                value={user.name}
                onChange={(e)=>setUser({...user,name:e.target.value})}
                required
              />
            </div>

            {/* Username */}
            <div className={inputContainer}>
              <AtSign className={icon} />
              <input 
                className={inputStyle} 
                placeholder="Username" 
                value={user.username}
                onChange={(e)=>setUser({...user,username:e.target.value})}
                required
              />
            </div>

            {/* Email */}
            <div className={inputContainer}>
              <Mail className={icon} />
              <input 
                type="email"
                className={inputStyle} 
                placeholder="Email Address" 
                value={user.email}
                onChange={(e)=>setUser({...user,email:e.target.value})}
                required
              />
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={inputContainer}>
                <Lock className={icon} />
                <input 
                  type={showPass ? "text" : "password"} 
                  className={inputStyle} 
                  placeholder="Password" 
                  value={user.password}
                  onChange={(e)=>setUser({...user,password:e.target.value})}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={viewToggle}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className={inputContainer}>
                <ShieldCheck className={icon} />
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  className={inputStyle} 
                  placeholder="Confirm" 
                  value={user.confirmPassword}
                  onChange={(e)=>setUser({...user,confirmPassword:e.target.value})}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className={viewToggle}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* DOB + Gender Grid */}
            <div className="grid grid-cols-2 gap-4">

              {/* DOB */}
              <div className={inputContainer}>
                <Calendar className={icon} />
                <input
                  className={inputStyle}
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  value={user.dob}
                  onChange={handleDOBChange}
                  required
                />
              </div>

              {/* GENDER DROPDOWN */}
              <div ref={dropdownRef} className="relative group">
                <Users className={icon} />

                <div
                  onClick={() =>
                    setUser({ ...user, openGender: !user.openGender })
                  }
                  className={`${inputStyle} cursor-pointer flex justify-between items-center ${
                    !user.gender ? "text-gray-500" : "text-white"
                  }`}
                >
                  {user.gender || "Gender"}
                  <motion.span animate={{ rotate: user.openGender ? 180 : 0 }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </motion.span>
                </div>

                <AnimatePresence>
                  {user.openGender && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute w-full mt-2 bg-[#0c0c0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-1"
                    >
                      {["Male", "Female", "Other"].map((g) => (
                        <div
                          key={g}
                          onClick={() =>
                            setUser({
                              ...user,
                              gender: g,
                              openGender: false,
                            })
                          }
                          className={`px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition text-sm ${
                            user.gender === g ? "bg-blue-600 text-white" : "text-gray-300"
                          }`}
                        >
                          {g}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Error Message */}
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

          {/* Sign Up Button */}
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
              <Loader2 className="animate-spin w-5 h-5"/> 
            ) : status === "success" ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1">
                <CheckCircle2 size={18} /> Account Ready
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Sign Up <ArrowRight size={16} />
              </div>
            )}
          </motion.button>

          {/* SOCIAL DIVIDER */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          {/* SOCIAL BUTTONS */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all text-sm font-medium text-white group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.303-2.23.477-3.414.477a7.086 7.086 0 0 1-7.36-4.84L1.24 16.765C3.198 20.717 7.27 23.415 12 23.415c2.972 0 5.711-1.01 7.82-2.731l-3.78-2.671Z" />
                <path fill="#4285F4" d="M19.82 20.684c2.215-1.808 3.553-4.476 3.553-7.684 0-.792-.073-1.558-.205-2.296H12v4.354h6.354a5.434 5.434 0 0 1-2.354 3.553l3.82 3.073Z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.792.137-1.558.39-2.275L1.24 6.65a11.962 11.962 0 0 0 0 10.7l4.037-3.082Z" />
              </svg>
              Google
            </button>
            <button 
              type="button"
              className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all text-sm font-medium text-white group"
            >
              <Apple className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              Apple
            </button>
          </div>

          <p className="mt-8 text-center text-[10px] text-gray-600 leading-relaxed uppercase tracking-[0.2em] font-bold opacity-40">
            End-to-End Encrypted
          </p>

        </form>
      </motion.div>
    </div>
  );
}