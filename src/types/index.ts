export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  category: string;
  sku: string;
  barcode?: string;
  stock: number;
  minStock: number;
  maxStock: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount?: number;
  notes?: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  cashierId: string;
  createdAt: Date;
  status: SaleStatus;
  receiptNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: Date;
  lastVisit?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  userId: string;
  createdAt: Date;
}

export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  totalProducts: number;
  lowStockItems: number;
  topSellingProducts: Product[];
  recentSales: Sale[];
  salesChart: ChartData[];
  inventoryValue: number;
}

export interface ChartData {
  date: string;
  sales: number;
  transactions: number;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'other';
export type SaleStatus = 'completed' | 'pending' | 'cancelled' | 'refunded';
export type UserRole = 'admin' | 'manager' | 'cashier' | 'inventory';

export interface AppState {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  users: User[];
  currentUser: User | null;
  cart: CartItem[];
  isAuthenticated: boolean;
  dashboardStats: DashboardStats | null;
}
