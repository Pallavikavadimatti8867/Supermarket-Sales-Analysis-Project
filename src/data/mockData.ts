import { SaleTransaction, ProductItem, User, Branch, City, CustomerType, Gender, PaymentMethod, ProductCategory } from '../types';

export const BRANCH_CITY_MAP: Record<Branch, City> = {
  'Branch A': 'Yangon',
  'Branch B': 'Mandalay',
  'Branch C': 'Naypyitaw',
};

export const SALES_EXECUTIVES = [
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@supermarket.com', branch: 'Branch A' as Branch, target: 85000 },
  { name: 'David Kim', email: 'david.kim@supermarket.com', branch: 'Branch B' as Branch, target: 75000 },
  { name: 'Emily Chen', email: 'emily.chen@supermarket.com', branch: 'Branch A' as Branch, target: 80000 },
  { name: 'Marcus Vance', email: 'marcus.vance@supermarket.com', branch: 'Branch C' as Branch, target: 70000 },
  { name: 'Aisha Patel', email: 'aisha.patel@supermarket.com', branch: 'Branch B' as Branch, target: 78000 },
];

export const USERS: User[] = [
  {
    id: 'USR-000',
    email: 'pallavisk46@gmail.com',
    name: 'Pallavi (System Administrator)',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 100-2000',
    joinedDate: '2023-01-01',
  },
  {
    id: 'USR-001',
    email: 'admin@supermarket.com',
    name: 'Eleanor Vance (Admin)',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 234-5678',
    joinedDate: '2023-01-15',
  },
  {
    id: 'USR-002',
    email: 'sarah.jenkins@supermarket.com',
    name: 'Sarah Jenkins',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 345-6789',
    joinedDate: '2024-03-10',
  },
  {
    id: 'USR-003',
    email: 'david.kim@supermarket.com',
    name: 'David Kim',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch B',
    phone: '+1 (555) 456-7890',
    joinedDate: '2024-04-12',
  },
  {
    id: 'USR-004',
    email: 'emily.chen@supermarket.com',
    name: 'Emily Chen',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 567-8901',
    joinedDate: '2024-06-01',
  },
  {
    id: 'USR-005',
    email: 'marcus.vance@supermarket.com',
    name: 'Marcus Vance',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch C',
    phone: '+1 (555) 678-9012',
    joinedDate: '2024-07-15',
  },
  {
    id: 'USR-006',
    email: 'aisha.patel@supermarket.com',
    name: 'Aisha Patel',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch B',
    phone: '+1 (555) 789-0123',
    joinedDate: '2024-08-20',
  },
];

export const PRODUCTS: ProductItem[] = [
  // Health and Beauty
  { id: 'PRD-01', name: 'Organic Argan Hair Serum', category: 'Health and Beauty', unitPrice: 34.50, sku: 'HB-ARG-01', inStock: 142 },
  { id: 'PRD-02', name: 'Hydrating Face Cream SPF 30', category: 'Health and Beauty', unitPrice: 28.00, sku: 'HB-FAC-02', inStock: 95 },
  { id: 'PRD-03', name: 'Vitamin C Brightening Cleanser', category: 'Health and Beauty', unitPrice: 19.50, sku: 'HB-CLN-03', inStock: 180 },
  { id: 'PRD-04', name: 'Bamboo Charcoal Toothpaste Pack', category: 'Health and Beauty', unitPrice: 12.00, sku: 'HB-TP-04', inStock: 310 },
  { id: 'PRD-05', name: 'Mineral Salt Bath Soak (1kg)', category: 'Health and Beauty', unitPrice: 22.00, sku: 'HB-ST-05', inStock: 88 },
  { id: 'PRD-06', name: 'Herbal Body Wash & Lotion Kit', category: 'Health and Beauty', unitPrice: 42.00, sku: 'HB-BW-06', inStock: 74 },

  // Electronic Accessories
  { id: 'PRD-07', name: 'Magnetic Wireless Charging Pad', category: 'Electronic Accessories', unitPrice: 38.00, sku: 'EA-WCP-07', inStock: 110 },
  { id: 'PRD-08', name: 'Active Noise Cancelling Earbuds', category: 'Electronic Accessories', unitPrice: 79.99, sku: 'EA-EAR-08', inStock: 65 },
  { id: 'PRD-09', name: 'Braided 65W Fast USB-C Cable', category: 'Electronic Accessories', unitPrice: 14.50, sku: 'EA-CBL-09', inStock: 420 },
  { id: 'PRD-10', name: 'Multi-Port USB 3.0 Hub & Dock', category: 'Electronic Accessories', unitPrice: 45.00, sku: 'EA-HUB-10', inStock: 90 },
  { id: 'PRD-11', name: 'Ultra-Slim 20000mAh Power Bank', category: 'Electronic Accessories', unitPrice: 49.50, sku: 'EA-PB-11', inStock: 130 },
  { id: 'PRD-12', name: 'Ergonomic Bluetooth Optical Mouse', category: 'Electronic Accessories', unitPrice: 26.00, sku: 'EA-MSE-12', inStock: 155 },

  // Home and Lifestyle
  { id: 'PRD-13', name: 'Aroma Diffuser with Ambient LED', category: 'Home and Lifestyle', unitPrice: 48.00, sku: 'HL-DIF-13', inStock: 82 },
  { id: 'PRD-14', name: 'Stainless Steel Pour-Over Kettle', category: 'Home and Lifestyle', unitPrice: 36.50, sku: 'HL-KTL-14', inStock: 64 },
  { id: 'PRD-15', name: 'Egyptian Cotton Bath Towel Set', category: 'Home and Lifestyle', unitPrice: 52.00, sku: 'HL-TWL-15', inStock: 120 },
  { id: 'PRD-16', name: 'Eco Bamboo Kitchen Cutting Board', category: 'Home and Lifestyle', unitPrice: 24.00, sku: 'HL-BRD-16', inStock: 190 },
  { id: 'PRD-17', name: 'Cast Iron Skillet Pre-Seasoned', category: 'Home and Lifestyle', unitPrice: 58.00, sku: 'HL-SKI-17', inStock: 48 },
  { id: 'PRD-18', name: 'Ceramic Tabletop Planter Trio', category: 'Home and Lifestyle', unitPrice: 31.00, sku: 'HL-PLN-18', inStock: 75 },

  // Sports and Travel
  { id: 'PRD-19', name: 'Vacuum Insulated Water Bottle 1L', category: 'Sports and Travel', unitPrice: 29.50, sku: 'ST-BOT-19', inStock: 240 },
  { id: 'PRD-20', name: 'High-Density Non-Slip Yoga Mat', category: 'Sports and Travel', unitPrice: 35.00, sku: 'ST-YGA-20', inStock: 115 },
  { id: 'PRD-21', name: 'Lightweight Packable Daypack 25L', category: 'Sports and Travel', unitPrice: 44.00, sku: 'ST-PAK-21', inStock: 95 },
  { id: 'PRD-22', name: 'Adjustable Resistance Bands Set', category: 'Sports and Travel', unitPrice: 21.00, sku: 'ST-BND-22', inStock: 280 },
  { id: 'PRD-23', name: 'Aluminum Trekking Poles Pair', category: 'Sports and Travel', unitPrice: 55.00, sku: 'ST-POL-23', inStock: 70 },
  { id: 'PRD-24', name: 'Memory Foam Travel Neck Pillow', category: 'Sports and Travel', unitPrice: 23.50, sku: 'ST-PLW-24', inStock: 160 },

  // Food and Beverages
  { id: 'PRD-25', name: 'Artisan Dark Roast Coffee Beans 500g', category: 'Food and Beverages', unitPrice: 18.50, sku: 'FB-COF-25', inStock: 310 },
  { id: 'PRD-26', name: 'Ceremonial Grade Matcha Powder 100g', category: 'Food and Beverages', unitPrice: 27.00, sku: 'FB-MAT-26', inStock: 140 },
  { id: 'PRD-27', name: 'Extra Virgin Cold Pressed Olive Oil', category: 'Food and Beverages', unitPrice: 22.50, sku: 'FB-OIL-27', inStock: 220 },
  { id: 'PRD-28', name: 'Raw Organic Wildflower Honey 1kg', category: 'Food and Beverages', unitPrice: 19.00, sku: 'FB-HNY-28', inStock: 185 },
  { id: 'PRD-29', name: 'Gourmet Mixed Roasted Nuts 750g', category: 'Food and Beverages', unitPrice: 24.50, sku: 'FB-NUT-29', inStock: 260 },
  { id: 'PRD-30', name: 'Aged Balsamic Vinegar of Modena', category: 'Food and Beverages', unitPrice: 31.00, sku: 'FB-VIN-30', inStock: 90 },

  // Fashion Accessories
  { id: 'PRD-31', name: 'Polarized UV400 Sunglasses', category: 'Fashion Accessories', unitPrice: 46.00, sku: 'FA-SGL-31', inStock: 110 },
  { id: 'PRD-32', name: 'Genuine Leather Minimalist Wallet', category: 'Fashion Accessories', unitPrice: 39.00, sku: 'FA-WAL-32', inStock: 145 },
  { id: 'PRD-33', name: 'Stainless Steel Mesh Analog Watch', category: 'Fashion Accessories', unitPrice: 89.00, sku: 'FA-WTC-33', inStock: 50 },
  { id: 'PRD-34', name: 'Canvas Everyday Tote Bag with Zip', category: 'Fashion Accessories', unitPrice: 25.00, sku: 'FA-TOT-34', inStock: 200 },
  { id: 'PRD-35', name: 'Silk Blend Lightweight Scarf', category: 'Fashion Accessories', unitPrice: 32.00, sku: 'FA-SCF-35', inStock: 90 },
  { id: 'PRD-36', name: 'Braided Leather Unisex Bracelet', category: 'Fashion Accessories', unitPrice: 18.00, sku: 'FA-BRC-36', inStock: 175 },
];

/**
 * Generate 1,020 realistic supermarket sales transactions
 * Spans from approx April 2026 to late September 2026
 */
export function generateInitialDataset(): SaleTransaction[] {
  const transactions: SaleTransaction[] = [];
  const paymentMethods: PaymentMethod[] = ['Ewallet', 'Cash', 'Credit card'];
  const customerTypes: CustomerType[] = ['Member', 'Normal'];
  const genders: Gender[] = ['Female', 'Male'];

  // Seeded pseudo-random generator for reproducible data
  let seed = 123456789;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Base date: 2026-09-26 (current date). Generate records for the past 180 days.
  const endTimestamp = new Date('2026-09-26T20:30:00Z').getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 1; i <= 1020; i++) {
    const daysAgo = Math.floor(pseudoRandom() * 175);
    const dateObj = new Date(endTimestamp - daysAgo * dayMs);
    const dateStr = dateObj.toISOString().split('T')[0];

    const hour = Math.floor(9 + pseudoRandom() * 12); // 9:00 to 21:00
    const minute = Math.floor(pseudoRandom() * 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    const product = PRODUCTS[Math.floor(pseudoRandom() * PRODUCTS.length)];
    const quantity = Math.floor(1 + pseudoRandom() * 9); // 1 to 9 units
    const unitPrice = product.unitPrice;

    // Financial calculations as required:
    // Total Sales = Unit Price * Quantity
    const totalSales = Number((unitPrice * quantity).toFixed(2));
    
    // Tax = 5% of Total Sales
    const tax = Number((totalSales * 0.05).toFixed(2));

    // Discounts: Members get frequent 5-10% discount, non-members occasional promotional discount
    const customerType: CustomerType = pseudoRandom() > 0.45 ? 'Member' : 'Normal';
    let discount = 0;
    if (customerType === 'Member' && pseudoRandom() > 0.3) {
      discount = Number((totalSales * (0.05 + pseudoRandom() * 0.05)).toFixed(2));
    } else if (pseudoRandom() > 0.75) {
      discount = Number((totalSales * 0.05).toFixed(2));
    }

    // Final Amount = Total Sales + Tax - Discount
    const finalAmount = Number(Math.max(1, totalSales + tax - discount).toFixed(2));

    const executiveObj = SALES_EXECUTIVES[Math.floor(pseudoRandom() * SALES_EXECUTIVES.length)];
    const branch = executiveObj.branch;
    const city = BRANCH_CITY_MAP[branch];

    // Customer rating typically between 3.5 and 5.0 with normal distribution
    const rawRating = 3.0 + pseudoRandom() * 2.0;
    const customerRating = Number((Math.min(5.0, Math.max(1.0, rawRating))).toFixed(1));

    const gender: Gender = pseudoRandom() > 0.51 ? 'Female' : 'Male';
    const paymentMethod: PaymentMethod = paymentMethods[Math.floor(pseudoRandom() * paymentMethods.length)];
    
    const customerNumber = 1000 + Math.floor(pseudoRandom() * 450);
    const customerId = `CUST-${customerNumber}`;

    const invoiceId = `INV-2026-${(10000 + i).toString()}`;
    const id = `TRX-${(80000 + i).toString()}`;

    transactions.push({
      id,
      invoiceId,
      date: dateStr,
      time: timeStr,
      customerId,
      customerType,
      gender,
      productId: product.id,
      productName: product.name,
      category: product.category,
      unitPrice,
      quantity,
      totalSales,
      tax,
      discount,
      finalAmount,
      paymentMethod,
      branch,
      city,
      salesExecutive: executiveObj.name,
      customerRating,
      createdAt: `${dateStr}T${timeStr}:00Z`,
      updatedAt: `${dateStr}T${timeStr}:00Z`,
    });
  }

  // Sort descending by date and time
  transactions.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  return transactions;
}
