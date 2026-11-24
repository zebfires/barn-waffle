export type UserRole = 'admin' | 'staff';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  profit: number;
  image: string;
  createdAt: string;
}

export interface OrderItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'awaiting_payment' | 'paid';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'cash' | 'qr';
  customerNote: string;
  createdAt: string;
  staffId: string;
  cashReceived?: number;
  /** Missing on older orders — treated as paid. */
  status?: OrderStatus;
}

/** Drives the customer-facing QR display (`payments/current`). */
export interface PaymentSession {
  orderId: string;
  total: number;
  items: OrderItem[];
  promptPayId: string;
  status: 'awaiting' | 'paid';
  createdAt: string;
  paidAt?: string;
}

export interface InventoryItem {
  id: string;
  ingredient: string;
  stock: number;
  cost: number;
  unit: string;
  lowStockAlert: number;
  expiry?: string;
  supplier?: string;
}

export interface Analytics {
  id: string;
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  profit: number;
  expenses: number;
  date: string;
}

export interface CalculatorItem {
  id: string;
  menuId: string;
  menuName: string;
  ingredientCost: number;
  packagingCost: number;
  deliveryFee: number;
  laborCost: number;
  electricityCost: number;
  totalCost: number;
  sellingPrice: number;
  profitMargin: number;
  createdAt: string;
}
