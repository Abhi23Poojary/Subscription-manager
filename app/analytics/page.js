"use client";
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2,
  TrendingUp,
  Tag,
  LogOut
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from "recharts";
import { getCategorySpending, getMonthlyTrend } from "@/lib/subscriptionHelpers";
import Sidebar from "@/app/sidebar/page";

import "./analytics.css";

// Custom colors matching the dark theme
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export default function AnalyticsPage() {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/subscriptions");
        if (!res.ok) throw new Error("Failed to fetch subscriptions");
        
        const data = await res.json();
        const subsArray = data.subscriptions || [];
        
        // Filter out canceled subscriptions for accurate current metrics
        const activeData = subsArray.filter(sub => sub.status === 'active');

        setCategoryData(getCategorySpending(activeData));
        setTrendData(getMonthlyTrend(activeData));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="analyticsWrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#60a5fa" />
      </div>
    );
  }

  return (
    <main className="analyticsWrapper" style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <Sidebar />
      <div className="analyticsContent" style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh', zIndex: 1 }}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Analytics</h1>
          <button 
            onClick={handleLogout} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="chartsGrid">
          {/* Category Breakdown Chart */}
          <div className="chartCard">
            <h3><Tag size={20} color="#a78bfa" /> Monthly Spend by Category</h3>
            {categoryData.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '2rem' }}>No active subscriptions to analyze.</p>
            ) : (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', borderRadius: '8px' }} itemStyle={{ color: '#f9fafb' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9ca3af' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Spending Trend Chart */}
          <div className="chartCard">
            <h3><TrendingUp size={20} color="#34d399" /> Spending Trend (Last 6 Months)</h3>
            {trendData.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '2rem' }}>No trend data available.</p>
            ) : (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Spending']} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="spending" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
=======
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, PieChart as PieIcon, DollarSign,
  BarChart2, Calendar, Layers
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from "recharts";
import { useSubscriptions } from "@/hooks/useSubscriptions";

// ── Helpers ────────────────────────────────────────────────────────────────

function getMonthlyCost(sub) {
  const cost = parseFloat(sub.cost) || 0;
  return sub.billingCycle === "yearly" ? cost / 12 : cost;
}

function getCategoryData(subscriptions) {
  const map = {};
  subscriptions.forEach((s) => {
    const cat = s.category || "Other";
    map[cat] = (map[cat] || 0) + getMonthlyCost(s);
  });
  return Object.entries(map).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));
}

function getMonthlyTrend(subscriptions) {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    const spending = subscriptions.reduce((sum, s) => sum + getMonthlyCost(s), 0);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      spending: parseFloat(spending.toFixed(2)),
    };
  });
}

function getBillingBreakdown(subscriptions) {
  const monthly = subscriptions
    .filter((s) => s.billingCycle === "monthly")
    .reduce((sum, s) => sum + s.cost, 0);
  const yearly = subscriptions
    .filter((s) => s.billingCycle === "yearly")
    .reduce((sum, s) => sum + s.cost / 12, 0);
  return [
    { name: "Monthly Plans", value: parseFloat(monthly.toFixed(2)) },
    { name: "Yearly Plans", value: parseFloat(yearly.toFixed(2)) },
  ];
}

// ── Color Palette ──────────────────────────────────────────────────────────
const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

// ── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0c0c0f] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl text-sm">
      {label && <p className="text-gray-400 mb-1 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#6366f1" }} className="font-bold">
          {p.name}: ${p.value}
        </p>
      ))}
    </div>
  );
};

// ── Custom Pie Label ───────────────────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── Chart Card wrapper ─────────────────────────────────────────────────────
function ChartCard({ title, icon: Icon, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <Icon size={16} className="text-blue-400" />
        </div>
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyChart({ message }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
        <BarChart2 size={20} className="text-gray-600" />
      </div>
      <p className="text-gray-600 text-sm text-center">{message}</p>
    </div>
  );
}

// ── Skeleton Loader ────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />;
}

// ══ MAIN PAGE ══════════════════════════════════════════════════════════════
export default function AnalyticsPage() {
  const { subscriptions, loading } = useSubscriptions();

  const totalMonthly = useMemo(
    () => subscriptions.reduce((sum, s) => sum + getMonthlyCost(s), 0),
    [subscriptions]
  );

  const totalYearly   = useMemo(() => totalMonthly * 12, [totalMonthly]);
  const avgCost       = useMemo(
    () => (subscriptions.length > 0 ? totalMonthly / subscriptions.length : 0),
    [subscriptions, totalMonthly]
  );
  const mostExpensive = useMemo(
    () => subscriptions.reduce((max, s) => (getMonthlyCost(s) > getMonthlyCost(max || {}) ? s : max), null),
    [subscriptions]
  );

  const categoryData  = useMemo(() => getCategoryData(subscriptions),    [subscriptions]);
  const trendData     = useMemo(() => getMonthlyTrend(subscriptions),     [subscriptions]);
  const billingData   = useMemo(() => getBillingBreakdown(subscriptions), [subscriptions]);

  return (
    <div className="min-h-screen bg-[#050507] relative overflow-hidden font-sans">

      {/* Background Decor */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Visual breakdown of your subscription spending
          </p>
        </motion.div>

        {/* ── Stat Cards ── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={DollarSign}
              label="Monthly Spend"
              value={`$${totalMonthly.toFixed(2)}`}
              sub="across all subscriptions"
              color="bg-blue-600/20"
              delay={0.05}
            />
            <StatCard
              icon={Calendar}
              label="Yearly Spend"
              value={`$${totalYearly.toFixed(2)}`}
              sub="projected annual cost"
              color="bg-indigo-600/20"
              delay={0.1}
            />
            <StatCard
              icon={Layers}
              label="Avg. per Sub"
              value={`$${avgCost.toFixed(2)}`}
              sub="monthly average"
              color="bg-violet-600/20"
              delay={0.15}
            />
            <StatCard
              icon={TrendingUp}
              label="Most Expensive"
              value={mostExpensive ? `$${getMonthlyCost(mostExpensive).toFixed(2)}` : "$0"}
              sub={mostExpensive?.name || "No subscriptions"}
              color="bg-pink-600/20"
              delay={0.2}
            />
          </div>
        )}

        {/* ── Row 1: Trend + Billing Breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Monthly Spending Trend — takes 2/3 width */}
          <div className="lg:col-span-2">
            {loading ? (
              <Skeleton className="h-80" />
            ) : (
              <ChartCard title="Monthly Spending Trend" icon={TrendingUp} delay={0.25}>
                {subscriptions.length === 0 ? (
                  <EmptyChart message="Add subscriptions to see your spending trend" />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="spending"
                        name="Spending"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#818cf8" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            )}
          </div>

          {/* Billing Cycle Breakdown — takes 1/3 */}
          {loading ? (
            <Skeleton className="h-80" />
          ) : (
            <ChartCard title="Billing Cycle Split" icon={PieIcon} delay={0.3}>
              {subscriptions.length === 0 ? (
                <EmptyChart message="No data yet" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={billingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        labelLine={false}
                        label={renderPieLabel}
                      >
                        {billingData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? "#6366f1" : "#8b5cf6"} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="space-y-2 mt-2">
                    {billingData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: i === 0 ? "#6366f1" : "#8b5cf6" }}
                          />
                          <span className="text-gray-400">{item.name}</span>
                        </div>
                        <span className="text-white font-semibold">${item.value}/mo</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ChartCard>
          )}
        </div>

        {/* ── Row 2: Category Bar + Category Pie ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Category Bar Chart */}
          {loading ? (
            <Skeleton className="h-80" />
          ) : (
            <ChartCard title="Spending by Category" icon={BarChart2} delay={0.35}>
              {categoryData.length === 0 ? (
                <EmptyChart message="No category data available" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Monthly Spend" radius={[6, 6, 0, 0]}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          )}

          {/* Category Pie Chart */}
          {loading ? (
            <Skeleton className="h-80" />
          ) : (
            <ChartCard title="Category Distribution" icon={PieIcon} delay={0.4}>
              {categoryData.length === 0 ? (
                <EmptyChart message="No category data available" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={renderPieLabel}
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    {categoryData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-gray-400 truncate">{item.name}</span>
                        <span className="text-white font-semibold ml-auto">${item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ChartCard>
          )}
        </div>

      </div>
    </div>
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
  );
}