import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  Calendar,
  Layers,
  Award,
  Users,
  Package,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import {
  calculateDailyAnalysis,
  calculateMonthlyAnalysis,
  calculateCategoryAnalysis,
  calculateProductAnalysis,
  calculateExecutiveAnalysis,
  formatCurrency,
  formatNumber,
} from '../../utils/calculations';
import { exportToCSV, exportToExcel } from '../../utils/csvExport';

type ReportType = 'daily' | 'monthly' | 'product' | 'category' | 'executive';

export const ReportsView: React.FC = () => {
  const { filteredTransactions, transactions } = useSales();
  const [reportType, setReportType] = useState<ReportType>('monthly');

  const daily = useMemo(() => calculateDailyAnalysis(filteredTransactions, 60), [filteredTransactions]);
  const monthly = useMemo(() => calculateMonthlyAnalysis(filteredTransactions), [filteredTransactions]);
  const product = useMemo(() => calculateProductAnalysis(filteredTransactions), [filteredTransactions]);
  const category = useMemo(() => calculateCategoryAnalysis(filteredTransactions), [filteredTransactions]);
  const executive = useMemo(() => calculateExecutiveAnalysis(filteredTransactions), [filteredTransactions]);

  const handlePrint = () => {
    window.print();
  };

  const reportConfigs: Record<
    ReportType,
    { title: string; subtitle: string; icon: any; count: number }
  > = {
    daily: {
      title: 'Daily Sales & Run-Rate Audit',
      subtitle: 'Daily transaction counts, units sold, and revenues',
      icon: Calendar,
      count: daily.length,
    },
    monthly: {
      title: 'Monthly Executive Financial Statement',
      subtitle: 'Month-by-month gross revenues, margins, and growth velocities',
      icon: FileText,
      count: monthly.length,
    },
    product: {
      title: 'SKU Inventory & Product Profitability',
      subtitle: 'Sales performance and volume by stock item',
      icon: Package,
      count: product.all.length,
    },
    category: {
      title: 'Departmental Category Contribution',
      subtitle: 'Departmental sales share, volume distribution, and tax impact',
      icon: Layers,
      count: category.length,
    },
    executive: {
      title: 'Sales Executive Performance Ledger',
      subtitle: 'Sales team volume, ticket size, and commission benchmarks',
      icon: Award,
      count: executive.length,
    },
  };

  const currentConfig = reportConfigs[reportType];
  const Icon = currentConfig.icon;

  return (
    <div className="space-y-6">
      {/* Report Type Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {(Object.keys(reportConfigs) as ReportType[]).map((type) => {
          const cfg = reportConfigs[type];
          const TabIcon = cfg.icon;
          const isSelected = reportType === type;
          return (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <TabIcon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
              <div className="text-xs font-semibold">{cfg.title.split(' ')[0]} Report</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {cfg.count} entries
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Report Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header & Export Toolbar */}
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentConfig.title}</h2>
              <p className="text-xs text-slate-500">{currentConfig.subtitle}</p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportToCSV(filteredTransactions, `${reportType}_supermarket_report_${Date.now()}.csv`)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() =>
                exportToExcel(filteredTransactions, `${reportType}_supermarket_report_${Date.now()}.xls`)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF Report</span>
            </button>
          </div>
        </div>

        {/* Dynamic Report Content Table */}
        <div className="overflow-x-auto p-2">
          {reportType === 'monthly' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Period Month</th>
                  <th className="py-3 px-4 text-center">Transactions</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Average Order Value</th>
                  <th className="py-3 px-4 text-right">Net Sales Total</th>
                  <th className="py-3 px-4 text-right">Growth %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthly.map((m) => (
                  <tr key={m.monthKey} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{m.monthName}</td>
                    <td className="py-3 px-4 text-center">{formatNumber(m.transactions)}</td>
                    <td className="py-3 px-4 text-center">{formatNumber(m.quantity)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(m.aov)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(m.sales)}</td>
                    <td className="py-3 px-4 text-right">
                      {m.growth > 0 ? `+${m.growth}%` : `${m.growth}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'daily' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Transaction Date</th>
                  <th className="py-3 px-4 text-center">Completed Orders</th>
                  <th className="py-3 px-4 text-center">Units Dispensed</th>
                  <th className="py-3 px-4 text-right">Average Ticket</th>
                  <th className="py-3 px-4 text-right">Daily Gross Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daily.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-900">{d.date}</td>
                    <td className="py-2.5 px-4 text-center">{d.transactions}</td>
                    <td className="py-2.5 px-4 text-center">{d.quantity}</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(d.aov)}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatCurrency(d.sales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'product' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Item SKU / Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-center">Total Units Sold</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                  <th className="py-3 px-4 text-center">Shopper Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {product.all.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-500">{p.category}</td>
                    <td className="py-3 px-4 text-center">{p.transactions}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-900">{p.quantity}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(p.revenue)}</td>
                    <td className="py-3 px-4 text-center text-amber-600">{p.avgRating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'category' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Supermarket Department</th>
                  <th className="py-3 px-4 text-center">Transactions</th>
                  <th className="py-3 px-4 text-center">Units Moved</th>
                  <th className="py-3 px-4 text-right">Department Revenue</th>
                  <th className="py-3 px-4 text-right">Contribution %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {category.map((c) => (
                  <tr key={c.category} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.category}</td>
                    <td className="py-3 px-4 text-center">{c.transactions}</td>
                    <td className="py-3 px-4 text-center">{c.quantity}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(c.sales)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">{c.contributionPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'executive' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Sales Executive</th>
                  <th className="py-3 px-4">Branch Station</th>
                  <th className="py-3 px-4 text-center">Transactions</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Average Order Value</th>
                  <th className="py-3 px-4 text-right">Gross Sales Produced</th>
                  <th className="py-3 px-4 text-center">Shopper Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {executive.map((e) => (
                  <tr key={e.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{e.name}</td>
                    <td className="py-3 px-4 text-slate-500">{e.branch}</td>
                    <td className="py-3 px-4 text-center">{e.transactions}</td>
                    <td className="py-3 px-4 text-center">{e.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(e.aov)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(e.sales)}</td>
                    <td className="py-3 px-4 text-center text-amber-600 font-medium">{e.avgRating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
