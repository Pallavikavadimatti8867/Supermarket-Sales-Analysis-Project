import React, { useState } from 'react';
import { Filter, RotateCcw, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { PRODUCTS, SALES_EXECUTIVES } from '../../data/mockData';

export const FilterBar: React.FC = () => {
  const { filters, updateFilters, resetFilters, filteredTransactions, transactions } = useSales();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    'Health and Beauty',
    'Electronic Accessories',
    'Home and Lifestyle',
    'Sports and Travel',
    'Food and Beverages',
    'Fashion Accessories',
  ];

  const datePresets = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Prev Month', value: 'prevMonth' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
      {/* Primary Row: Date Preset Buttons & Search/Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Date presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs text-slate-500 mr-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-medium">Period:</span>
          </div>
          {datePresets.map((preset) => {
            const isActive = filters.datePreset === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => updateFilters({ datePreset: preset.value as any })}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredTransactions.length}</strong> of{' '}
            {transactions.length} records
          </span>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            onClick={resetFilters}
            title="Reset all filters"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Dropdowns Drawer */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Branch */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => updateFilters({ branch: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Branches</option>
              <option value="Branch A">Branch A (Yangon)</option>
              <option value="Branch B">Branch B (Mandalay)</option>
              <option value="Branch C">Branch C (Naypyitaw)</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Product Category</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sales Executive */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Sales Executive</label>
            <select
              value={filters.salesExecutive}
              onChange={(e) => updateFilters({ salesExecutive: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Executives</option>
              {SALES_EXECUTIVES.map((exec) => (
                <option key={exec.name} value={exec.name}>
                  {exec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => updateFilters({ paymentMethod: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Methods</option>
              <option value="Ewallet">Ewallet</option>
              <option value="Cash">Cash</option>
              <option value="Credit card">Credit card</option>
            </select>
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Customer Type</label>
            <select
              value={filters.customerType}
              onChange={(e) => updateFilters({ customerType: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Types</option>
              <option value="Member">Member</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => updateFilters({ gender: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Custom Date Range */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Custom Date Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilters({ startDate: e.target.value, datePreset: 'custom' })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilters({ endDate: e.target.value, datePreset: 'custom' })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
