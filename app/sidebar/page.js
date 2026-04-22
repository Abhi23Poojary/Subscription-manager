"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, User as UserIcon } from "lucide-react";
import "./side.css";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", path: "/analytics", icon: PieChart },
    { name: "Profile", path: "/profile", icon: UserIcon },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebarBrand">
        <LayoutDashboard size={28} color="#3b82f6" />
        Recurix
      </div>

      <nav className="navMenu">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <div key={item.name} onClick={() => router.push(item.path)} className={`navItem ${isActive ? "active" : ""}`}>
              <item.icon size={20} /> {item.name}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}