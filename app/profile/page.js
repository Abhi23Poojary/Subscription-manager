"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, User, Mail, Settings, Tag, ArrowLeft, Camera } from "lucide-react";
import Sidebar from "@/app/sidebar/page";
import NotificationBell from "@/app/notifications/page";

import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("menu");
  const [theme, setTheme] = useState("dark");
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setFormData({
              name: data.user.name || "",
              username: data.user.username || "",
              email: data.user.email || "",
              avatar: data.user.avatar || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Load the saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit image size to 2MB to prevent large database documents
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "Image size must be less than 2MB.", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setFormData(prev => ({ ...prev, avatar: base64String }));
      
      try {
        setSaving(true);
        setMessage({ text: "", type: "" });
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, avatar: base64String }),
        });
        
        if (res.ok) {
          setMessage({ text: "Profile picture updated successfully!", type: "success" });
        } else {
          setMessage({ text: "Failed to update profile picture.", type: "error" });
        }
      } catch (error) {
        setMessage({ text: "An error occurred while uploading.", type: "error" });
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        
        if (data.user) {
          setFormData({
            name: data.user.name || "",
            username: data.user.username || "",
            email: data.user.email || "",
            avatar: data.user.avatar || "",
          });
        }
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setView("menu");
      } else {
        const errorData = await res.json();
        setMessage({ text: errorData.error || "Failed to update profile.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setSaving(false);
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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  if (loading) {
    return (
      <div className="profileWrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#60a5fa" />
      </div>
    );
  }

  return (
    <main className="profileWrapper" style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      
      <div className="profileContent" style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh', zIndex: 1 }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>My Profile</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NotificationBell />
            <button onClick={handleLogout} className="logoutBtn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        
        {/* Move message rendering here to display global page notifications */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

          {view === "menu" && (
            <>
              <div className="profileCard">
                <label className="profileAvatar" title="Change Profile Picture">
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} disabled={saving} />
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : formData.name ? (
                    <span style={{fontSize: '2rem', fontWeight: 'bold'}}>{formData.name.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User size={40} color="#94a3b8" />
                  )}
                  <div className="avatarOverlay">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                  </div>
                </label>
                <div className="profileInfo">
                  <h3>{formData.name || "User"}</h3>
                  <p>@{formData.username || "username"}</p>
                </div>
              </div>

              <div className="settingsGrid">
                <div className="settingBox" onClick={() => setView("edit")}>
                  <div className="settingIcon"><User size={24} color="#60a5fa" /></div>
                  <div className="settingDetails">
                    <h4>Edit Profile</h4>
                    <p>Update your personal information</p>
                  </div>
                </div>
                <div className="settingBox" onClick={() => setView("dashboard")}>
                  <div className="settingIcon"><Settings size={24} color="#a78bfa" /></div>
                  <div className="settingDetails">
                    <h4>Manage Dashboard</h4>
                    <p>Customize your dashboard view</p>
                  </div>
                </div>
                <div className="settingBox" onClick={() => setView("email")}>
                  <div className="settingIcon"><Mail size={24} color="#34d399" /></div>
                  <div className="settingDetails">
                    <h4>Email Preferences</h4>
                    <p>Manage your notification emails</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === "dashboard" && (
            <div className="profileCard columnCard">
              <button onClick={() => setView("menu")} className="backBtn">
                <ArrowLeft size={16} /> Back to Menu
              </button>
              <div style={{ width: '100%', marginTop: '1.5rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Manage Dashboard</h2>
                <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Choose your preferred theme for the application.</p>
                
                <div className="themeOptions">
                  <div className={`themeCard ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>
                    <div className="themePreview dark">
                      <div className="previewHeader"></div>
                      <div className="previewBody"></div>
                    </div>
                    <h4>Dark Theme</h4>
                    <p>Default dark appearance</p>
                  </div>

                  <div className={`themeCard ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>
                    <div className="themePreview light">
                      <div className="previewHeader"></div>
                      <div className="previewBody"></div>
                    </div>
                    <h4>Light Theme</h4>
                    <p>Clean and bright appearance</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "edit" && (
            <div className="profileCard columnCard">
              <button onClick={() => setView("menu")} className="backBtn">
                <ArrowLeft size={16} /> Back to Menu
              </button>
              
              <div style={{ width: '100%', marginTop: '1.5rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Edit Profile</h2>

                <form onSubmit={handleSubmit} className="profileForm">
                  <div className="formGroup"><label><User size={16} /> Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className="formGroup"><label><Tag size={16} /> Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} required /></div>
                  <div className="formGroup"><label><Mail size={16} /> Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
                  <button type="submit" className="saveBtn" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}</button>
                </form>
              </div>
            </div>
          )}

          {view === "email" && (
            <div className="profileCard columnCard">
              <button onClick={() => setView("menu")} className="backBtn">
                <ArrowLeft size={16} /> Back to Menu
              </button>
              <div style={{ width: '100%', marginTop: '1.5rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Email Preferences</h2>
                <p style={{ color: '#9ca3af' }}>Your email preference settings will appear here soon.</p>
              </div>
            </div>
          )}
      </div>
    </main>
  );
}