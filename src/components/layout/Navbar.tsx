import React from 'react';
import {
  Store,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Bell,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSales } from '../../context/SalesContext';

interface NavbarProps {
  onOpenSearch?: () => void;
  onNavigateToCleaning?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToCleaning }) => {
  const { currentUser, logout, logoutAll, switchUser, availableUsers, isAdmin } = useAuth();
  const { qualityReport } = useSales();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
          <Store className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              METRO SUPERMARKET
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live BI Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Sales Analysis & Intelligence Dashboard
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Data health quick alert */}
        <button
          onClick={onNavigateToCleaning}
          title="Data Quality Health Status"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Health: {qualityReport.qualityPercentage}%</span>
        </button>

        {/* User Switcher Dropdown (for quick evaluation) */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-xs">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser?.name.charAt(0) || 'U'
              )}
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">
                  {currentUser?.name}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Admin Executer'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {currentUser?.email}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Quick User Switch Menu */}
          <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Role / Account Switch:
            </div>
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  currentUser?.id === u.id
                    ? 'bg-slate-100 font-semibold text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 truncate">
                  <div className="truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.email}</div>
                </div>
                <span className="text-[9px] font-semibold uppercase text-slate-400">
                  {u.role === 'admin' ? 'Admin' : 'Executer'}
                </span>
              </button>
            ))}

            <div className="border-t border-slate-100 mt-2 pt-1 space-y-1">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Out Current Account</span>
              </button>
              <button
                onClick={logoutAll}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Logout All Email IDs & Sessions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
