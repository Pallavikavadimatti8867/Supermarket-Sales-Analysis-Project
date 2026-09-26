import React, { useState, useMemo } from 'react';
import { Package, Search, Tag, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import { useSales } from '../../context/SalesContext';
import { calculateProductAnalysis, formatCurrency, formatNumber } from '../../utils/calculations';

export const ProductsView: React.FC = () => {
  const { transactions } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const productStats = useMemo(() => {
    return calculateProductAnalysis(transactions);
  }, [transactions]);

  const categories = [
    'Health and Beauty',
    'Electronic Accessories',
    'Home and Lifestyle',
    'Sports and Travel',
    'Food and Beverages',
    'Fashion Accessories',
  ];

  // Merge catalog with actual transaction performance
  const combinedProducts = useMemo(() => {
    return PRODUCTS.map((p) => {
      const stat = productStats.all.find((s) => s.id === p.id);
      return {
        ...p,
        unitsSold: stat ? stat.quantity : 0,
        revenue: stat ? stat.revenue : 0,
        rating: stat ? stat.avgRating : 4.5,
        txCount: stat ? stat.transactions : 0,
      };
    }).filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.sku.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    }).sort((a, b) => b.revenue - a.revenue);
  }, [productStats, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Catalog Inventory</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{PRODUCTS.length} SKUs Listed</div>
          <div className="text-xs text-slate-500 mt-1">Across 6 major retail categories</div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Top Revenue Leader</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {productStats.top10[0]?.name || 'N/A'}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {formatCurrency(productStats.top10[0]?.revenue || 0)} gross sales
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Lowest Volume Item</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {productStats.bottom5[0]?.name || 'N/A'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {productStats.bottom5[0]?.quantity || 0} units moved
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">SKU / ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">In Stock</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4 text-right">Total Revenue</th>
                <th className="py-3 px-4 text-center">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {combinedProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">{p.sku}</td>
                  <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                    <span>{p.name}</span>
                    {idx < 3 && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded-sm font-semibold">
                        Top {idx + 1}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{p.category}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(p.unitPrice)}</td>
                  <td className="py-3 px-4 text-center font-medium">
                    <span className={p.inStock < 70 ? 'text-amber-600 font-bold' : 'text-slate-700'}>
                      {p.inStock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-900">{formatNumber(p.unitsSold)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(p.revenue)}</td>
                  <td className="py-3 px-4 text-center text-amber-600 font-medium">{p.rating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
