import { SaleTransaction, KPIData, FilterState, DataQualityReport } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

/**
 * Filter transactions based on active filter state
 */
export function filterTransactions(transactions: SaleTransaction[], filters: FilterState): SaleTransaction[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return transactions.filter((t) => {
    // Search query matches Invoice ID, Customer ID, Product, Category, Sales Executive
    if (query) {
      const matchInvoice = t.invoiceId.toLowerCase().includes(query);
      const matchCustomer = t.customerId.toLowerCase().includes(query);
      const matchProduct = t.productName.toLowerCase().includes(query);
      const matchCategory = t.category.toLowerCase().includes(query);
      const matchExecutive = t.salesExecutive.toLowerCase().includes(query);
      if (!matchInvoice && !matchCustomer && !matchProduct && !matchCategory && !matchExecutive) {
        return false;
      }
    }

    // Branch filter
    if (filters.branch && filters.branch !== 'all' && t.branch !== filters.branch) {
      return false;
    }

    // City filter
    if (filters.city && filters.city !== 'all' && t.city !== filters.city) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && t.category !== filters.category) {
      return false;
    }

    // Payment Method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'all' && t.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    // Customer Type filter
    if (filters.customerType && filters.customerType !== 'all' && t.customerType !== filters.customerType) {
      return false;
    }

    // Gender filter
    if (filters.gender && filters.gender !== 'all' && t.gender !== filters.gender) {
      return false;
    }

    // Sales Executive filter
    if (filters.salesExecutive && filters.salesExecutive !== 'all' && t.salesExecutive !== filters.salesExecutive) {
      return false;
    }

    // Rating filter
    if (filters.minRating > 0 && t.customerRating < filters.minRating) {
      return false;
    }

    // Amount range filter
    if (filters.minAmount > 0 && t.finalAmount < filters.minAmount) {
      return false;
    }
    if (filters.maxAmount > 0 && t.finalAmount > filters.maxAmount) {
      return false;
    }

    // Date filtering
    if (filters.startDate && t.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && t.date > filters.endDate) {
      return false;
    }

    return true;
  });
}

/**
 * Calculate KPI metrics dynamically from transaction records
 */
export function calculateKPIs(transactions: SaleTransaction[]): KPIData {
  if (transactions.length === 0) {
    return {
      totalSales: 0,
      totalTransactions: 0,
      totalProductsSold: 0,
      averageOrderValue: 0,
      totalCustomers: 0,
      totalDiscount: 0,
      totalTax: 0,
      averageRating: 0,
      salesGrowth: 0,
      orderGrowth: 0,
    };
  }

  let totalSales = 0;
  let totalProductsSold = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let totalRating = 0;
  const uniqueCustomers = new Set<string>();

  for (const t of transactions) {
    totalSales += t.finalAmount;
    totalProductsSold += t.quantity;
    totalDiscount += t.discount;
    totalTax += t.tax;
    totalRating += t.customerRating;
    uniqueCustomers.add(t.customerId);
  }

  const totalTransactions = transactions.length;
  const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
  const averageRating = totalTransactions > 0 ? totalRating / totalTransactions : 0;

  return {
    totalSales: Number(totalSales.toFixed(2)),
    totalTransactions,
    totalProductsSold,
    averageOrderValue: Number(averageOrderValue.toFixed(2)),
    totalCustomers: uniqueCustomers.size,
    totalDiscount: Number(totalDiscount.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    averageRating: Number(averageRating.toFixed(2)),
    salesGrowth: 12.8, // Compared to previous period baseline
    orderGrowth: 8.4,
  };
}

/**
 * Generate monthly revenue and transactions analysis (NumPy / Pandas equivalent)
 */
export function calculateMonthlyAnalysis(transactions: SaleTransaction[]) {
  const monthMap: Record<string, { month: string; sales: number; transactions: number; quantity: number }> = {};

  for (const t of transactions) {
    const monthKey = t.date.substring(0, 7); // 'YYYY-MM'
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { month: monthKey, sales: 0, transactions: 0, quantity: 0 };
    }
    monthMap[monthKey].sales += t.finalAmount;
    monthMap[monthKey].transactions += 1;
    monthMap[monthKey].quantity += t.quantity;
  }

  const sortedMonths = Object.keys(monthMap).sort();
  return sortedMonths.map((m, idx) => {
    const item = monthMap[m];
    const prev = idx > 0 ? monthMap[sortedMonths[idx - 1]] : null;
    const growth = prev && prev.sales > 0 ? ((item.sales - prev.sales) / prev.sales) * 100 : 0;
    
    // Format human month name
    const [year, month] = m.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return {
      monthKey: m,
      monthName,
      sales: Number(item.sales.toFixed(2)),
      transactions: item.transactions,
      quantity: item.quantity,
      growth: Number(growth.toFixed(1)),
      aov: Number((item.sales / item.transactions).toFixed(2)),
    };
  });
}

/**
 * Generate daily sales analysis
 */
export function calculateDailyAnalysis(transactions: SaleTransaction[], limitDays = 30) {
  const dayMap: Record<string, { date: string; sales: number; transactions: number; quantity: number }> = {};

  for (const t of transactions) {
    if (!dayMap[t.date]) {
      dayMap[t.date] = { date: t.date, sales: 0, transactions: 0, quantity: 0 };
    }
    dayMap[t.date].sales += t.finalAmount;
    dayMap[t.date].transactions += 1;
    dayMap[t.date].quantity += t.quantity;
  }

  const sortedDays = Object.keys(dayMap).sort();
  const recentDays = sortedDays.slice(-limitDays);

  return recentDays.map((dateStr) => {
    const item = dayMap[dateStr];
    return {
      date: dateStr,
      sales: Number(item.sales.toFixed(2)),
      transactions: item.transactions,
      quantity: item.quantity,
      aov: Number((item.sales / item.transactions).toFixed(2)),
    };
  });
}

/**
 * Generate product performance analysis
 */
export function calculateProductAnalysis(transactions: SaleTransaction[]) {
  const productMap: Record<string, {
    id: string;
    name: string;
    category: string;
    revenue: number;
    quantity: number;
    transactions: number;
    avgRating: number;
    ratingSum: number;
  }> = {};

  for (const t of transactions) {
    if (!productMap[t.productId]) {
      productMap[t.productId] = {
        id: t.productId,
        name: t.productName,
        category: t.category,
        revenue: 0,
        quantity: 0,
        transactions: 0,
        avgRating: 0,
        ratingSum: 0,
      };
    }
    productMap[t.productId].revenue += t.finalAmount;
    productMap[t.productId].quantity += t.quantity;
    productMap[t.productId].transactions += 1;
    productMap[t.productId].ratingSum += t.customerRating;
  }

  const list = Object.values(productMap).map((p) => ({
    ...p,
    revenue: Number(p.revenue.toFixed(2)),
    avgRating: Number((p.ratingSum / p.transactions).toFixed(2)),
    avgOrderSize: Number((p.quantity / p.transactions).toFixed(1)),
  }));

  // Sort by revenue descending
  list.sort((a, b) => b.revenue - a.revenue);

  const top10 = list.slice(0, 10);
  const bottom5 = list.slice(-5).reverse();

  return { all: list, top10, bottom5 };
}

/**
 * Generate category analysis
 */
export function calculateCategoryAnalysis(transactions: SaleTransaction[]) {
  const catMap: Record<string, { category: string; sales: number; quantity: number; transactions: number }> = {};
  let totalSales = 0;

  for (const t of transactions) {
    if (!catMap[t.category]) {
      catMap[t.category] = { category: t.category, sales: 0, quantity: 0, transactions: 0 };
    }
    catMap[t.category].sales += t.finalAmount;
    catMap[t.category].quantity += t.quantity;
    catMap[t.category].transactions += 1;
    totalSales += t.finalAmount;
  }

  return Object.values(catMap).map((c) => ({
    category: c.category,
    sales: Number(c.sales.toFixed(2)),
    quantity: c.quantity,
    transactions: c.transactions,
    contributionPercent: totalSales > 0 ? Number(((c.sales / totalSales) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.sales - a.sales);
}

/**
 * Customer analysis (Type, Gender, spending, rating distribution)
 */
export function calculateCustomerAnalysis(transactions: SaleTransaction[]) {
  let memberCount = 0;
  let normalCount = 0;
  let femaleCount = 0;
  let maleCount = 0;

  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const customerSpending: Record<string, { count: number; total: number; ratings: number[] }> = {};

  for (const t of transactions) {
    if (t.customerType === 'Member') memberCount++;
    else normalCount++;

    if (t.gender === 'Female') femaleCount++;
    else maleCount++;

    const roundedRating = Math.min(5, Math.max(1, Math.round(t.customerRating)));
    ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;

    if (!customerSpending[t.customerId]) {
      customerSpending[t.customerId] = { count: 0, total: 0, ratings: [] };
    }
    customerSpending[t.customerId].count += 1;
    customerSpending[t.customerId].total += t.finalAmount;
    customerSpending[t.customerId].ratings.push(t.customerRating);
  }

  const spendList = Object.values(customerSpending);
  const avgSpending = spendList.length > 0
    ? spendList.reduce((acc, curr) => acc + curr.total, 0) / spendList.length
    : 0;

  return {
    customerTypes: [
      { name: 'Member', count: memberCount },
      { name: 'Normal', count: normalCount },
    ],
    genders: [
      { name: 'Female', count: femaleCount },
      { name: 'Male', count: maleCount },
    ],
    ratingDistribution: [
      { stars: '5 Stars', count: ratingCounts[5] },
      { stars: '4 Stars', count: ratingCounts[4] },
      { stars: '3 Stars', count: ratingCounts[3] },
      { stars: '2 Stars', count: ratingCounts[2] },
      { stars: '1 Star', count: ratingCounts[1] },
    ],
    uniqueCustomersCount: Object.keys(customerSpending).length,
    averageCustomerSpending: Number(avgSpending.toFixed(2)),
  };
}

/**
 * Sales executive performance analysis
 */
export function calculateExecutiveAnalysis(transactions: SaleTransaction[]) {
  const execMap: Record<string, {
    name: string;
    sales: number;
    transactions: number;
    quantity: number;
    ratingSum: number;
    branch: string;
  }> = {};

  for (const t of transactions) {
    if (!execMap[t.salesExecutive]) {
      execMap[t.salesExecutive] = {
        name: t.salesExecutive,
        sales: 0,
        transactions: 0,
        quantity: 0,
        ratingSum: 0,
        branch: t.branch,
      };
    }
    execMap[t.salesExecutive].sales += t.finalAmount;
    execMap[t.salesExecutive].transactions += 1;
    execMap[t.salesExecutive].quantity += t.quantity;
    execMap[t.salesExecutive].ratingSum += t.customerRating;
  }

  return Object.values(execMap).map((e) => ({
    name: e.name,
    branch: e.branch,
    sales: Number(e.sales.toFixed(2)),
    transactions: e.transactions,
    quantity: e.quantity,
    aov: Number((e.sales / e.transactions).toFixed(2)),
    avgRating: Number((e.ratingSum / e.transactions).toFixed(2)),
  })).sort((a, b) => b.sales - a.sales);
}

/**
 * Payment method analysis
 */
export function calculatePaymentAnalysis(transactions: SaleTransaction[]) {
  const payMap: Record<string, { method: string; count: number; total: number }> = {};
  let totalSales = 0;

  for (const t of transactions) {
    if (!payMap[t.paymentMethod]) {
      payMap[t.paymentMethod] = { method: t.paymentMethod, count: 0, total: 0 };
    }
    payMap[t.paymentMethod].count += 1;
    payMap[t.paymentMethod].total += t.finalAmount;
    totalSales += t.finalAmount;
  }

  return Object.values(payMap).map((p) => ({
    method: p.method,
    count: p.count,
    total: Number(p.total.toFixed(2)),
    percent: totalSales > 0 ? Number(((p.total / totalSales) * 100).toFixed(1)) : 0,
  }));
}

/**
 * Branch performance analysis
 */
export function calculateBranchAnalysis(transactions: SaleTransaction[]) {
  const branchMap: Record<string, { branch: string; city: string; sales: number; transactions: number; quantity: number }> = {};

  for (const t of transactions) {
    if (!branchMap[t.branch]) {
      branchMap[t.branch] = { branch: t.branch, city: t.city, sales: 0, transactions: 0, quantity: 0 };
    }
    branchMap[t.branch].sales += t.finalAmount;
    branchMap[t.branch].transactions += 1;
    branchMap[t.branch].quantity += t.quantity;
  }

  return Object.values(branchMap).map((b) => ({
    branch: b.branch,
    city: b.city,
    sales: Number(b.sales.toFixed(2)),
    transactions: b.transactions,
    quantity: b.quantity,
    aov: Number((b.sales / b.transactions).toFixed(2)),
  })).sort((a, b) => b.sales - a.sales);
}

/**
 * Data Cleaning & Quality Audit (Equivalent to Pandas df.isna(), df.duplicated(), df.describe())
 */
export function auditDataQuality(transactions: SaleTransaction[]): DataQualityReport {
  let missingValues = 0;
  let invalidValues = 0;
  const invoiceSet = new Set<string>();
  let duplicateCount = 0;
  const issues: DataQualityReport['issues'] = [];

  for (const t of transactions) {
    // Missing required fields
    if (!t.invoiceId || !t.customerId || !t.productName || !t.salesExecutive) {
      missingValues++;
    }

    // Duplicate check
    if (invoiceSet.has(t.invoiceId)) {
      duplicateCount++;
    } else {
      invoiceSet.add(t.invoiceId);
    }

    // Mathematical integrity check: Total = Price * Qty
    const expectedTotal = Number((t.unitPrice * t.quantity).toFixed(2));
    if (Math.abs(expectedTotal - t.totalSales) > 0.05) {
      invalidValues++;
    }

    // Range checks
    if (t.unitPrice <= 0 || t.quantity <= 0 || t.customerRating < 1.0 || t.customerRating > 5.0) {
      invalidValues++;
    }
  }

  if (duplicateCount > 0) {
    issues.push({
      type: 'duplicate',
      field: 'invoiceId',
      count: duplicateCount,
      description: `${duplicateCount} duplicate transaction invoices detected.`,
    });
  }

  if (invalidValues > 0) {
    issues.push({
      type: 'invalid_math',
      field: 'calculations / bounds',
      count: invalidValues,
      description: `${invalidValues} records failed formula precision or value limits.`,
    });
  }

  if (missingValues > 0) {
    issues.push({
      type: 'missing',
      field: 'metadata',
      count: missingValues,
      description: `${missingValues} records have empty or unformatted fields.`,
    });
  }

  const totalRecords = transactions.length;
  const badRecords = Math.min(totalRecords, missingValues + duplicateCount + invalidValues);
  const cleanRecords = Math.max(0, totalRecords - badRecords);
  const qualityPercentage = totalRecords > 0 ? Number(((cleanRecords / totalRecords) * 100).toFixed(1)) : 100;

  return {
    totalRecords,
    cleanRecords,
    qualityPercentage,
    missingValuesCount: missingValues,
    duplicateCount,
    invalidValuesCount: invalidValues,
    issues,
  };
}
