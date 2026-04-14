export function getMonthlyCost(subscription) {
  const cost = parseFloat(subscription.cost) || 0;
  if (subscription.billingCycle === 'yearly') return cost / 12;
  return cost;
}

export function getDashboardStats(subscriptions) {
  const total = subscriptions.length;
  const monthlySpend = subscriptions.reduce((sum, s) => sum + getMonthlyCost(s), 0);
  const avgCost = total > 0 ? monthlySpend / total : 0;

  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const upcomingRenewals = subscriptions.filter((s) => {
    const billingDate = new Date(s.nextBillingDate);
    return billingDate >= today && billingDate <= in30Days;
  }).length;

  return {
    totalSubscriptions: total,
    monthlySpend: monthlySpend.toFixed(2),
    upcomingRenewals,
    avgCost: avgCost.toFixed(2),
  };
}

export function getCategorySpending(subscriptions) {
  const map = {};
  subscriptions.forEach((s) => {
    const cat = s.category || 'Other';
    map[cat] = (map[cat] || 0) + getMonthlyCost(s);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
}

export function getMonthlyTrend(subscriptions) {
  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: d.toLocaleString('default', { month: 'short' }),
      spending: 0,
    });
  }

  subscriptions.forEach((s) => {
    const monthly = getMonthlyCost(s);
    // Distribute cost across all months (active subscriptions)
    months.forEach((m) => (m.spending += monthly));
  });

  return months.map((m) => ({ ...m, spending: parseFloat(m.spending.toFixed(2)) }));
}