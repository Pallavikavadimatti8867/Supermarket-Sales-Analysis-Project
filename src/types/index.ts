export type UserRole = 'admin' | 'executive';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  branch?: string;
  phone?: string;
  joinedDate?: string;
}

export interface UserAccount extends User {
  passwordHash?: string;
  salt?: string;
  password?: string;
  isRealAccount?: boolean;
}

export type CustomerType = 'Member' | 'Normal';
export type Gender = 'Female' | 'Male';
export type PaymentMethod = 'Ewallet' | 'Cash' | 'Credit card';
export type Branch = 'Branch A' | 'Branch B' | 'Branch C';
export type City = 'Yangon' | 'Mandalay' | 'Naypyitaw';

export type ProductCategory =
  | 'Health and Beauty'
  | 'Electronic Accessories'
  | 'Home and Lifestyle'
  | 'Sports and Travel'
  | 'Food and Beverages'
  | 'Fashion Accessories';

export interface SaleTransaction {
  id: string;
  invoiceId: string;
  date: string;
  time: string;
  customerId: string;
  customerType: CustomerType;
  gender: Gender;
  productId: string;
  productName: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
  totalSales: number; // Unit Price * Quantity
  tax: number; // 5% of Total Sales
  discount: number;
  finalAmount: number; // Total Sales + Tax - Discount
  paymentMethod: PaymentMethod;
  branch: Branch;
  city: City;
  salesExecutive: string;
  customerRating: number; // 1.0 - 5.0
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KPIData {
  totalSales: number;
  totalTransactions: number;
  totalProductsSold: number;
  averageOrderValue: number;
  totalCustomers: number;
  totalDiscount: number;
  totalTax: number;
  averageRating: number;
  salesGrowth?: number;
  orderGrowth?: number;
}

export interface FilterState {
  searchQuery: string;
  datePreset: 'all' | 'today' | 'yesterday' | 'last7days' | 'thisMonth' | 'prevMonth' | 'custom';
  startDate: string;
  endDate: string;
  branch: string;
  city: string;
  category: string;
  paymentMethod: string;
  customerType: string;
  gender: string;
  salesExecutive: string;
  minRating: number;
  minAmount: number;
  maxAmount: number;
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  sku: string;
  inStock: number;
}

export interface ExecutiveSummary {
  name: string;
  email: string;
  branch: Branch;
  totalSales: number;
  totalTransactions: number;
  totalUnitsSold: number;
  aov: number;
  avgRating: number;
  targetSales: number;
  targetAchievement: number;
}

export interface DataQualityReport {
  totalRecords: number;
  cleanRecords: number;
  qualityPercentage: number;
  missingValuesCount: number;
  duplicateCount: number;
  invalidValuesCount: number;
  issues: {
    type: 'missing' | 'duplicate' | 'invalid_math' | 'out_of_bounds';
    field: string;
    count: number;
    description: string;
  }[];
}
