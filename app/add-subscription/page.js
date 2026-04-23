"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Edit3, IndianRupee, Tag, Link as LinkIcon, RefreshCw, LogOut } from "lucide-react";
import Sidebar from "@/app/sidebar/page";
import NotificationBell from "@/app/notifications/page";
import "./add-sub.css";

export default function AddSubscriptionPage() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    billingCycle: "monthly",
    category: "Entertainment",
    externalLink: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("loading");

    // Automatically calculate the next billing date based on the billing cycle
    const calculateNextDate = (cycle) => {
      const date = new Date();
      if (cycle === "weekly") date.setDate(date.getDate() + 7);
      else if (cycle === "monthly") date.setMonth(date.getMonth() + 1);
      else if (cycle === "yearly") date.setFullYear(date.getFullYear() + 1);
      return date;
    };

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cost: Number(formData.cost),
          nextBillingDate: calculateNextDate(formData.billingCycle)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add subscription");

      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };
  
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <main className="pageWrapper" style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden', padding: 0 }}>
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <Sidebar />
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', zIndex: 1 }}>
        
        {/* Top Right Header Elements */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2rem 2rem 0 2rem', gap: '1rem', alignItems: 'center' }}>
          <NotificationBell />
          <button 
            onClick={handleLogout} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="formContainer" style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <section className="formCard">
          <div className="headerRow">
            <button onClick={() => router.push('/dashboard')} className="backBtn" type="button">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="title" style={{ marginBottom: '4px' }}>Add Subscription</h1>
              <p className="subtitle" style={{ marginBottom: 0 }}>Track a new recurring expense</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
            {error && (
              <div className="errorBox" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="inputGroup">
              <Edit3 className="inputIcon" size={18} />
              <input type="text" className="inputField" placeholder="Subscription Name (e.g. Netflix)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="formGrid">
              <div className="inputGroup">
                <IndianRupee className="inputIcon" size={18} />
                <input type="number" step="0.01" min="0" className="inputField" placeholder="Cost (e.g. 299)" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} required />
              </div>

              <div className="inputGroup">
                <RefreshCw className="inputIcon" size={18} />
                <select className="inputField" value={formData.billingCycle} onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })} required>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="formGrid">
              <div className="inputGroup">
                <Tag className="inputIcon" size={18} />
                <select className="inputField" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="inputGroup">
                <LinkIcon className="inputIcon" size={18} />
                <input type="url" className="inputField" placeholder="Website URL (Optional)" value={formData.externalLink} onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status !== "idle"} 
              className="submitBtn"
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                backgroundColor: status === "success" ? '#10b981' : '#3b82f6',
                color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                marginTop: '10px', transition: 'background-color 0.2s'
              }}
            >
              {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : 
               status === "success" ? <><CheckCircle2 size={18} style={{marginRight: '8px'}} /> Added!</> : 
               "Save Subscription"}
            </button>
          </form>
        </section>
        </div>
      </div>
    </main>
  );
}