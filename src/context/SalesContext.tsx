import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SaleTransaction, FilterState, KPIData, DataQualityReport } from '../types';
import { generateInitialDataset } from '../data/mockData';
import { filterTransactions, calculateKPIs, auditDataQuality } from '../utils/calculations';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface SalesContextType {
  transactions: SaleTransaction[];
  filteredTransactions: SaleTransaction[];
  filters: FilterState;
  kpis: KPIData;
  qualityReport: DataQualityReport;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  addTransaction: (transaction: Omit<SaleTransaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updated: Partial<SaleTransaction>) => void;
  deleteTransaction: (id: string) => void;
  importTransactions: (imported: SaleTransaction[]) => void;
  resetDataset: () => void;
  cleanDataset: () => { fixedDuplicates: number; fixedFormulas: number };
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  datePreset: 'all',
  startDate: '',
  endDate: '',
  branch: 'all',
  city: 'all',
  category: 'all',
  paymentMethod: 'all',
  customerType: 'all',
  gender: 'all',
  salesExecutive: 'all',
  minRating: 0,
  minAmount: 0,
  maxAmount: 0,
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<SaleTransaction[]>(() => {
    const saved = localStorage.getItem('sm_transactions_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse cached transactions', e);
      }
    }
    return generateInitialDataset();
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('sm_transactions_data', JSON.stringify(transactions));
    } catch (e) {
      console.warn('LocalStorage quota or serialization error', e);
    }
  }, [transactions]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      // Handle date preset conversions
      if (newFilters.datePreset) {
        const today = new Date('2026-09-26T12:00:00Z');
        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        switch (newFilters.datePreset) {
          case 'today':
            updated.startDate = formatDate(today);
            updated.endDate = formatDate(today);
            break;
          case 'yesterday': {
            const y = new Date(today);
            y.setDate(y.getDate() - 1);
            updated.startDate = formatDate(y);
            updated.endDate = formatDate(y);
            break;
          }
          case 'last7days': {
            const d7 = new Date(today);
            d7.setDate(d7.getDate() - 7);
            updated.startDate = formatDate(d7);
            updated.endDate = formatDate(today);
            break;
          }
          case 'thisMonth': {
            const mStart = new Date(today.getFullYear(), today.getMonth(), 1);
            updated.startDate = formatDate(mStart);
            updated.endDate = formatDate(today);
            break;
          }
          case 'prevMonth': {
            const pmStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const pmEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            updated.startDate = formatDate(pmStart);
            updated.endDate = formatDate(pmEnd);
            break;
          }
          case 'all':
            updated.startDate = '';
            updated.endDate = '';
            break;
          case 'custom':
            // keep existing start/end dates
            break;
        }
      }

      return updated;
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    showToast('Filters have been reset', 'info');
  };

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filters);
  }, [transactions, filters]);

  const kpis = useMemo(() => {
    return calculateKPIs(filteredTransactions);
  }, [filteredTransactions]);

  const qualityReport = useMemo(() => {
    return auditDataQuality(transactions);
  }, [transactions]);

  const addTransaction = (transactionData: Omit<SaleTransaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `TRX-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const newRecord: SaleTransaction = {
      ...transactionData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    setTransactions((prev) => [newRecord, ...prev]);
    showToast(`Transaction ${newRecord.invoiceId} added successfully!`, 'success');
  };

  const updateTransaction = (id: string, updated: Partial<SaleTransaction>) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...updated, updatedAt: new Date().toISOString() };
          // Re-verify calculations
          merged.totalSales = Number((merged.unitPrice * merged.quantity).toFixed(2));
          merged.tax = Number((merged.totalSales * 0.05).toFixed(2));
          merged.finalAmount = Number(Math.max(0, merged.totalSales + merged.tax - merged.discount).toFixed(2));
          return merged;
        }
        return t;
      })
    );
    showToast('Transaction updated successfully!', 'success');
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast(`Transaction ${target?.invoiceId || id} removed`, 'info');
  };

  const importTransactions = (imported: SaleTransaction[]) => {
    setTransactions((prev) => [...imported, ...prev]);
    showToast(`Successfully imported ${imported.length} transaction records!`, 'success');
  };

  const resetDataset = () => {
    const fresh = generateInitialDataset();
    setTransactions(fresh);
    localStorage.removeItem('sm_transactions_data');
    showToast('Dataset restored to 1,020 standard test records', 'info');
  };

  const cleanDataset = () => {
    const seen = new Set<string>();
    let fixedDuplicates = 0;
    let fixedFormulas = 0;

    const cleaned: SaleTransaction[] = [];

    for (const t of transactions) {
      let inv = t.invoiceId;
      if (seen.has(inv)) {
        fixedDuplicates++;
        inv = `${inv}-CLEANED-${Math.floor(Math.random() * 1000)}`;
      }
      seen.add(inv);

      // Re-calculate accurately
      const expectedTotal = Number((t.unitPrice * t.quantity).toFixed(2));
      const expectedTax = Number((expectedTotal * 0.05).toFixed(2));
      const expectedFinal = Number(Math.max(0, expectedTotal + expectedTax - (t.discount || 0)).toFixed(2));

      if (t.totalSales !== expectedTotal || t.finalAmount !== expectedFinal) {
        fixedFormulas++;
      }

      cleaned.push({
        ...t,
        invoiceId: inv,
        totalSales: expectedTotal,
        tax: expectedTax,
        finalAmount: expectedFinal,
        customerRating: Math.min(5, Math.max(1, t.customerRating || 4.0)),
      });
    }

    setTransactions(cleaned);
    showToast(`Data cleaned! Repaired ${fixedDuplicates} duplicates & verified ${fixedFormulas} formula values.`, 'success');
    return { fixedDuplicates, fixedFormulas };
  };

  return (
    <SalesContext.Provider
      value={{
        transactions,
        filteredTransactions,
        filters,
        kpis,
        qualityReport,
        updateFilters,
        resetFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        importTransactions,
        resetDataset,
        cleanDataset,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export function useSales() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}
