import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { SaleTransaction } from '../../types';
import { useSales } from '../../context/SalesContext';
import { useAuth } from '../../context/AuthContext';
import { TransactionModal } from './TransactionModal';
import { ReceiptModal } from './ReceiptModal';
import { formatCurrency } from '../../utils/calculations';
import { exportToCSV, exportToExcel } from '../../utils/csvExport';

export const SalesTable: React.FC = () => {
  const { filteredTransactions, addTransaction, updateTransaction, deleteTransaction, filters, updateFilters } =
    useSales();
  const { isAdmin, isExecutive, currentUser } = useAuth();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<SaleTransaction | null>(null);
  const [receiptTransaction, setReceiptTransaction] = useState<SaleTransaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof SaleTransaction>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSort = (field: keyof SaleTransaction) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        const comp = (valA as string).localeCompare(valB as string);
        return sortOrder === 'asc' ? comp : -comp;
      }

      if (typeof valA === 'number') {
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }

      return 0;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const confirmDelete = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      setDeleteId(null);
    }
  };

  const canEdit = (t: SaleTransaction) => {
    if (isAdmin) return true;
    if (isExecutive && currentUser && t.salesExecutive === currentUser.name) return true;
    return false;
  };

  const canDelete = (t: SaleTransaction) => {
    return isAdmin; // Only admin can delete transactions
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Invoice, Customer, Product, Category, or Executive..."
            value={filters.searchQuery}
            onChange={(e) => {
              updateFilters({ searchQuery: e.target.value });
              setCurrentPage(1);
            }}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(sortedTransactions, `supermarket_sales_${new Date().toISOString().slice(0, 10)}.csv`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportToExcel(sortedTransactions, `supermarket_sales_${new Date().toISOString().slice(0, 10)}.xls`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold tracking-wider text-[10px]">
            <tr>
              <th
                onClick={() => handleSort('invoiceId')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Invoice ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date & Time</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Product Item</th>
              <th className="py-3 px-3">Category</th>
              <th
                onClick={() => handleSort('quantity')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Qty</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">Price</th>
              <th
                onClick={() => handleSort('finalAmount')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Final Total</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Branch</th>
              <th className="py-3 px-3">Executive</th>
              <th
                onClick={() => handleSort('customerRating')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Rating</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-400">
                  No sales transactions found matching current criteria.
                </td>
              </tr>
            ) : (
              currentRecords.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">{t.invoiceId}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div>{t.date}</div>
                    <div className="text-[10px] text-slate-400">{t.time}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">{t.customerId}</div>
                    <div className="text-[10px] text-slate-400">
                      {t.customerType} · {t.gender}
                    </div>
                  </td>
                  <td className="py-3 px-3 max-w-[160px] truncate" title={t.productName}>
                    <span className="font-medium text-slate-900">{t.productName}</span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                    {t.category}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-900">{t.quantity}</td>
                  <td className="py-3 px-3 text-right">{formatCurrency(t.unitPrice)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">
                    {formatCurrency(t.finalAmount)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div>{t.branch}</div>
                    <div className="text-[10px] text-slate-400">{t.city}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-700">{t.salesExecutive}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-medium text-amber-600">{t.customerRating}★</span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setReceiptTransaction(t)}
                        title="View Official Receipt"
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {canEdit(t) && (
                        <button
                          onClick={() => setEditingTransaction(t)}
                          title="Edit Transaction"
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canDelete(t) && (
                        <button
                          onClick={() => setDeleteId(t.id)}
                          title="Delete Transaction (Admin Only)"
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, sortedTransactions.length)} of {sortedTransactions.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(data) => addTransaction(data)}
      />

      <TransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        initialData={editingTransaction}
        onSave={(data) => {
          if (editingTransaction) {
            updateTransaction(editingTransaction.id, data);
            setEditingTransaction(null);
          }
        }}
      />

      <ReceiptModal
        isOpen={!!receiptTransaction}
        onClose={() => setReceiptTransaction(null)}
        transaction={receiptTransaction}
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Delete Sales Record?</h3>
                <p className="text-xs text-slate-500">
                  This action cannot be undone. The transaction will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
