"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import Sidebar from "@/app/sidebar/page";
import NotificationBell from "@/app/notifications/page";

import "./deals.css";

const SERVICES = [
  { id: 'netflix', name: 'Netflix', desc: 'Unlimited movies, TV shows, and mobile games.', color: '#E50914', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { id: 'prime', name: 'Amazon Prime', desc: 'Fast delivery, exclusive deals, and Prime Video.', color: '#00A8E1', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Amazon_Prime_Logo.svg' },
  { id: 'spotify', name: 'Spotify Premium', desc: 'Ad-free music listening, offline playback.', color: '#1DB954', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' },
  { id: 'youtube', name: 'YouTube Premium', desc: 'Ad-free video, background play, and YT Music.', color: '#FF0000', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg' },
  { id: 'hotstar', name: 'Disney+ Hotstar', desc: 'Live sports, TV, and exclusive Disney+ movies.', color: '#1F3C88', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg' },
  { id: 'microsoft365', name: 'Microsoft 365', desc: 'Premium Office apps and 1TB cloud storage.', color: '#0078D4', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Microsoft_365_%282022%29.svg/512px-Microsoft_365_%282022%29.svg.png' },
  { id: 'adobe', name: 'Adobe Creative Cloud', desc: 'All 20+ creative desktop and mobile apps.', color: '#FF0000', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Adobe_Creative_Cloud_rainbow_icon.svg/512px-Adobe_Creative_Cloud_rainbow_icon.svg.png' },
  { id: 'canva', name: 'Canva Pro', desc: 'Premium tools, templates, and brand management.', color: '#00C4CC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Canva_icon_2021.svg/512px-Canva_icon_2021.svg.png' },
];

export default function DealsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSubscribeClick = (serviceId) => {
    // Navigate to the scrape page, passing the service id as a query parameter
    router.push(`/deals/scrape?service=${serviceId}`);
  };

  return (
    <main className="dealsWrapper" style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <Sidebar />
      
      <div className="dealsContent" style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh', zIndex: 1 }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Popular Subscriptions</h1>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '1rem' }}>Find the best deals and plans for top services.</p>
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

        {/* Deals Grid */}
        <div className="dealsGrid">
          {SERVICES.map((service) => {
            return (
              <div key={service.id} className="dealCard">
                <div className="dealHeader">
                  <div className="dealIconWrapper">
                    <img src={service.logo} alt={`${service.name} logo`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <h3 className="dealName">{service.name}</h3>
                </div>
                
                <p className="dealDesc">{service.desc}</p>
                
                <button 
                  className="subscribeBtn" 
                  onClick={() => handleSubscribeClick(service.id)}
                  style={{ '--hover-color': service.color }}
                >
                  View Plans <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
        
      </div>
    </main>
  );
}