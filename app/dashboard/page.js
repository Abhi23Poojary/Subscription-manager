"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  CreditCard, 
  Calendar, 
  Activity, 
  Layers,
  ExternalLink,
  Trash2,
  LogOut,
  Loader2,
  Search
} from "lucide-react";
import { getDashboardStats } from "@/lib/subscriptionHelpers";
import Sidebar from "@/app/sidebar/page";
import NotificationBell from "@/app/notifications/page";

// Import matching stylesheet
import "./dashboard.css";

export default function DashboardPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({ totalSubscriptions: 0, monthlySpend: 0, upcomingRenewals: 0 });
  const [activePlans, setActivePlans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch("/api/subscriptions");
        if (!res.ok) throw new Error("Failed to fetch subscriptions");
        
        const data = await res.json();
        // Safely extract the array from our newly shaped backend response
        const subsArray = data.subscriptions || [];
        setSubscriptions(subsArray);
        
        // Calculate Stats using the existing helper
        const calculatedStats = getDashboardStats(subsArray);
        setStats(calculatedStats);

        // Calculate extra active plans explicitly requested
        const activeCount = subsArray.filter(sub => sub.status === 'active').length;
        setActivePlans(activeCount);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (res.ok) {
        const updatedSubs = subscriptions.filter(sub => sub._id !== id);
        setSubscriptions(updatedSubs);
        setStats(getDashboardStats(updatedSubs));
        setActivePlans(updatedSubs.filter(sub => sub.status === 'active').length);
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboardWrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#60a5fa" />
      </div>
    );
  }

  return (
    <main className="dashboardWrapper" style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
      {/* Keep existing theme background */}
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <Sidebar />
      <div className="dashboardContent" style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh', zIndex: 1 }}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Dashboard</h1>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 2rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
        </div>

        {/* Summary Cards */}
        <div className="statsGrid">
          <div className="statCard">
            <div className="iconWrapper iconBlue"><Layers size={24} /></div>
            <div className="statInfo">
              <h3>Total Subscriptions</h3>
              <p>{stats.totalSubscriptions}</p>
            </div>
          </div>
          
          <div className="statCard">
            <div className="iconWrapper iconGreen"><CreditCard size={24} /></div>
            <div className="statInfo">
              <h3>Monthly Spending</h3>
              <p>₹{stats.monthlySpend}</p>
            </div>
          </div>

          <div className="statCard">
            <div className="iconWrapper iconYellow"><Calendar size={24} /></div>
            <div className="statInfo">
              <h3>Upcoming Renewals</h3>
              <p>{stats.upcomingRenewals}</p>
            </div>
          </div>

          <div className="statCard">
            <div className="iconWrapper iconPurple"><Activity size={24} /></div>
            <div className="statInfo">
              <h3>Active Plans</h3>
              <p>{activePlans}</p>
            </div>
          </div>
        </div>

        {/* Subscriptions Section */}
        <div className="sectionHeader">
          <h2>Your Subscriptions</h2>
          <button className="addBtn" onClick={() => router.push("/add-subscription")}>
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* We will build the robust Data Table / List component in the next phase */}
        {subscriptions.length === 0 ? (
          <div className="emptyState">
            <Layers size={48} color="#4b5563" style={{ margin: '0 auto 1rem auto' }} />
            <p>You haven't added any subscriptions yet.</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="emptyState">
            <Search size={48} color="#4b5563" style={{ margin: '0 auto 1rem auto' }} />
            <p>No subscriptions found matching "{searchQuery}".</p>
          </div>
        ) : (
          <div className="subsTableWrapper">
            <table className="subsTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Cycle</th>
                  <th>Next Renewal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub._id}>
                    <td style={{ fontWeight: 500 }}>{sub.name}</td>
                    <td><span className={`badge badge-${sub.category}`}>{sub.category}</span></td>
                    <td>₹{parseFloat(sub.cost).toFixed(2)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{sub.billingCycle}</td>
                    <td>{new Date(sub.nextBillingDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {sub.externalLink && (
                          <button className="actionBtn" onClick={() => window.open(sub.externalLink, "_blank")} title="Manage on Website">
                            <ExternalLink size={18} />
                          </button>
                        )}
                        <button className="actionBtn delete" onClick={() => handleDelete(sub._id)} title="Delete Subscription">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
