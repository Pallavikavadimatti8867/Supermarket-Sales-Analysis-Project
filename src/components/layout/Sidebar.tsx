import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  UserCheck,
  BarChart3,
  FileText,
  Sparkles,
  Terminal,
  Plus,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'sales'
  | 'products'
  | 'customers'
  | 'executives'
  | 'analytics'
  | 'reports'
  | 'cleaning'
  | 'project';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
}) => {
  const { isAdmin, currentUser, logout, logoutAll } = useAuth();

  const navItems: { id: NavTab; label: string; icon: any; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales Records (CRUD)', icon: ShoppingCart },
    { id: 'executives', label: 'Executive Module', icon: UserCheck },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'customers', label: 'Customer Insights', icon: Users },
    { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'cleaning', label: 'Data Cleaning & Ingest', icon: Sparkles },
    { id: 'project', label: 'VS Code & Viva Guide', icon: Terminal },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen">
      {/* Top Quick Action */}
      <div className="p-4 border-b border-slate-800">
        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Sales Transaction</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Menu Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-2 border-t border-slate-800/80 mt-2 space-y-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out Current User</span>
          </button>

          <button
            onClick={logoutAll}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout All Email IDs</span>
          </button>
        </div>
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400 font-medium">Logged in Role:</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              isAdmin ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
            }`}
          >
            {isAdmin ? 'Admin' : 'Admin Executer'}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 truncate font-mono">
          {currentUser?.email}
        </div>
      </div>
    </aside>
  );
};
