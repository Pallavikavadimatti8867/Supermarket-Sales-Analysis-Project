import React from 'react';
import { X, Printer, CheckCircle, Store } from 'lucide-react';
import { SaleTransaction } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface ReceiptModalProps {
  transaction: SaleTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-semibold text-slate-700">Official Sales Invoice</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4 font-mono text-xs text-slate-800">
          {/* Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-900">
              <Store className="w-5 h-5 text-blue-600" />
              <h2 className="font-sans font-bold text-base tracking-tight">METRO SUPERMARKET</h2>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              {transaction.branch} · {transaction.city}
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              GST / Tax ID: MMR-SM-9948271 • Tel: +95 (01) 489-200
            </p>
          </div>

          {/* Meta Info */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice:</span>
              <span className="font-semibold text-slate-900">{transaction.invoiceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span>{transaction.date} {transaction.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer ID:</span>
              <span>{transaction.customerId} ({transaction.customerType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Served By:</span>
              <span>{transaction.salesExecutive}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="pt-2 border-t border-dashed border-slate-300">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left">
                  <th className="pb-1 font-medium">Item</th>
                  <th className="pb-1 font-medium text-center">Qty</th>
                  <th className="pb-1 font-medium text-right">Price</th>
                  <th className="pb-1 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pt-2 font-sans">
                    <div className="font-medium text-slate-900">{transaction.productName}</div>
                    <div className="text-[10px] text-slate-500">{transaction.category}</div>
                  </td>
                  <td className="pt-2 text-center">{transaction.quantity}</td>
                  <td className="pt-2 text-right">{formatCurrency(transaction.unitPrice)}</td>
                  <td className="pt-2 text-right font-medium">{formatCurrency(transaction.totalSales)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Price Breakdown */}
          <div className="pt-3 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(transaction.totalSales)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (5% GST):</span>
              <span>+{formatCurrency(transaction.tax)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount / Promo:</span>
                <span>-{formatCurrency(transaction.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
              <span>FINAL TOTAL:</span>
              <span className="text-blue-600">{formatCurrency(transaction.finalAmount)}</span>
            </div>
          </div>

          {/* Payment & Rating Details */}
          <div className="pt-3 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Tender:</span>
              <span className="font-semibold text-slate-900">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer Rating:</span>
              <span className="text-amber-600 font-semibold">{transaction.customerRating} / 5.0 ★</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-700 flex items-center gap-1 font-sans">
                <CheckCircle className="w-3.5 h-3.5" /> Settled / Completed
              </span>
            </div>
          </div>

          {/* Barcode Simulation */}
          <div className="pt-4 text-center">
            <div className="h-8 bg-slate-900 mx-auto w-3/4 rounded-xs flex items-center justify-around px-2 opacity-80">
              <span className="text-white text-[8px] tracking-widest font-mono">|| | |||| || ||| | ||| ||</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-1 font-sans">
              Thank you for shopping at Metro Supermarket!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
