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
  UserPlus,
  LogIn,
  KeyRound,
  AlertTriangle,
  Laptop,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { VSCodeModal } from '../layout/VSCodeModal';

export const LoginPage: React.FC = () => {
  const { login, registerAccount, logoutAll } = useAuth();

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('admin');

  // VS Code modal
  const [isVSCodeModalOpen, setIsVSCodeModalOpen] = useState(false);

  // UI feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email validation check
  const isValidEmail = (val: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  const isEmailValid = email.trim() ? isValidEmail(email) : null;

  // Handle Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid real email address (e.g., name@gmail.com, name@company.com).');
      return;
    }

    if (!trimmedPass) {
      setError('Please enter your password.');
      return;
    }

    if (trimmedPass.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (authMode === 'signup') {
      if (trimmedPass !== confirmPassword.trim()) {
        setError('Passwords do not match. Please re-enter matching passwords.');
        return;
      }

      setIsLoading(true);
      const res = await registerAccount(trimmedEmail, trimmedPass, role);
      setIsLoading(false);

      if (!res.success) {
        setError(res.message || 'Registration failed. Please check your credentials.');
      }
    } else {
      setIsLoading(true);
      const res = await login(trimmedEmail, trimmedPass, role);
      setIsLoading(false);

      if (!res.success) {
        setError(res.message || 'Invalid email or password. Please verify your credentials.');
      }
    }
  };

  // Quick fill preset credentials helper
  const handleQuickFill = (presetEmail: string, presetPass: string, presetRole: UserRole) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setConfirmPassword(presetPass);
    setRole(presetRole);
    setError('');
    setSuccessMsg(`Loaded credentials for ${presetEmail}`);
  };

  // Handle Logout All Email IDs
  const handleLogoutAll = () => {
    logoutAll();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSuccessMsg('All email accounts and active sessions have been logged out.');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-3 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Bar for VS Code Quick Guide */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <Store className="w-3.5 h-3.5 text-blue-400" />
          <span>Supermarket BI Platform</span>
        </span>

        <button
          type="button"
          onClick={() => setIsVSCodeModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white transition-all font-semibold cursor-pointer shadow-xs"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Run in VS Code Guide</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 text-center relative border-b border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Real Email Authentication:</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>

            {/* Reset / clear button */}
            <button
              type="button"
              onClick={handleLogoutAll}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white transition-all text-[11px] font-semibold cursor-pointer"
              title="Reset all stored email IDs and clear active session"
            >
              <LogOut className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mb-2">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">
            METRO SUPERMARKET
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sales Analysis Dashboard • Secure Real Email Login
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-800/80 rounded-xl mt-4 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-7 space-y-4">
          {/* Quick-fill helpers for instant testing */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quick-Fill Real Accounts:</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('pallavisk46@gmail.com', 'Admin123!', 'admin')}
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg transition-all cursor-pointer"
                title="Fill with pallavisk46@gmail.com (Admin)"
              >
                👤 pallavisk46@gmail.com
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@supermarket.com', 'admin123', 'admin')}
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-lg transition-all cursor-pointer"
                title="Fill with admin@supermarket.com"
              >
                🛡️ admin@supermarket.com
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('sarah.jenkins@supermarket.com', 'exec123', 'executive')}
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer"
                title="Fill with sarah.jenkins@supermarket.com"
              >
                💼 sarah.jenkins (Executer)
              </button>
            </div>
          </div>

          {/* Notifications */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Security Advisory Notice */}
          <div className="p-2.5 bg-amber-50 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold">Security Protection: </span>
              <span>
                Use your real email ID. Create a unique password specifically for this Supermarket Dashboard (never use your private Google password).
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Real Email ID input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Real Email Address
                </label>
                {isEmailValid === true && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Valid format
                  </span>
                )}
                {isEmailValid === false && (
                  <span className="text-[10px] text-amber-600 font-semibold">
                    e.g. name@gmail.com
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. pallavisk46@gmail.com"
                  className={`w-full text-xs pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium transition-all ${
                    isEmailValid === false
                      ? 'border-amber-300 bg-amber-50/20'
                      : isEmailValid === true
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* Dashboard Account Password input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {authMode === 'signup' ? 'Create Dashboard Password (min 6 chars)' : 'Dashboard Password'}
                </label>
                {password.length > 0 && password.length < 6 && (
                  <span className="text-[10px] text-amber-600 font-semibold">
                    Min 6 characters ({password.length}/6)
                  </span>
                )}
                {password.length >= 6 && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Encrypted with SHA-256
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'signup' ? 'Create a unique password for this dashboard' : 'Enter your dashboard password'}
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

            {/* Confirm Password (only for signup) */}
            {authMode === 'signup' && (
              <div className="animate-in fade-in duration-150">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Confirm Dashboard Password
                  </label>
                  {confirmPassword && confirmPassword === password && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Matches
                    </span>
                  )}
                  {confirmPassword && confirmPassword !== password && (
                    <span className="text-[10px] text-rose-600 font-semibold">
                      Passwords do not match
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your dashboard password"
                    className="w-full text-xs pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dashboard Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
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
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Admin</div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      Full Control
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('executive')}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
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
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Admin Executer</div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      Sales Operations
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 mt-3"
            >
              <span>
                {isLoading
                  ? 'Verifying...'
                  : authMode === 'signup'
                  ? `Create Account & Sign In as ${role === 'admin' ? 'Admin' : 'Admin Executer'}`
                  : `Sign In as ${role === 'admin' ? 'Admin' : 'Admin Executer'}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Switcher Link */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {authMode === 'signin' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Create New Account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Sign In with Password
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3 text-emerald-600" />
          <span>Client-side SHA-256 password encryption active • Personal Google passwords are never requested.</span>
        </div>
      </div>

      {/* VS Code Step-by-Step Guide Modal */}
      <VSCodeModal
        isOpen={isVSCodeModalOpen}
        onClose={() => setIsVSCodeModalOpen(false)}
      />
    </div>
  );
};
