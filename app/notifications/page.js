"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, AlertCircle, CheckCircle2 } from "lucide-react";
import "./notification.css";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch("/api/subscriptions");
        if (!res.ok) return;
        const data = await res.json();
        const subsArray = data.subscriptions || [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(today.getDate() - 3);

        const notifs = [];

        subsArray.forEach(sub => {
          if (sub.status !== 'active') return;

          // 1. Check for upcoming renewals (within 2 days)
          const billingDate = new Date(sub.nextBillingDate);
          billingDate.setHours(0, 0, 0, 0);
          
          const diffTime = billingDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

          if (diffDays >= 0 && diffDays <= 2) {
            notifs.push({
              id: `renew-${sub._id}`,
              title: "Upcoming Renewal",
              message: `${sub.name} is renewing ${diffDays === 0 ? 'today' : `in ${diffDays} day(s)`}.`,
              date: billingDate,
              type: "warning"
            });
          }

          // 2. Check for newly added subscriptions (last 3 days)
          const createdDate = new Date(sub.createdAt);
          if (createdDate >= threeDaysAgo) {
            notifs.push({
              id: `new-${sub._id}`,
              title: "New Subscription",
              message: `You recently added ${sub.name} to your tracking.`,
              date: createdDate,
              type: "success"
            });
          }
        });

        // Sort notifications by date (most recent first)
        notifs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(notifs);

        // Check localStorage for the last time notifications were viewed
        const lastViewTimeStr = localStorage.getItem('lastNotificationViewTime');
        if (lastViewTimeStr) {
          const lastViewTime = new Date(lastViewTimeStr);
          const newNotifications = notifs.filter(n => new Date(n.date) > lastViewTime);
          setUnreadCount(newNotifications.length);
        } else {
          setUnreadCount(notifs.length);
        }

      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchSubscriptions();
  }, []);

  // Close dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      setUnreadCount(0);
      // When viewed, store the timestamp of the newest notification
      if (notifications.length > 0) {
        // notifications are sorted, so the first one is the newest
        localStorage.setItem('lastNotificationViewTime', new Date(notifications[0].date).toISOString());
      }
    }
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button className="notification-bell" onClick={handleToggleNotifications}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">No new notifications</div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="notification-item">
                  <div className={`notification-icon ${notif.type}`}>
                    {notif.type === 'warning' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  </div>
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}