"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, Shield, ShieldCheck, Lock, KeyRound, EyeOff, 
  ServerCrash, Github, Tv, Globe, BellRing, CreditCard, 
  TrendingDown, Play, Monitor, Gamepad2, Headphones, 
  CheckCircle2, MousePointer2 
} from "lucide-react";
import "./home.css";

export default function HomePage() {
  const router = useRouter();

  const features = [
    { title: "Smart Renewal Alerts", desc: "Get notified before Netflix or Prime charges you.", icon: <BellRing size={24} className="text-blue-400" /> },
    { title: "Spending Analytics", desc: "Visualize your monthly 'subscription drain'.", icon: <TrendingDown size={24} className="text-indigo-400" /> },
    { title: "One-Click Control", desc: "Centralize your billing. Pause or cancel plans.", icon: <CreditCard size={24} className="text-purple-400" /> }
  ];

  const securityFeatures = [
    { title: "Military-Grade Privacy", desc: "Your data is shielded by industry-leading encryption standards.", icon: <Lock className="text-blue-400" /> },
    { title: "Secure Access", desc: "Tamper-proof security layers protect your session from every angle.", icon: <KeyRound className="text-indigo-400" /> },
    { title: "Privacy First", desc: "We use advanced hashing to ensure your passwords remain invisible to us.", icon: <EyeOff className="text-violet-400" /> },
    { title: "Real-time Protection", desc: "Every private page is guarded by continuous server-side monitoring.", icon: <ShieldCheck className="text-cyan-400" /> },
    { title: "Personal Data Vault", desc: "Subscriptions are strictly isolated and visible only to you.", icon: <Shield size={24} className="text-pink-400" /> },
    { title: "Clean & Safe Code", desc: "Our systems automatically sanitize and block malicious inputs.", icon: <ServerCrash className="text-emerald-400" /> }
  ];

  const platforms = [
    { name: "OTT", icon: <Tv size={22} /> },
    { name: "Music", icon: <Headphones size={22} /> },
    { name: "Gaming", icon: <Gamepad2 size={22} /> },
    { name: "Software", icon: <Monitor size={22} /> }
  ];

  const securityBadges = ["Bank-Level Security", "No Data Selling", "Privacy Verified", "Secure Cloud Sync"];

  return (
    <div className="homeWrapper">
      <div className="bgFixed"><div className="glowTop" /></div>

      <nav className="navbar">
        <div className="max7xl navContent">
          <div className="logoArea">
            <div className="logoBox"><Tv size={22} color="white" fill="white" /></div>
            <span className="logoText">RECURIX</span>
          </div>
          <div className="navLinks">
            <a href="#features">How it works</a>
            <a href="#platforms">Platforms</a>
            <a href="#security">Security</a>
          </div>
          <div className="navAuth">
            <button onClick={() => router.push("/signup")} className="signUpTextBtn">Sign Up</button>
            <button onClick={() => router.push("/signin")} className="signInPill">Sign In</button>
          </div>
        </div>
      </nav>

      <main className="max7xl heroSection">
        <h1 className="heroTitle">Master Your <br/><span className="gradientText">Subscriptions</span></h1>
        <p className="heroDesc">Take Control of Every Subscription. Manage Netflix, Spotify, Prime, and 50+ other services in one unified dashboard. Track spending and cancel unused plans instantly.</p>
        <div className="heroBtnGroup">
          <button className="btnPrimary" onClick={() => router.push("/signup")}>Start Tracking Free <ArrowRight size={20} /></button>
          <button onClick={() => router.push("/signup")} className="btnSecondary"><Play size={18} fill="currentColor" /> Join now</button>
        </div>

        <div className="sectionHeader platformsHeader" id="platforms">
          <h2>Supported Platforms</h2>
        </div>

        <div className="unifiedHub">
          {platforms.map((p, i) => (
            <div key={i} className="platformItem">
               <div className="platformIconBox">{p.icon}</div>
               <span className="platformLabel">{p.name}</span>
            </div>
          ))}
        </div>
      </main>

      <section id="features" className="sectionContainer sectionDark">
        <div className="max7xl">
          <div className="sectionHeader">
            <h2>Financial Freedom from OTT Sprawl</h2>
          </div>
          <div className="flexGrid">
            {features.map((f, i) => (
              <div key={i} className="card">
                <div className="cardIcon">{f.icon}</div>
                <h3 className="cardTitle">{f.title}</h3>
                <p className="cardDesc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="sectionContainer">
        <div className="max7xl">
          <div className="sectionHeader">
            <h2>Your Data is a <span className="gradientText">Fortress</span></h2>
          </div>
          <div className="flexGrid">
            {securityFeatures.map((s, i) => (
              <div key={i} className="card">
                <div className="cardIcon">{s.icon}</div>
                <h3 className="cardTitle">{s.title}</h3>
                <p className="cardDesc">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="trustBanner">
            <div className="trustContent">
               <div className="trustIcon"><ShieldCheck size={40} className="text-blue-400" /></div>
               <div className="trustText">
                 <h3>We never sell your data. Ever.</h3>
                 <p>Recurix is private, encrypted, and will never be monetized.</p>
               </div>
               <button onClick={() => router.push("/signup")} className="btnPrimary">Start Securely</button>
            </div>
            <div className="badgeRow">
               {securityBadges.map((badge, i) => (
                 <div key={i} className="miniBadge">
                   <CheckCircle2 size={12} className="text-emerald-400" /> {badge}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- UPDATED FOOTER --- */}
      <footer className="footer">
        <div className="footerContent">
          <div className="footerLogo">
            <Tv className="footerIcon" size={20} />
            <span className="footerLogoText">Recurix</span>
          </div>
          
          <div className="footerCopyright">
            © 2024 Recurix Labs. Designed for Digital Nomads.
          </div>
          
          <div className="footerSocials">
            <a href="#" aria-label="GitHub"><Github size={20} /></a>
            <a href="#" aria-label="Website"><Globe size={20} /></a>
            <a href="#" aria-label="Action"><MousePointer2 size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}