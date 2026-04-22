'use client';
import { useState, useEffect, useCallback } from 'react';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscriptions');
      if (!res.ok) throw new Error('Failed to fetch subscriptions');
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  async function addSubscription(subData) {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add subscription');
    await fetchSubscriptions();
    return data.subscription;
  }

  async function updateSubscription(id, updates) {
    const res = await fetch(`/api/subscriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update subscription');
    await fetchSubscriptions();
    return data.subscription;
  }

  async function deleteSubscription(id) {
    const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete subscription');
    await fetchSubscriptions();
  }

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
}