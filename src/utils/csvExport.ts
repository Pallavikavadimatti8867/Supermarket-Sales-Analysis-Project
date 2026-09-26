import { SaleTransaction, ProductCategory, Branch, City, CustomerType, Gender, PaymentMethod } from '../types';
import { BRANCH_CITY_MAP } from '../data/mockData';

export function exportToCSV(transactions: SaleTransaction[], filename = 'supermarket_sales_report.csv') {
  const headers = [
    'Transaction ID',
    'Invoice ID',
    'Date',
    'Time',
    'Customer ID',
    'Customer Type',
    'Gender',
    'Product ID',
    'Product Name',
    'Product Category',
    'Unit Price',
    'Quantity',
    'Tax (5%)',
    'Discount',
    'Total Sales',
    'Final Amount',
    'Payment Method',
    'Branch',
    'City',
    'Sales Executive',
    'Customer Rating',
  ];

  const rows = transactions.map((t) => [
    t.id,
    t.invoiceId,
    t.date,
    t.time,
    t.customerId,
    t.customerType,
    t.gender,
    t.productId,
    `"${t.productName.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    t.unitPrice.toFixed(2),
    t.quantity,
    t.tax.toFixed(2),
    t.discount.toFixed(2),
    t.totalSales.toFixed(2),
    t.finalAmount.toFixed(2),
    t.paymentMethod,
    t.branch,
    t.city,
    `"${t.salesExecutive}"`,
    t.customerRating.toFixed(1),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(transactions: SaleTransaction[], filename = 'supermarket_sales.xls') {
  // Generates a valid XML-based Excel file readable by Microsoft Excel and LibreOffice
  let table = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"/></head>
    <body>
      <table border="1">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff; font-weight: bold;">
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Customer ID</th>
            <th>Customer Type</th>
            <th>Gender</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Unit Price ($)</th>
            <th>Quantity</th>
            <th>Tax ($)</th>
            <th>Discount ($)</th>
            <th>Total Sales ($)</th>
            <th>Final Amount ($)</th>
            <th>Payment</th>
            <th>Branch</th>
            <th>City</th>
            <th>Sales Executive</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (const t of transactions) {
    table += `
      <tr>
        <td>${t.invoiceId}</td>
        <td>${t.date}</td>
        <td>${t.time}</td>
        <td>${t.customerId}</td>
        <td>${t.customerType}</td>
        <td>${t.gender}</td>
        <td>${t.productName}</td>
        <td>${t.category}</td>
        <td>${t.unitPrice.toFixed(2)}</td>
        <td>${t.quantity}</td>
        <td>${t.tax.toFixed(2)}</td>
        <td>${t.discount.toFixed(2)}</td>
        <td>${t.totalSales.toFixed(2)}</td>
        <td>${t.finalAmount.toFixed(2)}</td>
        <td>${t.paymentMethod}</td>
        <td>${t.branch}</td>
        <td>${t.city}</td>
        <td>${t.salesExecutive}</td>
        <td>${t.customerRating.toFixed(1)}</td>
      </tr>
    `;
  }

  table += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([table], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ParseCSVResult {
  success: boolean;
  importedCount: number;
  transactions: SaleTransaction[];
  errors: string[];
  validationReport: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    sampleWarnings: string[];
  };
}

export function parseCSVText(csvText: string): ParseCSVResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return {
      success: false,
      importedCount: 0,
      transactions: [],
      errors: ['File is empty or contains only a header.'],
      validationReport: { totalRows: 0, validRows: 0, invalidRows: 0, sampleWarnings: [] },
    };
  }

  const headerLine = lines[0].toLowerCase();
  const rows = lines.slice(1);
  const transactions: SaleTransaction[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  rows.forEach((row, idx) => {
    // Simple CSV parser supporting quotes
    const values: string[] = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length < 10) {
      warnings.push(`Row ${idx + 2}: Insufficient columns (${values.length} found).`);
      return;
    }

    try {
      const invoiceId = values[1] || `INV-IMP-${Date.now()}-${idx}`;
      const date = values[2] || new Date().toISOString().split('T')[0];
      const time = values[3] || '12:00';
      const customerId = values[4] || `CUST-IMP-${idx}`;
      const customerType = (values[5] === 'Member' ? 'Member' : 'Normal') as CustomerType;
      const gender = (values[6] === 'Female' ? 'Female' : 'Male') as Gender;
      const productId = values[7] || `PRD-IMP-${idx}`;
      const productName = values[8] || 'Supermarket Item';
      const category = (values[9] || 'Food and Beverages') as ProductCategory;
      const unitPrice = parseFloat(values[10]) || 15.0;
      const quantity = parseInt(values[11], 10) || 1;
      const totalSales = Number((unitPrice * quantity).toFixed(2));
      const tax = Number((totalSales * 0.05).toFixed(2));
      const discount = parseFloat(values[13]) || 0;
      const finalAmount = Number(Math.max(1, totalSales + tax - discount).toFixed(2));
      const paymentMethod = (values[16] || 'Cash') as PaymentMethod;
      const branch = (values[17] || 'Branch A') as Branch;
      const city = (values[18] || BRANCH_CITY_MAP[branch] || 'Yangon') as City;
      const salesExecutive = values[19] || 'Sarah Jenkins';
      const customerRating = parseFloat(values[20]) || 4.2;

      transactions.push({
        id: `TRX-IMP-${Date.now()}-${idx}`,
        invoiceId,
        date,
        time,
        customerId,
        customerType,
        gender,
        productId,
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
        customerRating: Math.min(5, Math.max(1, customerRating)),
      });
    } catch (e: any) {
      warnings.push(`Row ${idx + 2}: Failed to parse record - ${e.message}`);
    }
  });

  return {
    success: transactions.length > 0,
    importedCount: transactions.length,
    transactions,
    errors,
    validationReport: {
      totalRows: rows.length,
      validRows: transactions.length,
      invalidRows: rows.length - transactions.length,
      sampleWarnings: warnings.slice(0, 5),
    },
  };
}
