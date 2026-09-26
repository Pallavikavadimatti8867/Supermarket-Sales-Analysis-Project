import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Star,
  Award,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Package,
} from 'lucide-react';
import { SALES_EXECUTIVES } from '../../data/mockData';
import { useSales } from '../../context/SalesContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { Line } from 'react-chartjs-2';

export const ExecutiveDashboard: React.FC = () => {
  const { transactions } = useSales();
  const { currentUser, isExecutive } = useAuth();

  // Selected executive
  const [selectedExecName, setSelectedExecName] = useState<string>(() => {
    if (isExecutive && currentUser) {
      return currentUser.name;
    }
    return SALES_EXECUTIVES[0].name;
  });

  // Time preset filter for the executive module
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'last7days' | 'thisMonth' | 'prevMonth' | 'all'>('thisMonth');

  // Combined list of executives including current user if executive
  const allExecs = useMemo(() => {
    const list = [...SALES_EXECUTIVES];
    if (currentUser && isExecutive && !list.some((e) => e.name === currentUser.name || e.email === currentUser.email)) {
      list.unshift({
        name: currentUser.name,
        email: currentUser.email,
        branch: (currentUser.branch as any) || 'Branch A',
        target: 75000,
      });
    }
    return list;
  }, [currentUser, isExecutive]);

  const selectedExec = useMemo(() => {
    return allExecs.find((e) => e.name === selectedExecName) || allExecs[0];
  }, [allExecs, selectedExecName]);

  // Filter transactions for this executive and date range
  const execTransactions = useMemo(() => {
    const todayStr = '2026-09-26';
    const today = new Date('2026-09-26T12:00:00Z');

    return transactions.filter((t) => {
      if (t.salesExecutive !== selectedExec.name) return false;

      if (dateFilter === 'today') {
        return t.date === todayStr;
      }
      if (dateFilter === 'yesterday') {
        const y = new Date(today);
        y.setDate(y.getDate() - 1);
        return t.date === y.toISOString().split('T')[0];
      }
      if (dateFilter === 'last7days') {
        const d7 = new Date(today);
        d7.setDate(d7.getDate() - 7);
        return t.date >= d7.toISOString().split('T')[0];
      }
      if (dateFilter === 'thisMonth') {
        return t.date.startsWith('2026-09');
      }
      if (dateFilter === 'prevMonth') {
        return t.date.startsWith('2026-08');
      }
      return true;
    });
  }, [transactions, selectedExec.name, dateFilter]);

  // Calculate executive KPI metrics
  const execKPIs = useMemo(() => {
    let sales = 0;
    let units = 0;
    let ratingSum = 0;

    for (const t of execTransactions) {
      sales += t.finalAmount;
      units += t.quantity;
      ratingSum += t.customerRating;
    }

    const txCount = execTransactions.length;
    const aov = txCount > 0 ? sales / txCount : 0;
    const avgRating = txCount > 0 ? ratingSum / txCount : 0;
    const target = selectedExec.target;
    const achievementPercent = target > 0 ? Math.min(100, (sales / target) * 100) : 0;

    return {
      sales,
      units,
      txCount,
      aov,
      avgRating,
      target,
      achievementPercent,
    };
  }, [execTransactions, selectedExec.target]);

  // Today specific stats
  const todayTransactions = useMemo(() => {
    return transactions.filter((t) => t.salesExecutive === selectedExec.name && t.date === '2026-09-26');
  }, [transactions, selectedExec.name]);

  const todaySales = todayTransactions.reduce((acc, t) => acc + t.finalAmount, 0);

  // Mini trend chart data
  const trendDays = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of execTransactions) {
      map[t.date] = (map[t.date] || 0) + t.finalAmount;
    }
    const sorted = Object.keys(map).sort().slice(-14);
    return {
      labels: sorted.map((d) => d.slice(5)),
      data: sorted.map((d) => map[d]),
    };
  }, [execTransactions]);

  const chartData = {
    labels: trendDays.labels,
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: trendDays.data,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Executive Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-lg">
            {selectedExec.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{selectedExec.name}</h2>
              <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md font-medium">
                Sales Executive
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedExec.branch}
              </span>
              <span>·</span>
              <span>{selectedExec.email}</span>
            </div>
          </div>
        </div>

        {/* Change Executive dropdown (Admin or preview switch) */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Switch Executive:</label>
            <select
              value={selectedExecName}
              onChange={(e) => setSelectedExecName(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {allExecs.map((exec) => (
                <option key={exec.name} value={exec.name}>
                  {exec.name} ({exec.branch})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Date Scope:</label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { key: 'today', label: 'Today' },
                { key: 'yesterday', label: 'Yesterday' },
                { key: 'last7days', label: '7 Days' },
                { key: 'thisMonth', label: 'This Month' },
                { key: 'prevMonth', label: 'Prev Month' },
                { key: 'all', label: 'All' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setDateFilter(btn.key as any)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    dateFilter === btn.key
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards for the Executive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Period Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(execKPIs.sales)}</div>
          <div className="mt-1 text-xs text-slate-500">
            Target: {formatCurrency(execKPIs.target)} ({execKPIs.achievementPercent.toFixed(1)}%)
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${execKPIs.achievementPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Today's Performance</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(todaySales)}</div>
          <div className="mt-1 text-xs text-slate-500">
            {todayTransactions.length} transactions processed today
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Avg Order Value & Units</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(execKPIs.aov)}</div>
          <div className="mt-1 text-xs text-slate-500">{formatNumber(execKPIs.units)} total units sold</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Shopper Satisfaction</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{execKPIs.avgRating.toFixed(2)} ★</div>
          <div className="mt-1 text-xs text-slate-500">Based on {execKPIs.txCount} customer ratings</div>
        </div>
      </div>

      {/* Middle Row: Trend Chart & Performance Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Personal Sales Trend</h3>
              <p className="text-xs text-slate-500">Day-by-day revenue generated by {selectedExec.name}</p>
            </div>
          </div>
          <div className="h-64">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                  y: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { callback: (v: any) => `$${v}`, font: { size: 10 } },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Milestone Targets */}
        <div className="lg:col-span-4 bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Target Milestones</h3>
            <p className="text-xs text-slate-500">Executive monthly objectives</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Gross Sales Target</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(execKPIs.sales)} / {formatCurrency(selectedExec.target)}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, execKPIs.achievementPercent)}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Customer Rating (Target 4.5+)</span>
                <span className="font-semibold text-slate-900">{execKPIs.avgRating.toFixed(2)} ★</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (execKPIs.avgRating / 5) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Loyalty Member Conversions</span>
                <span className="font-semibold text-slate-900">
                  {execTransactions.filter((t) => t.customerType === 'Member').length} / {execTransactions.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{
                    width: `${
                      execTransactions.length > 0
                        ? (execTransactions.filter((t) => t.customerType === 'Member').length /
                            execTransactions.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions by this Executive */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Transactions Log</h3>
            <p className="text-xs text-slate-500">Orders closed by {selectedExec.name}</p>
          </div>
          <span className="text-xs text-slate-500">{execTransactions.length} total in selection</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-4">Invoice ID</th>
                <th className="py-2.5 px-4">Date & Time</th>
                <th className="py-2.5 px-4">Product</th>
                <th className="py-2.5 px-4 text-center">Qty</th>
                <th className="py-2.5 px-4 text-right">Final Amount</th>
                <th className="py-2.5 px-4">Payment</th>
                <th className="py-2.5 px-4 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {execTransactions.slice(0, 10).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-900">{t.invoiceId}</td>
                  <td className="py-2.5 px-4">
                    {t.date} <span className="text-slate-400">{t.time}</span>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-900">{t.productName}</td>
                  <td className="py-2.5 px-4 text-center">{t.quantity}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                    {formatCurrency(t.finalAmount)}
                  </td>
                  <td className="py-2.5 px-4">{t.paymentMethod}</td>
                  <td className="py-2.5 px-4 text-center text-amber-600 font-medium">{t.customerRating}★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
