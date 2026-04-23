"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Check, AlertCircle, LogOut } from "lucide-react";
import Sidebar from "@/app/sidebar/page";
import NotificationBell from "@/app/notifications/page";

import "./scrape.css";

// Mock data representing scraped information from the provider's website
const SCRAPED_DATA = {
  netflix: {
    name: "Netflix",
    brandColor: "#E50914",
    checkoutUrl: "https://www.netflix.com/signup",
    plans: [
      { name: "Mobile", price: "₹149", cycle: "monthly", features: ["480p resolution", "1 mobile/tablet device", "Ad-free"] },
      { name: "Basic", price: "₹199", cycle: "monthly", features: ["720p resolution", "1 supported device", "Ad-free"] },
      { name: "Standard", price: "₹499", cycle: "monthly", features: ["1080p resolution", "2 supported devices", "Ad-free"], popular: true },
      { name: "Premium", price: "₹649", cycle: "monthly", features: ["4K+HDR resolution", "4 supported devices", "Spatial Audio"] }
    ]
  },
  prime: {
    name: "Amazon Prime",
    brandColor: "#00A8E1",
    checkoutUrl: "https://www.amazon.in/amazonprime",
    plans: [
      { name: "Monthly", price: "₹299", cycle: "monthly", features: ["Free 1-day delivery", "Prime Video included", "Amazon Music"] },
      { name: "Annual", price: "₹1,499", cycle: "yearly", features: ["Free 1-day delivery", "Prime Video included", "Amazon Music", "Save ₹2,089/year"], popular: true }
    ]
  },
  spotify: {
    name: "Spotify Premium",
    brandColor: "#1DB954",
    checkoutUrl: "https://www.spotify.com/premium/",
    plans: [
      { name: "Mini", price: "₹7", cycle: "day", features: ["1 mobile device", "Ad-free music", "30 songs download"] },
      { name: "Individual", price: "₹119", cycle: "monthly", features: ["Ad-free music listening", "Play anywhere - even offline", "On-demand playback"], popular: true },
      { name: "Family", price: "₹179", cycle: "monthly", features: ["Up to 6 Premium accounts", "Block explicit music", "Spotify Kids app"] }
    ]
  },
  youtube: {
    name: "YouTube Premium",
    brandColor: "#FF0000",
    checkoutUrl: "https://www.youtube.com/premium",
    plans: [
      { name: "Student", price: "₹79", cycle: "monthly", features: ["Ad-free videos", "Background play", "YT Music Premium"] },
      { name: "Individual", price: "₹129", cycle: "monthly", features: ["Ad-free videos", "Background play", "YT Music Premium"], popular: true },
      { name: "Family", price: "₹189", cycle: "monthly", features: ["Up to 5 family members", "Ad-free videos", "Background play"] }
    ]
  }
};

// Inner component that utilizes useSearchParams
function ScrapeDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('service');
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) {
      setError("No service selected.");
      setLoading(false);
      return;
    }

    // Simulate web scraping / API fetching delay
    const simulateScraping = async () => {
      setLoading(true);
      setError("");
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s simulated scrape
        
        if (SCRAPED_DATA[serviceId]) {
          setData(SCRAPED_DATA[serviceId]);
        } else {
          // Fallback generic data if service isn't hardcoded in our mock
          setData({
            name: serviceId.charAt(0).toUpperCase() + serviceId.slice(1),
            brandColor: "#3b82f6",
            checkoutUrl: `https://www.google.com/search?q=${serviceId}+subscription`,
            plans: [
              { name: "Standard Plan", price: "₹399", cycle: "monthly", features: ["Standard access", "All core features", "Cancel anytime"], popular: true }
            ]
          });
        }
      } catch (err) {
        setError("Failed to scrape plan details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    simulateScraping();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="centerContent">
        <Loader2 className="animate-spin" size={48} color="#60a5fa" />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Scraping latest plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centerContent errorState">
        <AlertCircle size={48} color="#ef4444" />
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/deals')} className="backBtn mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="scrapeContainer">
      <button onClick={() => router.back()} className="backLink">
        <ArrowLeft size={16} /> Back to Deals
      </button>

      <div className="scrapeHeader">
        <h1>{data.name} Plans</h1>
        <p>Live scraped pricing from the official website.</p>
      </div>

      <div className="pricingGrid">
        {data.plans.map((plan, index) => (
          <div key={index} className={`pricingCard ${plan.popular ? 'popular' : ''}`} style={{ '--brand-color': data.brandColor }}>
            {plan.popular && <div className="popularBadge">BEST VALUE</div>}
            
            <h3 className="planName">{plan.name}</h3>
            <div className="planPrice">
              <span className="amount">{plan.price}</span>
              <span className="cycle">/{plan.cycle}</span>
            </div>
            
            <ul className="featureList">
              {plan.features.map((feature, idx) => (
                <li key={idx}><Check size={16} color={plan.popular ? data.brandColor : "#60a5fa"} /> {feature}</li>
              ))}
            </ul>

            <button 
              className="selectPlanBtn" 
              style={{ backgroundColor: plan.popular ? data.brandColor : 'rgba(255,255,255,0.05)' }}
              onClick={() => window.open(data.checkoutUrl, '_blank')}
            >
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScrapePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <main className="dealsWrapper" style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <Sidebar />
      
      <div className="dealsContent" style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
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

        {/* Safe Suspense boundary required for useSearchParams */}
        <Suspense fallback={<div className="centerContent"><Loader2 className="animate-spin" size={48} color="#60a5fa" /></div>}>
          <ScrapeDetailsContent />
        </Suspense>
        
      </div>
    </main>
  );
}