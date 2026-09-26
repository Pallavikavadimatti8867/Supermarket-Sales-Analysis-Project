import React, { useMemo } from 'react';
import { Users, Award, CreditCard, ShoppingBag, HeartHandshake, Star } from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { calculateCustomerAnalysis, formatCurrency, formatNumber } from '../../utils/calculations';
import { Doughnut, Bar } from 'react-chartjs-2';

export const CustomersView: React.FC = () => {
  const { transactions } = useSales();

  const customerStats = useMemo(() => {
    return calculateCustomerAnalysis(transactions);
  }, [transactions]);

  // Aggregate top spenders
  const topSpenders = useMemo(() => {
    const map: Record<string, { id: string; type: string; gender: string; totalSpent: number; orders: number; lastDate: string; avgRating: number; ratingSum: number }> = {};

    for (const t of transactions) {
      if (!map[t.customerId]) {
        map[t.customerId] = {
          id: t.customerId,
          type: t.customerType,
          gender: t.gender,
          totalSpent: 0,
          orders: 0,
          lastDate: t.date,
          avgRating: 0,
          ratingSum: 0,
        };
      }
      map[t.customerId].totalSpent += t.finalAmount;
      map[t.customerId].orders += 1;
      map[t.customerId].ratingSum += t.customerRating;
      if (t.date > map[t.customerId].lastDate) {
        map[t.customerId].lastDate = t.date;
      }
    }

    return Object.values(map)
      .map((c) => ({
        ...c,
        totalSpent: Number(c.totalSpent.toFixed(2)),
        avgRating: Number((c.ratingSum / c.orders).toFixed(1)),
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 15);
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Unique Shoppers</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatNumber(customerStats.uniqueCustomersCount)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Active customer profiles</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Avg Customer Lifetime Spend</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {formatCurrency(customerStats.averageCustomerSpending)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across all registered shoppers</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Loyalty Membership Share</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {customerStats.customerTypes.find((c) => c.name === 'Member')?.count || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">Enrolled discount club members</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Satisfaction Score</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">4.38 ★</div>
          <div className="text-xs text-slate-500 mt-1">Overall sentiment index</div>
        </div>
      </div>

      {/* Customer Segmentation Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Customer Classification</h3>
          <p className="text-xs text-slate-500 mb-4">Member club vs Standard walk-in</p>
          <div className="h-56">
            <Doughnut
              data={{
                labels: customerStats.customerTypes.map((c) => c.name),
                datasets: [
                  {
                    data: customerStats.customerTypes.map((c) => c.count),
                    backgroundColor: ['#6366f1', '#cbd5e1'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Gender Demographics</h3>
          <p className="text-xs text-slate-500 mb-4">Ratio of male to female shoppers</p>
          <div className="h-56">
            <Doughnut
              data={{
                labels: customerStats.genders.map((g) => g.name),
                datasets: [
                  {
                    data: customerStats.genders.map((g) => g.count),
                    backgroundColor: ['#ec4899', '#0284c7'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Rating Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Breakdown by star ratings</p>
          <div className="h-56">
            <Bar
              data={{
                labels: customerStats.ratingDistribution.map((r) => r.stars),
                datasets: [
                  {
                    label: 'Count',
                    data: customerStats.ratingDistribution.map((r) => r.count),
                    backgroundColor: '#f59e0b',
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                  y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Customer Profiles Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Highest Lifetime Value Shoppers</h3>
            <p className="text-xs text-slate-500">Top 15 ranked customers by gross revenue</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-4">Customer ID</th>
                <th className="py-2.5 px-4">Membership Type</th>
                <th className="py-2.5 px-4">Gender</th>
                <th className="py-2.5 px-4 text-center">Orders Placed</th>
                <th className="py-2.5 px-4 text-right">Total Lifetime Spend</th>
                <th className="py-2.5 px-4 text-right">Avg Order Size</th>
                <th className="py-2.5 px-4">Last Active</th>
                <th className="py-2.5 px-4 text-center">Avg Rating Given</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topSpenders.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-900">{c.id}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        c.type === 'Member'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">{c.gender}</td>
                  <td className="py-2.5 px-4 text-center font-medium text-slate-900">{c.orders}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(c.totalSpent)}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {formatCurrency(c.totalSpent / c.orders)}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">{c.lastDate}</td>
                  <td className="py-2.5 px-4 text-center text-amber-600 font-medium">{c.avgRating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
