"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Mail, Settings, Shield } from "lucide-react";
import Sidebar from "@/app/sidebar/page";
import "./profile.css";

export default function ProfilePage() {
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
    <main className="profileWrapper" style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <Sidebar />

      <div className="profileContent" style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh', zIndex: 1 }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>My Profile</h1>
          <button 
            onClick={handleLogout} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="profileCard">
          <div className="profileAvatar">
            <UserIcon size={48} color="#94a3b8" />
          </div>
          <div className="profileInfo">
            <h3>Welcome Back!</h3>
            <p>Manage your account settings and preferences.</p>
          </div>
        </div>

        <div className="settingsGrid">
          <div className="settingBox">
            <div className="settingIcon"><Mail size={20} color="#60a5fa" /></div>
            <div className="settingDetails">
              <h4>Email Preferences</h4>
              <p>Manage your notifications and alerts</p>
            </div>
          </div>
          <div className="settingBox">
            <div className="settingIcon"><Shield size={20} color="#34d399" /></div>
            <div className="settingDetails">
              <h4>Security</h4>
              <p>Change your password and secure your account</p>
            </div>
          </div>
          <div className="settingBox">
            <div className="settingIcon"><Settings size={20} color="#a78bfa" /></div>
            <div className="settingDetails">
              <h4>App Settings</h4>
              <p>Customize your dashboard experience</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}