import React from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp, Users, Tag, Receipt, Star } from 'lucide-react';
import { KPIData } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculations';

interface KPICardsProps {
  kpis: KPIData;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(kpis.totalSales),
      subtitle: `${kpis.salesGrowth}% vs prev period`,
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Total Transactions',
      value: formatNumber(kpis.totalTransactions),
      subtitle: 'Recorded sales orders',
      icon: ShoppingCart,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Products Sold',
      value: formatNumber(kpis.totalProductsSold),
      subtitle: 'Total units moved',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(kpis.averageOrderValue),
      subtitle: 'Revenue per transaction',
      icon: TrendingUp,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      title: 'Total Customers',
      value: formatNumber(kpis.totalCustomers),
      subtitle: 'Unique shopper IDs',
      icon: Users,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      title: 'Total Discounts',
      value: formatCurrency(kpis.totalDiscount),
      subtitle: 'Promotional savings given',
      icon: Tag,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Total Tax (5%)',
      value: formatCurrency(kpis.totalTax),
      subtitle: 'VAT collected',
      icon: Receipt,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      title: 'Avg Customer Rating',
      value: `${kpis.averageRating.toFixed(2)} ★`,
      subtitle: 'Out of 5.0 rating scale',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4 border border-slate-200 rounded-xl transition-shadow hover:shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-slate-900">{card.value}</div>
            <div className="mt-1 text-xs text-slate-500">{card.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
};
