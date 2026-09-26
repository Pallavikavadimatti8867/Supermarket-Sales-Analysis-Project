import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SalesProvider, useSales } from './context/SalesContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { KPICards } from './components/dashboard/KPICards';
import { FilterBar } from './components/dashboard/FilterBar';
import { SalesCharts } from './components/dashboard/SalesCharts';
import { SalesTable } from './components/sales/SalesTable';
import { ExecutiveDashboard } from './components/executives/ExecutiveDashboard';
import { ProductsView } from './components/products/ProductsView';
import { CustomersView } from './components/customers/CustomersView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ReportsView } from './components/reports/ReportsView';
import { DataCleaningView } from './components/cleaning/DataCleaningView';
import { ProjectFilesView } from './components/project/ProjectFilesView';
import { TransactionModal } from './components/sales/TransactionModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { kpis, filteredTransactions, toasts, dismissToast, addTransaction } = useSales();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onNavigateToCleaning={() => setCurrentTab('cleaning')}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {currentTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Live KPI Cards */}
              <KPICards kpis={kpis} />

              {/* Multi-Dimensional Filter Bar */}
              <FilterBar />

              {/* Interactive Chart.js Visualizations */}
              <SalesCharts transactions={filteredTransactions} />

              {/* Quick Transaction Ledger Preview */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Recent Sales Stream</h3>
                  <button
                    onClick={() => setCurrentTab('sales')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                  >
                    View All Sales Records (CRUD) →
                  </button>
                </div>
                <SalesTable />
              </div>
            </div>
          )}

          {currentTab === 'sales' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <FilterBar />
              <SalesTable />
            </div>
          )}

          {currentTab === 'executives' && (
            <div className="animate-in fade-in duration-150">
              <ExecutiveDashboard />
            </div>
          )}

          {currentTab === 'products' && (
            <div className="animate-in fade-in duration-150">
              <ProductsView />
            </div>
          )}

          {currentTab === 'customers' && (
            <div className="animate-in fade-in duration-150">
              <CustomersView />
            </div>
          )}

          {currentTab === 'analytics' && (
            <div className="animate-in fade-in duration-150">
              <AnalyticsView />
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="animate-in fade-in duration-150">
              <ReportsView />
            </div>
          )}

          {currentTab === 'cleaning' && (
            <div className="animate-in fade-in duration-150">
              <DataCleaningView />
            </div>
          )}

          {currentTab === 'project' && (
            <div className="animate-in fade-in duration-150">
              <ProjectFilesView />
            </div>
          )}
        </main>
      </div>

      {/* Global Add Sales Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(data) => addTransaction(data)}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3 rounded-xl shadow-lg border text-xs animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : toast.type === 'info'
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SalesProvider>
        <DashboardContent />
      </SalesProvider>
    </AuthProvider>
  );
}
