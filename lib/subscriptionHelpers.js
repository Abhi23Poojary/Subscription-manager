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
  const monthData = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  
  // Loop from January (0) up to the current month (Year-to-Date)
  for (let i = 0; i <= currentMonth; i++) {
    const d = new Date(today.getFullYear(), i, 1);
    monthData.push({
      date: d,
      month: d.toLocaleString('default', { month: 'short' }),
      spending: 0,
    });
  }

  subscriptions.forEach((s) => {
    const monthly = getMonthlyCost(s);
    const createdAt = s.createdAt ? new Date(s.createdAt) : new Date(0); // Fallback if missing
    
    monthData.forEach((m) => {
      // Include the subscription cost if it was created on or before the end of this month
      const endOfMonth = new Date(m.date.getFullYear(), m.date.getMonth() + 1, 0, 23, 59, 59);
      if (createdAt <= endOfMonth) {
        m.spending += monthly;
      }
    });
  });

  return monthData.map((m) => ({ month: m.month, spending: parseFloat(m.spending.toFixed(2)) }));
}