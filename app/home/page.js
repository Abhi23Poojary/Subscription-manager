"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ServerCrash,
  Github, 
  Menu, 
  X,
  Tv,
  Globe,
  BellRing,
  CreditCard,
  TrendingDown,
  Play,
  Monitor,
  Smartphone,
  Gamepad2,
  Headphones,
  MousePointer2,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    {
      title: "Smart Renewal Alerts",
      desc: "Get notified before Netflix or Prime charges you. No more 'forgotten' subscriptions.",
      icon: <BellRing className="w-6 h-6 text-blue-400" />
    },
    {
      title: "Spending Analytics",
      desc: "Visualize your monthly 'subscription drain' and find where you can save.",
      icon: <TrendingDown className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "One-Click Control",
      desc: "Centralize your billing. Pause, cancel, or switch plans across platforms in one place.",
      icon: <CreditCard className="w-6 h-6 text-purple-400" />
    }
  ];

  const platforms = [
    { name: "OTT",      icon: <Tv size={20} />,        color: "from-red-500 to-orange-500"    },
    { name: "Music",    icon: <Headphones size={20} />, color: "from-green-500 to-emerald-500" },
    { name: "Gaming",   icon: <Gamepad2 size={20} />,   color: "from-purple-500 to-indigo-500" },
    { name: "Software", icon: <Monitor size={20} />,    color: "from-blue-500 to-cyan-500"     },
  ];

  // ── Security section data ──────────────────────────────────────────────
  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6 text-blue-400" />,
      color: "border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]",
      iconBg: "bg-blue-600/10",
      title: "End-to-End Encryption",
      desc: "All your subscription data is encrypted in transit and at rest using AES-256. Your financial information never travels unprotected.",
    },
    {
      icon: <KeyRound className="w-6 h-6 text-indigo-400" />,
      color: "border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]",
      iconBg: "bg-indigo-600/10",
      title: "JWT Authentication",
      desc: "Stateless, tamper-proof HTTP-only cookies ensure your session can never be hijacked by malicious scripts in your browser.",
    },
    {
      icon: <EyeOff className="w-6 h-6 text-violet-400" />,
      color: "border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]",
      iconBg: "bg-violet-600/10",
      title: "Zero Password Exposure",
      desc: "Passwords are hashed with bcrypt (cost factor 12) before storage. Even our own engineers cannot see your credentials.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      color: "border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]",
      iconBg: "bg-cyan-600/10",
      title: "Route-Level Protection",
      desc: "Every private page is guarded server-side via middleware. Unauthenticated requests are redirected before any data is served.",
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-pink-400" />,
      color: "border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.1)]",
      iconBg: "bg-pink-600/10",
      title: "Data Isolation",
      desc: "Your subscriptions are scoped strictly to your user ID. It is architecturally impossible to access another user's data.",
    },
    {
      icon: <ServerCrash className="w-6 h-6 text-emerald-400" />,
      color: "border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
      iconBg: "bg-emerald-600/10",
      title: "Input Validation",
      desc: "All API routes validate and sanitize inputs server-side. SQL injection, XSS, and malformed payloads are rejected at the edge.",
    },
  ];

  const securityBadges = [
    "AES-256 Encryption",
    "bcrypt Password Hashing",
    "HTTP-Only Cookies",
    "HTTPS Enforced",
    "No Third-Party Data Sharing",
    "GDPR Compliant",
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Tv className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Recurix</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features"  className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">How it works</a>
            <a href="#platforms" className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Platforms</a>
            {/* ── WIRED: Security → #security ── */}
            <a href="#security"  className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Security</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="text-sm font-semibold px-4 py-2 hover:text-blue-400 transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push("/signin")}
              className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
            >
              Sign In
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#050507] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <a href="#features"  onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#platforms" onClick={() => setIsMenuOpen(false)}>Platforms</a>
              <a href="#security"  onClick={() => setIsMenuOpen(false)}>Security</a>
              <hr className="border-white/10" />
              <button
                onClick={() => { setIsMenuOpen(false); router.push("/signup"); }}
                className="w-full bg-blue-600 py-4 rounded-2xl text-white"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05]">
              Master Your <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Subscriptions
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-20">
              Take Control of Every Subscription. Manage Netflix, Spotify, Prime, and 50+ other services in one unified dashboard. Track spending and cancel unused plans instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Start Tracking Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Play size={18} fill="currentColor" /> Watch How It Works
              </button>
            </div>
          </motion.div>

          {/* UNIFIED HUB VISUAL */}
          <motion.div 
            id="platforms"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-[120px] -z-10 rounded-full scale-y-50 translate-y-20" />
            
            <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
                {platforms.map((p, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-gradient-to-br ${p.color} p-0.5 shadow-lg group-hover:shadow-white/10 transition-shadow`}>
                      <div className="w-full h-full bg-[#050507] rounded-[1.9rem] flex items-center justify-center">
                        {p.icon}
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{p.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Central Hub Graphic */}
              <div className="mt-16 pt-16 border-t border-white/5 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                  <div className="relative bg-white/5 border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-sm font-mono font-bold text-gray-300">ONE UNIFIED RECURIX HUB ACTIVE</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-12 grayscale opacity-30">
                  <Smartphone size={24} />
                  <Tv size={24} />
                  <Monitor size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 px-6 bg-[#08080a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Financial Freedom from OTT Sprawl</h2>
            <p className="text-gray-500 max-w-xl mx-auto italic">Stop paying for platforms you don't watch. Recurix helps you cut the digital clutter.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-500"
              >
                <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] inline-block group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Banner */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.2 }}
  className="mt-24"
>
  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] px-6 py-10 md:px-12 md:py-14 text-center">
    <div className="absolute top-0 left-0 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-600/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

    <div className="relative z-10 max-w-2xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
        Ready to stop wasting money?
      </h3>

      <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
        Start tracking every recurring payment, uncover hidden charges, and take full control of your subscriptions.
      </p>

      <button
        onClick={() => router.push("/signup")}
        className="group mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 relative overflow-hidden"
      >
        <span className="relative z-10">Get Started for Free</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>

      <p className="text-gray-600 text-xs mt-4 font-medium uppercase tracking-widest">
        No credit card required
      </p>
    </div>
  </div>
</motion.div>
        </div>
      </section>

      {/* ══ SECURITY SECTION ══════════════════════════════════════════════════ */}
      <section id="security" className="relative z-10 pt-20 pb-32 px-6 bg-[#050507]">

        {/* Section background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
              <Shield size={14} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-black uppercase tracking-widest">
                Enterprise-Grade Security
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
              Your Data is a{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Fortress
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              We built Recurix with security as the foundation — not an afterthought.
              Every layer of the stack is hardened to protect your financial data.
            </p>
          </motion.div>

          {/* Security Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-32"
          >
            {securityFeatures.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`group relative bg-[#0a0a0c] border ${item.color} rounded-3xl p-7 hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
              >
                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/[0.03] transition-all" />

                <div className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center mb-5 border border-white/5`}>
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-[15px] mb-2 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white/[0.02] border border-white/8 rounded-[2rem] p-10 md:p-14 relative overflow-hidden"
            
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
              {/* Left: shield icon + copy */}
              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 animate-pulse" />
                  <div className="relative w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={28} className="text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1 tracking-tight">
                    We never sell your data. Ever.
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                    Recurix is a tool for you — not an ad platform. Your subscription list is private, 
                    encrypted, and will never be monetized or shared.
                  </p>
                </div>
              </div>

              {/* Right: CTA */}
              <button
                onClick={() => router.push("/signup")}
                className="group shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 relative overflow-hidden"
              >
                <span className="relative z-10">Start Securely</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>

            {/* Security Badges */}
            <div className="relative mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-3 justify-center md:justify-start">
              {securityBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white/[0.03] border border-white/8 px-3 py-1.5 rounded-full"
                >
                  <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
      {/* ══ END SECURITY SECTION ═════════════════════════════════════════════ */}

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            <Tv className="w-5 h-5" />
            <span className="font-bold tracking-tighter uppercase italic">Recurix</span>
          </div>
          <div className="text-gray-600 text-xs font-medium uppercase tracking-[0.2em]">
            © 2024 Recurix Labs. Designed for Digital Nomads.
          </div>
          <div className="flex gap-6 text-gray-500 items-center">
            <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Globe size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><MousePointer2 size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}