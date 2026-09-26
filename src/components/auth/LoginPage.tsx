import React, { useState } from 'react';
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  LogOut,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, logoutAll, availableUsers } = useAuth();

  // Login form state
  const [email, setEmail] = useState('pallavisk46@gmail.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('admin');

  // UI feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick preset selection
  const handleSelectPreset = (presetEmail: string, presetPass: string, presetRole: UserRole) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setRole(presetRole);
    setError('');
    setSuccessMsg(`Selected ${presetEmail} (${presetRole === 'admin' ? 'Admin' : 'Admin Executer'})`);
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email ID.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password, role);
    setIsLoading(false);

    if (!res.success) {
      setError(res.message || 'Unable to sign in. Please verify your email ID.');
    }
  };

  // Handle Logout All Email IDs
  const handleLogoutAll = () => {
    logoutAll();
    setEmail('');
    setPassword('');
    setSuccessMsg('All email accounts and active sessions have been successfully logged out.');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-3 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 text-center relative border-b border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Portal Access:</span>
              <span className="text-emerald-400 font-semibold">Active & Ready</span>
            </div>

            {/* Logout all email IDs button */}
            <button
              type="button"
              onClick={handleLogoutAll}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              title="Logout all email IDs and clear all sessions"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout All Email IDs</span>
            </button>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mb-2">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            METRO SUPERMARKET
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sales Analysis Dashboard • Executive & Admin Portal
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Notifications */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email ID input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email ID / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter any email ID (e.g. pallavisk46@gmail.com)"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">
                  Enter password
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Choose Role: Admin or Admin Executer */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Sign In Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Admin Role */}
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'border-purple-600 bg-purple-50/90 text-purple-950 ring-2 ring-purple-600/30'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Admin</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Full Supermarket & CRUD Control
                    </div>
                  </div>
                </button>

                {/* Admin Executer Role */}
                <button
                  type="button"
                  onClick={() => setRole('executive')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'executive'
                      ? 'border-blue-600 bg-blue-50/90 text-blue-950 ring-2 ring-blue-600/30'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      role === 'executive' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Admin Executer</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      Sales Operations & Performance
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
            >
              <span>
                {isLoading
                  ? 'Signing In...'
                  : `Sign In as ${role === 'admin' ? 'Admin' : 'Admin Executer'}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick preset accounts for convenience */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick 1-Click Fill:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('pallavisk46@gmail.com', 'Password@123', 'admin')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-purple-100 hover:border-purple-300 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:text-purple-900 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>pallavisk46@gmail.com (Admin)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('admin@supermarket.com', 'Admin@2026', 'admin')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-purple-100 hover:border-purple-300 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:text-purple-900 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>admin@supermarket.com (Admin)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('sarah.jenkins@supermarket.com', 'Sarah@2026', 'executive')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-100 hover:border-blue-300 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:text-blue-900 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>sarah.jenkins@supermarket.com (Admin Executer)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          <span>Enter any Email ID & Password to sign in as Admin or Admin Executer.</span>
        </div>
      </div>
    </div>
  );
};
