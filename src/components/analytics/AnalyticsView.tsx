import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Layers,
  Users,
  Award,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import {
  calculateDailyAnalysis,
  calculateMonthlyAnalysis,
  calculateCategoryAnalysis,
  calculateProductAnalysis,
  calculateCustomerAnalysis,
  calculateExecutiveAnalysis,
  formatCurrency,
  formatNumber,
} from '../../utils/calculations';
import { exportToCSV } from '../../utils/csvExport';

export const AnalyticsView: React.FC = () => {
  const { filteredTransactions } = useSales();
  const [activeTab, setActiveTab] = useState<'monthly' | 'daily' | 'product' | 'category' | 'executive'>('monthly');

  const monthlyStats = useMemo(() => calculateMonthlyAnalysis(filteredTransactions), [filteredTransactions]);
  const dailyStats = useMemo(() => calculateDailyAnalysis(filteredTransactions, 30), [filteredTransactions]);
  const productStats = useMemo(() => calculateProductAnalysis(filteredTransactions), [filteredTransactions]);
  const categoryStats = useMemo(() => calculateCategoryAnalysis(filteredTransactions), [filteredTransactions]);
  const executiveStats = useMemo(() => calculateExecutiveAnalysis(filteredTransactions), [filteredTransactions]);

  const tabs = [
    { id: 'monthly', label: 'Monthly Growth & Trends', icon: TrendingUp },
    { id: 'daily', label: 'Daily Run Rate', icon: Calendar },
    { id: 'product', label: 'Product Performance', icon: BarChart3 },
    { id: 'category', label: 'Category Pareto', icon: Layers },
    { id: 'executive', label: 'Executive Benchmarking', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 pr-2">
          Computed live via dynamic statistical pipeline
        </div>
      </div>

      {/* Tab 1: Monthly Analysis */}
      {activeTab === 'monthly' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Monthly Sales & Growth Velocity</h3>
              <p className="text-xs text-slate-500">Aggregated revenue, order volume, and month-over-month rate</p>
            </div>
            <span className="text-xs text-slate-500">{monthlyStats.length} calendar months</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Calendar Month</th>
                  <th className="py-3 px-4 text-center">Transactions</th>
                  <th className="py-3 px-4 text-center">Quantity Sold</th>
                  <th className="py-3 px-4 text-right">Avg Order Value</th>
                  <th className="py-3 px-4 text-right">Gross Revenue</th>
                  <th className="py-3 px-4 text-right">MoM Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyStats.map((m) => (
                  <tr key={m.monthKey} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{m.monthName}</td>
                    <td className="py-3 px-4 text-center">{formatNumber(m.transactions)}</td>
                    <td className="py-3 px-4 text-center">{formatNumber(m.quantity)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(m.aov)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(m.sales)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {m.growth > 0 ? (
                        <span className="inline-flex items-center text-emerald-600 font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +{m.growth}%
                        </span>
                      ) : m.growth < 0 ? (
                        <span className="inline-flex items-center text-rose-600 font-semibold">
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> {m.growth}%
                        </span>
                      ) : (
                        <span className="text-slate-400">Baseline</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Run Rate */}
      {activeTab === 'daily' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Daily Sales Run-Rate</h3>
              <p className="text-xs text-slate-500">Day-by-day operations ledger (last 30 active trading days)</p>
            </div>
            <span className="text-xs text-slate-500">{dailyStats.length} days captured</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Daily AOV</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyStats.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-900">{d.date}</td>
                    <td className="py-2.5 px-4 text-center">{d.transactions}</td>
                    <td className="py-2.5 px-4 text-center">{d.quantity}</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(d.aov)}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(d.sales)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Product Analysis */}
      {activeTab === 'product' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Sellers */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-emerald-50/40">
                <h3 className="text-sm font-semibold text-emerald-900">Top 5 Best-Selling Products</h3>
                <p className="text-xs text-emerald-700">Highest grossing supermarket merchandise</p>
              </div>
              <div className="divide-y divide-slate-100">
                {productStats.top10.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {i + 1}. {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {p.category} · {p.quantity} units sold
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatCurrency(p.revenue)}</div>
                      <div className="text-[11px] text-amber-600 font-medium">{p.avgRating} ★</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lowest Volume Sellers */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-amber-50/40">
                <h3 className="text-sm font-semibold text-amber-900">Lowest Moving Products</h3>
                <p className="text-xs text-amber-700">Items requiring restocking review or discount pushes</p>
              </div>
              <div className="divide-y divide-slate-100">
                {productStats.bottom5.map((p, i) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.category} · {p.quantity} units moved
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatCurrency(p.revenue)}</div>
                      <div className="text-[11px] text-slate-500">{p.transactions} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Category Pareto */}
      {activeTab === 'category' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Category Revenue Contribution & Share</h3>
            <p className="text-xs text-slate-500">Departmental breakdown with share percentage</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Department Category</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Total Sales</th>
                  <th className="py-3 px-4 text-right">Contribution %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryStats.map((c) => (
                  <tr key={c.category} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.category}</td>
                    <td className="py-3 px-4 text-center">{formatNumber(c.transactions)}</td>
                    <td className="py-3 px-4 text-center">{formatNumber(c.quantity)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(c.sales)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${c.contributionPercent}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-900">{c.contributionPercent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Executive Benchmarking */}
      {activeTab === 'executive' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Sales Executive Performance Ranking</h3>
            <p className="text-xs text-slate-500">Cross-rep comparative analysis by total sales volume</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Rank & Executive</th>
                  <th className="py-3 px-4">Assigned Branch</th>
                  <th className="py-3 px-4 text-center">Transactions</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Average Ticket (AOV)</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                  <th className="py-3 px-4 text-center">Shopper Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {executiveStats.map((e, idx) => (
                  <tr key={e.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{e.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{e.branch}</td>
                    <td className="py-3 px-4 text-center font-medium">{e.transactions}</td>
                    <td className="py-3 px-4 text-center">{e.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(e.aov)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(e.sales)}
                    </td>
                    <td className="py-3 px-4 text-center text-amber-600 font-semibold">
                      {e.avgRating} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
