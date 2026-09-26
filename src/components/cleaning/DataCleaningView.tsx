import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Upload,
  CheckCircle2,
  RefreshCw,
  FileText,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { parseCSVText, ParseCSVResult } from '../../utils/csvExport';

export const DataCleaningView: React.FC = () => {
  const { transactions, qualityReport, cleanDataset, resetDataset, importTransactions, showToast } = useSales();
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaningResult, setCleaningResult] = useState<{ fixedDuplicates: number; fixedFormulas: number } | null>(null);

  // File upload state
  const [importStatus, setImportStatus] = useState<ParseCSVResult | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');

  const handleCleanData = () => {
    setIsCleaning(true);
    setTimeout(() => {
      const res = cleanDataset();
      setCleaningResult(res);
      setIsCleaning(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCSVText(text);
      setImportStatus(parsed);

      if (parsed.success && parsed.transactions.length > 0) {
        importTransactions(parsed.transactions);
      } else {
        showToast('CSV parsing failed. Ensure file has header and valid columns.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Quality Score & Cleaning Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-100"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  className={
                    qualityReport.qualityPercentage >= 95
                      ? 'text-emerald-500'
                      : qualityReport.qualityPercentage >= 80
                      ? 'text-blue-500'
                      : 'text-amber-500'
                  }
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * qualityReport.qualityPercentage) / 100}
                />
              </svg>
              <span className="absolute font-bold text-xs text-slate-900">
                {qualityReport.qualityPercentage}%
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Dataset Health & Integrity Audit</h2>
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-medium">
                  {qualityReport.qualityPercentage >= 95 ? 'Optimal Health' : 'Audit Recommended'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Validated against formula constraints (Total = Price × Qty, Tax = 5%, Bounds)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCleanData}
              disabled={isCleaning}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isCleaning ? 'Cleaning Data...' : 'Run Data Cleaning Engine'}</span>
            </button>

            <button
              onClick={resetDataset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>

        {cleaningResult && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Cleaning complete! Resolved {cleaningResult.fixedDuplicates} duplicate invoice references and
                verified {cleaningResult.fixedFormulas} calculated formulas.
              </span>
            </div>
            <button
              onClick={() => setCleaningResult(null)}
              className="text-emerald-700 hover:underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500">Total Analyzed Records</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{qualityReport.totalRecords}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active database rows</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500">Clean Validated Rows</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">{qualityReport.cleanRecords}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Passing all verification rules</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500">Duplicate Invoices</span>
          <div className="text-xl font-bold text-rose-600 mt-1">{qualityReport.duplicateCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Overlapping primary keys</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500">Formula / Bound Discrepancies</span>
          <div className="text-xl font-bold text-amber-600 mt-1">{qualityReport.invalidValuesCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Out of bound ratings or rounding drift</div>
        </div>
      </div>

      {/* Two Column Layout: CSV Importer & Audit Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CSV Import Pipeline */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Upload & Ingest Supermarket CSV</h3>
            <p className="text-xs text-slate-500">
              Upload external transaction files to validate data types, headers, and inject into database
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400" />
            <div className="text-xs font-semibold text-slate-700">Click to choose CSV file or drag and drop</div>
            <p className="text-[11px] text-slate-400">Accepts .csv with standard supermarket sales columns</p>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {importStatus && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{uploadFileName}</span>
                <span className="text-emerald-700 font-semibold">
                  {importStatus.importedCount} records accepted
                </span>
              </div>
              <div className="text-slate-600">
                Total rows parsed: {importStatus.validationReport.totalRows} · Valid:{' '}
                {importStatus.validationReport.validRows} · Issues:{' '}
                {importStatus.validationReport.invalidRows}
              </div>
              {importStatus.validationReport.sampleWarnings.length > 0 && (
                <div className="mt-2 text-[11px] text-amber-700 space-y-1">
                  <span className="font-semibold block">Parser Warnings:</span>
                  {importStatus.validationReport.sampleWarnings.map((w, idx) => (
                    <div key={idx}>• {w}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cleaning Pipeline Details */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Automated Data Pipeline Rules</h3>
            <p className="text-xs text-slate-500">Equivalent to Python Pandas ETL data scrubbing routines</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Deduplication (`df.drop_duplicates`)</strong>
                <span className="text-slate-500">
                  Scans primary Invoice ID and assigns unique timestamp identifiers to overlapping records.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Financial Formula Synchronization</strong>
                <span className="text-slate-500">
                  Re-evaluates `Unit Price × Quantity`, computes exact 5% VAT rate, and applies discount offsets.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Missing Value Imputation (`df.fillna`)</strong>
                <span className="text-slate-500">
                  Replaces blank ratings with categorical mean (4.0★) and fixes missing cities from branch mapping.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Type Casting & Bounds Clamping</strong>
                <span className="text-slate-500">
                  Enforces IEEE float formatting on dollar amounts, integer quantities, and 1.0–5.0 rating bounds.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
