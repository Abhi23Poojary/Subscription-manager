"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
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
  Cpu
} from "lucide-react";

export default function App() {
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
    { name: "OTT", icon: <Tv size={20} />, color: "from-red-500 to-orange-500" },
    { name: "Music", icon: <Headphones size={20} />, color: "from-green-500 to-emerald-500" },
    { name: "Gaming", icon: <Gamepad2 size={20} />, color: "from-purple-500 to-indigo-500" },
    { name: "Software", icon: <Monitor size={20} />, color: "from-blue-500 to-cyan-500" },
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
            <a href="#" className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">How it works</a>
            <a href="#" className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Platforms</a>
            <a href="#" className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Security</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-semibold px-4 py-2 hover:text-blue-400 transition-colors">Sign Up</button>
            <button className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-lg">
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
              <a href="#" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#" onClick={() => setIsMenuOpen(false)}>Platforms</a>
              <a href="#" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <hr className="border-white/10" />
              <button className="w-full bg-blue-600 py-4 rounded-2xl text-white">Get Started</button>
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
              <button className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 overflow-hidden">
                <span className="relative z-10">Start Tracking Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
              <button className="w-full sm:w-auto bg-white/[0.03] border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                <Play size={18} fill="currentColor" /> Watch How It Works
              </button>
            </div>
          </motion.div>

          {/* UNIFIED HUB VISUAL */}
          <motion.div 
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

              {/* Central "Hub" Graphic */}
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
      <section className="relative z-10 py-32 px-6 bg-[#08080a]">
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
        </div>
      </section>

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