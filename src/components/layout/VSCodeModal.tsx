import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Server, CheckCircle2, Shield, Laptop, Zap } from 'lucide-react';

interface VSCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VSCodeModal: React.FC<VSCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'vite' | 'fullstack' | 'auth'>('quick');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Run Project in Visual Studio Code
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete instructions to run this Supermarket Sales app locally on your machine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'quick', label: '1. Python 1-Click (Fastest)', icon: Zap },
            { id: 'vite', label: '2. Node & Vite Dev', icon: Code2 },
            { id: 'fullstack', label: '3. Full Flask API', icon: Server },
            { id: 'auth', label: '4. Real Email Login Info', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: Python 1-Click */}
          {activeTab === 'quick' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-blue-200 flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Zero extra installations required!</div>
                  <p className="text-[11px] text-blue-300 mt-0.5">
                    A standalone pre-built distribution and runner script (<code className="text-white bg-blue-900/50 px-1 rounded">run.py</code>) is included. You only need standard Python.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Step 1: Open project folder in VS Code</span>
                </div>
                <div className="relative group">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
                    cd supermarket-sales-analysis
                  </pre>
                  <button
                    onClick={() => handleCopy('cd supermarket-sales-analysis', 'cd1')}
                    className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'cd1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 'cd1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Step 2: Start the dashboard</span>
                </div>
                <div className="relative group">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
                    python run.py
                  </pre>
                  <button
                    onClick={() => handleCopy('python run.py', 'py1')}
                    className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'py1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 'py1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  On Windows, you can also simply double-click <code className="text-slate-200">run.bat</code>.
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Dashboard will automatically open in your browser at <strong>http://localhost:3000</strong></span>
              </div>
            </div>
          )}

          {/* TAB 2: Node.js & Vite Dev Server */}
          {activeTab === 'vite' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-xl text-purple-200 flex items-start gap-2">
                <Code2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Full React 19 + TypeScript + Vite Development</div>
                  <p className="text-[11px] text-purple-300 mt-0.5">
                    Recommended if you want live Hot Module Replacement (HMR) and source code editing in VS Code.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Step 1: Install Node Dependencies</span>
                </div>
                <div className="relative group">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
                    npm install
                  </pre>
                  <button
                    onClick={() => handleCopy('npm install', 'npm_i')}
                    className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'npm_i' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 'npm_i' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Step 2: Start Vite Dev Server</span>
                </div>
                <div className="relative group">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
                    npm run dev
                  </pre>
                  <button
                    onClick={() => handleCopy('npm run dev', 'npm_dev')}
                    className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'npm_dev' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 'npm_dev' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Open your browser and navigate to <strong>http://localhost:3000</strong></span>
              </div>
            </div>
          )}

          {/* TAB 3: Full Flask API */}
          {activeTab === 'fullstack' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-200 flex items-start gap-2">
                <Server className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Full-Stack Python Flask Backend + MongoDB</div>
                  <p className="text-[11px] text-amber-300 mt-0.5">
                    If you are presenting for an internship or viva and want to run the Python Flask REST API separately.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-300 font-medium">Terminal 1 (Backend REST API):</div>
                <div className="relative group">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
{`pip install -r requirements.txt
python backend/app.py`}
                  </pre>
                  <button
                    onClick={() => handleCopy("pip install -r requirements.txt\npython backend/app.py", 'term1')}
                    className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'term1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 'term1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Backend API runs on: <code className="text-slate-200">http://127.0.0.1:5000</code></p>
              </div>

              <div className="space-y-2">
                <div className="text-slate-300 font-medium">Terminal 2 (Frontend Client):</div>
                <div className="relative group">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs overflow-x-auto">
{`npm install
npm run dev`}
                  </pre>
                  <button
                    onClick={() => handleCopy("npm install\nnpm run dev", 'term2')}
                    className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'term2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 'term2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Real Email Login Info */}
          {activeTab === 'auth' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-200 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">How Real Email & Password Authentication Works</div>
                  <p className="text-[11px] text-emerald-300 mt-0.5">
                    Zero external cloud setup required! Works completely offline in VS Code and in your browser.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-semibold text-white">1. Real Email IDs Supported:</div>
                  <p className="text-slate-400">
                    You can enter any valid real email ID (such as <code className="text-emerald-400">pallavisk46@gmail.com</code> or your company email).
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-semibold text-white">2. Secure Password Encryption:</div>
                  <p className="text-slate-400">
                    Passwords are salt-hashed using standard <strong>SHA-256 Web Crypto</strong>. Plaintext passwords are never saved.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-semibold text-white">3. Role-Based Access Control:</div>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    <li><strong>Admin:</strong> Full CRUD operations, data cleaning, reports, system settings.</li>
                    <li><strong>Admin Executer:</strong> Recording transactions, sales analytics, personal milestones.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Files tested for Windows, macOS, and Linux
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
