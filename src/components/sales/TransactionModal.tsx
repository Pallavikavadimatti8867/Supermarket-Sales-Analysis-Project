import React, { useState, useEffect } from 'react';
import { X, Calculator, Check, AlertCircle } from 'lucide-react';
import { SaleTransaction, ProductCategory, Branch, City, CustomerType, Gender, PaymentMethod } from '../../types';
import { PRODUCTS, SALES_EXECUTIVES, BRANCH_CITY_MAP } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/calculations';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: SaleTransaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { currentUser, isExecutive } = useAuth();

  const isEdit = !!initialData;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('Member');
  const [gender, setGender] = useState<Gender>('Female');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Food and Beverages');
  const [unitPrice, setUnitPrice] = useState<number>(20);
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [branch, setBranch] = useState<Branch>('Branch A');
  const [city, setCity] = useState<City>('Yangon');
  const [salesExecutive, setSalesExecutive] = useState('');
  const [customerRating, setCustomerRating] = useState<number>(4.5);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setTime(initialData.time);
      setInvoiceId(initialData.invoiceId);
      setCustomerId(initialData.customerId);
      setCustomerType(initialData.customerType);
      setGender(initialData.gender);
      setSelectedProductId(initialData.productId);
      setProductName(initialData.productName);
      setCategory(initialData.category);
      setUnitPrice(initialData.unitPrice);
      setQuantity(initialData.quantity);
      setDiscount(initialData.discount);
      setPaymentMethod(initialData.paymentMethod);
      setBranch(initialData.branch);
      setCity(initialData.city);
      setSalesExecutive(initialData.salesExecutive);
      setCustomerRating(initialData.customerRating);
    } else {
      // New transaction defaults
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
      setInvoiceId(`INV-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      setCustomerId(`CUST-${Math.floor(1000 + Math.random() * 9000)}`);
      setCustomerType('Member');
      setGender('Female');
      
      const defaultProd = PRODUCTS[0];
      setSelectedProductId(defaultProd.id);
      setProductName(defaultProd.name);
      setCategory(defaultProd.category);
      setUnitPrice(defaultProd.unitPrice);
      setQuantity(1);
      setDiscount(0);
      setPaymentMethod('Cash');
      
      if (isExecutive && currentUser) {
        setSalesExecutive(currentUser.name);
        setBranch((currentUser.branch as Branch) || 'Branch A');
        setCity(BRANCH_CITY_MAP[(currentUser.branch as Branch) || 'Branch A']);
      } else {
        setSalesExecutive(SALES_EXECUTIVES[0].name);
        setBranch('Branch A');
        setCity('Yangon');
      }
      setCustomerRating(4.5);
    }
    setError('');
  }, [initialData, isOpen, currentUser, isExecutive]);

  // Handle product selection change
  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = PRODUCTS.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setCategory(prod.category);
      setUnitPrice(prod.unitPrice);
    }
  };

  // Handle branch change
  const handleBranchChange = (newBranch: Branch) => {
    setBranch(newBranch);
    setCity(BRANCH_CITY_MAP[newBranch]);
  };

  // Calculated fields
  const totalSales = Number((unitPrice * quantity).toFixed(2));
  const tax = Number((totalSales * 0.05).toFixed(2));
  const finalAmount = Number(Math.max(0, totalSales + tax - discount).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError('Product name is required.');
      return;
    }
    if (unitPrice <= 0) {
      setError('Unit price must be greater than zero.');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (discount < 0) {
      setError('Discount cannot be negative.');
      return;
    }

    onSave({
      invoiceId,
      date,
      time,
      customerId,
      customerType,
      gender,
      productId: selectedProductId || 'PRD-CUSTOM',
      productName,
      category,
      unitPrice,
      quantity,
      totalSales,
      tax,
      discount,
      finalAmount,
      paymentMethod,
      branch,
      city,
      salesExecutive,
      customerRating,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {isEdit ? 'Edit Sales Transaction' : 'Record New Sales Transaction'}
            </h2>
            <p className="text-xs text-slate-500">
              Invoice #{invoiceId} · Automatically computes tax (5%) and final amounts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Product & Quantity */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/70 space-y-3">
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
              1. Product & Pricing
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Preset Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.unitPrice.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Product Category</label>
                <input
                  type="text"
                  value={category}
                  readOnly
                  className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  required
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Discount Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Ewallet">Ewallet</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit card">Credit card</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Box */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>
                  Base: <strong>{formatCurrency(totalSales)}</strong> + Tax (5%): <strong>{formatCurrency(tax)}</strong> - Discount: <strong>{formatCurrency(discount)}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 mr-1.5">Final Amount:</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Section: Customer & Branch Details */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/70 space-y-3">
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
              2. Customer & Location
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Customer ID</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Customer Type</label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Member">Member</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => handleBranchChange(e.target.value as Branch)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Branch A">Branch A (Yangon)</option>
                  <option value="Branch B">Branch B (Mandalay)</option>
                  <option value="Branch C">Branch C (Naypyitaw)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  readOnly
                  className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Sales Executive</label>
                {isExecutive ? (
                  <input
                    type="text"
                    value={salesExecutive}
                    readOnly
                    className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium cursor-not-allowed"
                  />
                ) : (
                  <select
                    value={salesExecutive}
                    onChange={(e) => setSalesExecutive(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    {SALES_EXECUTIVES.map((exec) => (
                      <option key={exec.name} value={exec.name}>
                        {exec.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Customer Rating ({customerRating} ★)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={customerRating}
                  onChange={(e) => setCustomerRating(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Confirm & Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
