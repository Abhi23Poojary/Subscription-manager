"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Edit3, IndianRupee, Calendar, Tag, Link as LinkIcon, RefreshCw } from "lucide-react";
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
    nextBillingDate: "",
    externalLink: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cost: Number(formData.cost),
          nextBillingDate: new Date(formData.nextBillingDate)
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

  return (
    <main className="pageWrapper">
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <section className="formCard" style={{ maxWidth: '500px' }}>
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
              <Calendar className="inputIcon" size={18} />
              <input type="date" className="inputField" style={{ colorScheme: 'dark' }} value={formData.nextBillingDate} onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })} required />
            </div>
          </div>

          <div className="inputGroup">
            <LinkIcon className="inputIcon" size={18} />
            <input type="url" className="inputField" placeholder="Website URL (Optional)" value={formData.externalLink} onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })} />
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
    </main>
  );
}