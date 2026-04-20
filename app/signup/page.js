"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle, Apple, Eye, EyeOff } from "lucide-react";

// Importing the signup css
import "./signup.css";

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setStatus("loading");
    
    // Simulate API Call
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => router.push("/login"), 1500);
    }, 1500);
  };

  return (
    <main className="pageWrapper">
      <div className="backgroundGlow">
        <div className="glowTop" />
        <div className="glowBottom" />
      </div>

      <section className="formCard">
        <form onSubmit={handleSignup}>
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Start your journey with us today</p>

          {error && (
            <div className="errorBox">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Full Name */}
          <div className="inputGroup">
            <User className="inputIcon" size={18} />
            <input
              type="text"
              className="inputField"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="inputGroup">
            <Mail className="inputIcon" size={18} />
            <input
              type="email"
              className="inputField"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="inputGroup">
            <Lock className="inputIcon" size={18} />
            <input
              type={showPass ? "text" : "password"}
              className="inputField"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="viewToggle">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="inputGroup">
            <Lock className="inputIcon" size={18} />
            <input
              type={showPass ? "text" : "password"}
              className="inputField"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={status !== "idle"} 
            className="signUpBtn"
          >
            {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : 
             status === "success" ? <><CheckCircle2 size={18} /> Account Created!</> : 
             <div style={{display:'flex', alignItems:'center', gap:'8px'}}>Create Account <ArrowRight size={16} /></div>}
          </button>

          <div className="divider">
            <div className="line" />
            <span className="dividerText">Or join with</span>
            <div className="line" />
          </div>

          <div className="socialGrid">
            <button type="button" className="socialBtn">
              <svg className="socialIcon" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.303-2.23.477-3.414.477a7.086 7.086 0 0 1-7.36-4.84L1.24 16.765C3.198 20.717 7.27 23.415 12 23.415c2.972 0 5.711-1.01 7.82-2.731l-3.78-2.671Z" />
                <path fill="#4285F4" d="M19.82 20.684c2.215-1.808 3.553-4.476 3.553-7.684 0-.792-.073-1.558-.205-2.296H12v4.354h6.354a5.434 5.434 0 0 1-2.354 3.553l3.82 3.073Z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.792.137-1.558.39-2.275L1.24 6.65a11.962 11.962 0 0 0 0 10.7l4.037-3.082Z" />
              </svg>
              Google
            </button>
            <button type="button" className="socialBtn"><Apple size={18} /> Apple</button>
          </div>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Already have an account?{" "}
              <span onClick={() => router.push("/login")} style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }}>Log In</span>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}