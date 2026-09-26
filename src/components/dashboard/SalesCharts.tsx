import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { SaleTransaction } from '../../types';
import {
  calculateDailyAnalysis,
  calculateMonthlyAnalysis,
  calculateCategoryAnalysis,
  calculateProductAnalysis,
  calculatePaymentAnalysis,
  calculateCustomerAnalysis,
  calculateBranchAnalysis,
  calculateExecutiveAnalysis,
  formatCurrency,
} from '../../utils/calculations';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface SalesChartsProps {
  transactions: SaleTransaction[];
}

export const SalesCharts: React.FC<SalesChartsProps> = ({ transactions }) => {
  // 1. Daily Sales Trend
  const dailyData = useMemo(() => calculateDailyAnalysis(transactions, 21), [transactions]);
  // 2. Monthly Revenue
  const monthlyData = useMemo(() => calculateMonthlyAnalysis(transactions), [transactions]);
  // 3. Category Sales & Quantity
  const categoryData = useMemo(() => calculateCategoryAnalysis(transactions), [transactions]);
  // 4. Products Analysis (Top 10)
  const productData = useMemo(() => calculateProductAnalysis(transactions), [transactions]);
  // 5. Payment Methods
  const paymentData = useMemo(() => calculatePaymentAnalysis(transactions), [transactions]);
  // 6. Customer & Gender & Ratings
  const customerData = useMemo(() => calculateCustomerAnalysis(transactions), [transactions]);
  // 7. Branches
  const branchData = useMemo(() => calculateBranchAnalysis(transactions), [transactions]);
  // 8. Sales Executives
  const execData = useMemo(() => calculateExecutiveAnalysis(transactions), [transactions]);

  // Color Palettes
  const palette = [
    '#2563eb', // Blue
    '#059669', // Emerald
    '#d97706', // Amber
    '#7c3aed', // Purple
    '#dc2626', // Red
    '#0891b2', // Cyan
  ];

  // 1. Sales Trend Over Time
  const trendChartData = {
    labels: dailyData.map((d) => d.date.slice(5)), // MM-DD
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: dailyData.map((d) => d.sales),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  // 2. Monthly Revenue & Growth
  const monthlyChartData = {
    labels: monthlyData.map((m) => m.monthName),
    datasets: [
      {
        label: 'Revenue ($)',
        data: monthlyData.map((m) => m.sales),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

  // 3. Sales by Product Category
  const categoryChartData = {
    labels: categoryData.map((c) => c.category),
    datasets: [
      {
        data: categoryData.map((c) => c.sales),
        backgroundColor: palette,
        borderWidth: 1,
      },
    ],
  };

  // 4. Top 10 Products by Revenue
  const topProductsChartData = {
    labels: productData.top10.map((p) => p.name.length > 18 ? p.name.substring(0, 16) + '...' : p.name),
    datasets: [
      {
        label: 'Revenue ($)',
        data: productData.top10.map((p) => p.revenue),
        backgroundColor: '#059669',
        borderRadius: 4,
      },
    ],
  };

  // 5. Payment Method Distribution
  const paymentChartData = {
    labels: paymentData.map((p) => p.method),
    datasets: [
      {
        data: paymentData.map((p) => p.total),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 1,
      },
    ],
  };

  // 6. Customer Type Distribution
  const customerTypeChartData = {
    labels: customerData.customerTypes.map((c) => c.name),
    datasets: [
      {
        data: customerData.customerTypes.map((c) => c.count),
        backgroundColor: ['#6366f1', '#94a3b8'],
        borderWidth: 1,
      },
    ],
  };

  // 7. Gender Distribution
  const genderChartData = {
    labels: customerData.genders.map((g) => g.name),
    datasets: [
      {
        data: customerData.genders.map((g) => g.count),
        backgroundColor: ['#ec4899', '#0284c7'],
        borderWidth: 1,
      },
    ],
  };

  // 8. Sales by Branch
  const branchChartData = {
    labels: branchData.map((b) => `${b.branch} (${b.city})`),
    datasets: [
      {
        label: 'Sales ($)',
        data: branchData.map((b) => b.sales),
        backgroundColor: ['#2563eb', '#10b981', '#f97316'],
        borderRadius: 4,
      },
    ],
  };

  // 9. Sales Executive Performance
  const execChartData = {
    labels: execData.map((e) => e.name),
    datasets: [
      {
        label: 'Sales Revenue ($)',
        data: execData.map((e) => e.sales),
        backgroundColor: '#7c3aed',
        borderRadius: 4,
      },
    ],
  };

  // 10. Quantity Sold by Category
  const catQtyChartData = {
    labels: categoryData.map((c) => c.category),
    datasets: [
      {
        label: 'Units Sold',
        data: categoryData.map((c) => c.quantity),
        backgroundColor: '#0891b2',
        borderRadius: 4,
      },
    ],
  };

  // 11. Customer Rating Distribution
  const ratingChartData = {
    labels: customerData.ratingDistribution.map((r) => r.stars),
    datasets: [
      {
        label: 'Review Count',
        data: customerData.ratingDistribution.map((r) => r.count),
        backgroundColor: '#f59e0b',
        borderRadius: 4,
      },
    ],
  };

  // 12. Quantity vs Revenue (Volume vs Value by Category)
  const volumeValueChartData = {
    labels: categoryData.map((c) => c.category.split(' ')[0]),
    datasets: [
      {
        label: 'Total Units Sold',
        data: categoryData.map((c) => c.quantity),
        backgroundColor: '#60a5fa',
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        label: 'Total Revenue ($)',
        data: categoryData.map((c) => c.sales),
        backgroundColor: '#10b981',
        borderRadius: 4,
        yAxisID: 'y1',
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 11, family: 'Inter, system-ui' } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 11 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 10 } },
      },
    },
  };

  const horizontalOptions = {
    ...commonOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          callback: (value: any) => `$${value}`,
          font: { size: 10 },
        },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Primary Row: Sales Trend & Monthly Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Sales Trend Over Time</h3>
              <p className="text-xs text-slate-500">Daily revenue pattern over the most recent active period</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total in Period:</span>
              <span className="ml-1 text-xs font-semibold text-blue-600">
                {formatCurrency(dailyData.reduce((acc, d) => acc + d.sales, 0))}
              </span>
            </div>
          </div>
          <div className="h-72">
            <Line data={trendChartData} options={commonOptions} />
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Monthly Revenue</h3>
            <p className="text-xs text-slate-500">Revenue aggregation across calendar months</p>
          </div>
          <div className="h-72">
            <Bar data={monthlyChartData} options={commonOptions} />
          </div>
        </div>
      </div>

      {/* Row 2: Top Products & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Top 10 Products by Revenue</h3>
              <p className="text-xs text-slate-500">Highest grossing items in selected timeframe</p>
            </div>
          </div>
          <div className="h-80">
            <Bar data={topProductsChartData} options={horizontalOptions} />
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Sales by Product Category</h3>
            <p className="text-xs text-slate-500">Revenue distribution by department</p>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { size: 10 } },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Demographics & Branches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Payment Methods</h3>
            <p className="text-xs text-slate-500">Ewallet vs Cash vs Credit Card</p>
          </div>
          <div className="h-56 flex items-center justify-center">
            <Doughnut
              data={paymentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Customer Type & Gender</h3>
            <p className="text-xs text-slate-500">Member loyalty & gender split</p>
          </div>
          <div className="grid grid-cols-2 gap-2 h-56 items-center">
            <div className="h-48">
              <Doughnut
                data={customerTypeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } },
                }}
              />
            </div>
            <div className="h-48">
              <Doughnut
                data={genderChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } },
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Sales by Branch</h3>
            <p className="text-xs text-slate-500">Yangon, Mandalay & Naypyitaw</p>
          </div>
          <div className="h-56">
            <Bar data={branchChartData} options={commonOptions} />
          </div>
        </div>
      </div>

      {/* Row 4: Executive Performance & Volume vs Value & Customer Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Sales Executive Performance</h3>
            <p className="text-xs text-slate-500">Individual revenue generated</p>
          </div>
          <div className="h-64">
            <Bar data={execChartData} options={commonOptions} />
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Units vs Revenue by Category</h3>
            <p className="text-xs text-slate-500">Volume sold vs gross dollars</p>
          </div>
          <div className="h-64">
            <Bar
              data={volumeValueChartData}
              options={{
                ...commonOptions,
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    title: { display: true, text: 'Units', font: { size: 9 } },
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    grid: { display: false },
                    title: { display: true, text: 'Revenue ($)', font: { size: 9 } },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Customer Rating Distribution</h3>
            <p className="text-xs text-slate-500">Ratings across 1.0 - 5.0 stars</p>
          </div>
          <div className="h-64">
            <Bar data={ratingChartData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
