"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useMemo } from "react";
import {
  LayoutDashboard, CreditCard, RefreshCcw,
  BarChart3, User, Search, Bell, ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptions } from "@/hooks/useSubscriptions";

// ── Service appearance map (name → color + icon) ──────────────────────────
function getServiceAppearance(name = "") {
  const n = name.toLowerCase();

  if (n.includes("netflix"))
    return { color: "bg-[#E50914]", icon: <span className="text-white font-black text-xl italic leading-none">N</span> };
  if (n.includes("youtube"))
    return { color: "bg-white", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 fill-red-600"><path d="M23.5 6.2c-.3-1.1-1.1-2-2.2-2.3C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.2-2.2 2.3C0 8.2 0 12.4 0 12.4s0 4.2.5 6.2c.3 1.1 1.1 2 2.2 2.3 2 .5 9.3.5 9.3.5s7.3 0 9.3-.5c1.1-.3 1.9-1.2 2.2-2.3.5-2 .5-6.2.5-6.2s0-4.2-.5-6.2zM9.5 15.4V9.4l6.2 3-6.2 3z" /></svg> };
  if (n.includes("disney"))
    return { color: "bg-[#020731]", icon: <span className="text-white font-serif italic text-lg font-black leading-none text-center">D+</span> };
  if (n.includes("spotify"))
    return { color: "bg-[#1DB954]", icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-black"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.4-.7.5-1.1.3-2.8-1.7-6.3-2.1-10.4-1.2-.5.1-.9-.2-1-.7s.2-.9.7-1c4.5-1 8.4-.6 11.5 1.3.4.2.5.8.3 1.3zm1.4-3.3c-.3.5-.9.6-1.4.3-3.2-2-8.1-2.5-11.9-1.4-.6.2-1.2-.2-1.3-.8s.2-1.2.8-1.3c4.4-1.3 9.8-.7 13.5 1.6.5.3.6.9.3 1.6zm.1-3.4c-3.9-2.3-10.3-2.5-14.1-1.4-.6.2-1.2-.2-1.4-.8s.2-1.2.8-1.4c4.3-1.3 11.4-1 15.9 1.6.5.3.7 1 .4 1.5-.3.5-1 .7-1.6.5z" /></svg> };
  if (n.includes("microsoft") || n.includes("365"))
    return { color: "bg-[#00a1f1]", icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M0 12.1L10.1 10.7V0L0 1.5V12.1ZM11.1 10.5L24 8.7V0L11.1 1.8V10.5ZM11.1 13.5L24 15.3V24L11.1 22.2V13.5ZM0 22.5L10.1 24V13.3L0 11.9V22.5Z" /></svg> };
  if (n.includes("canva"))
    return { color: "bg-[#7d2ae8]", icon: <span className="text-white font-bold italic text-[10px]">Canva</span> };
  if (n.includes("dropbox"))
    return { color: "bg-[#0061FF]", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M6 1.9l6 3.8-6 3.8L0 5.7l6-3.8zm0 13l6-3.8 6 3.8-6 3.8-6-3.8zm12-9.2l6 3.8-6 3.8-6-3.8 6-3.8zM0 9.5l6 3.8-6 3.8V9.5zm24 0v7.6l-6-3.8 6-3.8z" /></svg> };
  if (n.includes("slack"))
    return { color: "bg-white", icon: <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M5 12.5c0 1.4-1.1 2.5-2.5 2.5S0 13.9 0 12.5s1.1-2.5 2.5-2.5H5v2.5zm1.2 0c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V19c0 1.4-1.1 2.5-2.5 2.5S6.2 20.4 6.2 19v-6.5z" fill="#36C5F0" /><path d="M11.5 5c-1.4 0-2.5-1.1-2.5-2.5S10.1 0 11.5 0s2.5 1.1 2.5 2.5V5h-2.5zm0 1.2c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5H5c-1.4 0-2.5-1.1-2.5-2.5S3.6 6.2 5 6.2h6.5z" fill="#2EB67D" /></svg> };
  if (n.includes("apple"))
    return { color: "bg-black", icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg> };
  if (n.includes("amazon") || n.includes("prime"))
    return { color: "bg-[#FF9900]", icon: <span className="text-white font-black text-xs">prime</span> };
  if (n.includes("hulu"))
    return { color: "bg-[#1CE783]", icon: <span className="text-black font-black text-sm">hulu</span> };
  if (n.includes("adobe"))
    return { color: "bg-[#FF0000]", icon: <span className="text-white font-black text-xs">Ai</span> };
  if (n.includes("notion"))
    return { color: "bg-white", icon: <span className="text-black font-black text-lg">N</span> };
  if (n.includes("github"))
    return { color: "bg-[#24292e]", icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg> };

  // Default fallback — first letter of name
  const colors = ["bg-blue-600", "bg-violet-600", "bg-pink-600", "bg-emerald-600", "bg-amber-600", "bg-cyan-600"];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return {
    color: colors[colorIndex],
    icon: <span className="text-white font-black text-lg">{name.charAt(0).toUpperCase()}</span>,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getMonthlyCost(sub) {
  const cost = parseFloat(sub.cost) || 0;
  return sub.billingCycle === "yearly" ? cost / 12 : cost;
}

function formatPrice(sub) {
  const cost = parseFloat(sub.cost) || 0;
  return sub.billingCycle === "yearly"
    ? `$${cost.toFixed(2)}/yr`
    : `$${cost.toFixed(2)}/mo`;
}

function isUpcomingIn7Days(dateStr) {
  const today = new Date();
  const in7 = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const d = new Date(dateStr);
  return d >= today && d <= in7;
}

// ══ MAIN PAGE ═════════════════════════════════════════════════════════════
const App = () => {
  const router   = useRouter();
  const pathname = usePathname();

  // ── Real data ────────────────────────────────────────────────────────────
  const { user, loading: authLoading } = useAuth();
  const { subscriptions, loading: subsLoading } = useSubscriptions();

  // ── Computed stats ────────────────────────────────────────────────────────
  const totalSubscriptions = subscriptions.length;

  const monthlySpend = useMemo(
    () => subscriptions.reduce((sum, s) => sum + getMonthlyCost(s), 0),
    [subscriptions]
  );

  const upcomingRenewals = useMemo(
    () => subscriptions.filter((s) => s.nextBillingDate && isUpcomingIn7Days(s.nextBillingDate)).length,
    [subscriptions]
  );

  const avgSpend = useMemo(
    () => (totalSubscriptions > 0 ? monthlySpend / totalSubscriptions : 0),
    [monthlySpend, totalSubscriptions]
  );

  // ── Active sidebar tab derived from URL ───────────────────────────────────
  const activeTab = useMemo(() => {
    if (pathname.startsWith("/subscriptions")) return "Subscriptions";
    if (pathname.startsWith("/renewals"))      return "Renewals";
    if (pathname.startsWith("/analytics"))     return "Analytics";
    if (pathname.startsWith("/profile"))       return "Profile";
    return "Dashboard";
  }, [pathname]);

  // ── Stats cards (real data) ───────────────────────────────────────────────
  const stats = [
    {
      label: "TOTAL SUBSCRIPTIONS",
      value: subsLoading ? "—" : String(totalSubscriptions),
      subtext: totalSubscriptions === 1 ? "1 active plan" : `${totalSubscriptions} active plans`,
      subtextColor: "text-green-400",
      icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blue-400"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>,
      glow: "border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.15)]",
    },
    {
      label: "MONTHLY SPENDING",
      value: subsLoading ? "—" : `$${monthlySpend.toFixed(2)}`,
      subtext: "this month",
      subtextColor: "text-slate-500",
      icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-400"><path d="M21 18H3V6h18v12zm0-14H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" /><path d="M12 11h2v2h-2v-2z" /></svg>,
      glow: "border-cyan-500/30 shadow-[0_0_25px_rgba(34,211,238,0.15)]",
      hasChart: true,
    },
    {
      label: "UPCOMING RENEWALS",
      value: subsLoading ? "—" : String(upcomingRenewals),
      subtext: "next 7 days",
      subtextColor: "text-slate-500",
      icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-pink-400"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>,
      glow: "border-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.15)]",
    },
    {
      label: "AVERAGE SPEND",
      value: subsLoading ? "—" : `$${avgSpend.toFixed(2)}`,
      subtext: "per sub / month",
      subtextColor: "text-slate-500",
      icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-indigo-400"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /><path d="M7 12h2v7H7v-7zm4-3h2v10h-2V9zm4 6h2v4h-2v-4z" /></svg>,
      glow: "border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.15)]",
    },
  ];

  // ── Display name ──────────────────────────────────────────────────────────
  const displayName = authLoading ? "..." : (user?.name || "User");

  return (
    <div className="flex h-screen bg-[#060608] text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0c] flex flex-col p-6 relative">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <span className="text-white font-black text-2xl italic tracking-tighter leading-none pr-0.5">R</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Recurix</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: "Dashboard",     icon: LayoutDashboard, path: "/dashboard"     },
            { name: "Subscriptions", icon: CreditCard,      path: "/subscriptions" },
            { name: "Renewals",      icon: RefreshCcw,      path: "/renewals"      },
            { name: "Analytics",     icon: BarChart3,        path: "/analytics"     },
            { name: "Profile",       icon: User,             path: "/profile"       },
          ].map((item) => {
            const isSelected = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                  isSelected ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-2xl" />
                    <div className="absolute inset-0 shadow-[0_0_20px_rgba(59,130,246,0.15)] rounded-2xl" />
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  </>
                )}
                {!isSelected && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-2xl" />
                )}
                <item.icon size={18} className={`relative z-10 transition-transform duration-300 ${isSelected ? "scale-110" : ""}`} />
                <span className="font-bold text-[14px] relative z-10 tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-10 py-6 border-b border-white/5">
          <div className="relative w-[380px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#0d0d10] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer group" onClick={() => router.push("/notifications")}>
                <Bell size={20} className="text-slate-500 group-hover:text-white transition-colors" />
                {upcomingRenewals > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#060608]" />
                )}
              </div>
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => router.push("/profile")}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-slate-800 shadow-md transition-transform group-hover:scale-105">
                  <User size={16} className="m-auto mt-1.5 text-slate-400" />
                </div>
                {/* ── Real user name ── */}
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                  {displayName}
                </span>
                <ChevronDown size={14} className="text-slate-500" />
              </div>
            </div>
            <button
              onClick={() => router.push("/subscriptions")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:shadow-[0_12px_24px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              Add Subscription
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pt-8 pb-12 custom-scrollbar">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Dashboard overview</h2>

          {/* ── Metric Cards (real data) ── */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`bg-[#0d0d10] border ${stat.glow} rounded-2xl p-5 flex items-start justify-between relative transition-all hover:scale-[1.02]`}
              >
                <div className="flex flex-col">
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1.5">{stat.label}</p>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{stat.value}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold ${stat.subtextColor}`}>{stat.subtext}</span>
                    {stat.hasChart && (
                      <svg viewBox="0 0 40 10" className="w-8 h-3 stroke-cyan-400 fill-none opacity-60">
                        <path d="M0 8 Q 10 2, 20 6 T 40 0" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center p-2.5 bg-white/5 rounded-xl border border-white/10 shadow-sm">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* ── Active Subscriptions (real data) ── */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-md font-bold text-slate-200">Active Subscriptions</h3>
              <button
                onClick={() => router.push("/subscriptions")}
                className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
              >
                View All
              </button>
            </div>

            {/* Loading skeleton */}
            {subsLoading && (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-[#0d0d10] border border-white/5 px-4 py-3.5 rounded-2xl animate-pulse h-[68px]" />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!subsLoading && subscriptions.length === 0 && (
              <div className="bg-[#0d0d10] border border-white/5 rounded-2xl p-10 text-center">
                <p className="text-slate-500 text-sm font-medium">No subscriptions yet.</p>
                <button
                  onClick={() => router.push("/subscriptions")}
                  className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all"
                >
                  Add your first subscription
                </button>
              </div>
            )}

            {/* Real subscription list */}
            {!subsLoading && subscriptions.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {subscriptions.slice(0, 8).map((sub, i) => {
                  const { color, icon } = getServiceAppearance(sub.name);
                  const isActive = sub.status === "active";
                  return (
                    <div
                      key={sub._id}
                      className="bg-[#0d0d10] border border-white/5 px-4 py-3.5 rounded-2xl flex items-center group hover:bg-[#121216] hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all"
                    >
                      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] shrink-0 transition-transform group-hover:scale-105`}>
                        {icon}
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[14px] leading-tight group-hover:text-blue-400 transition-colors">
                              {sub.name}
                            </h4>
                            <span className={`text-[8px] font-black uppercase tracking-[0.12em] ${
                              isActive
                                ? "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                                : "text-slate-600"
                            }`}>
                              • {isActive ? "Active" : sub.status}
                            </span>
                          </div>
                          <span className="text-slate-400 text-xs font-medium mt-0.5">
                            {formatPrice(sub)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          isActive
                            ? router.push(`/manage?id=${sub._id}`)
                            : sub.externalLink && window.open(
                                sub.externalLink.startsWith("http")
                                  ? sub.externalLink
                                  : `https://${sub.externalLink}`,
                                "_blank"
                              )
                        }
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0 transition-all ${
                          isActive
                            ? "bg-[#1a1a1e] text-slate-400 border border-white/5 hover:bg-[#25252a] hover:text-white"
                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_6px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)]"
                        }`}
                      >
                        {isActive ? "Manage" : "Subscribe"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        `,
      }} />
    </div>
  );
};

export default App;