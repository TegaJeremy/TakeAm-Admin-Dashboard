// Admin Stats
export interface AdminStats {
  totalRequests: number;
  pendingRequests: number;
  activeRequests: number;
  completedRequests: number;
  pendingPaymentsCount: number;
  pendingPaymentsAmount: number;
}

// Agent
export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  market: string;
  identityType: string;
  identityNumber: string;
  documentUrl: string;
  tradersCount: number;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// Trader/User
export interface Trader {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  registrationDate: string;
  lastLogin?: string;
  agentId?: string;
  agentName?: string;
}

// Request (Trader Pickup Request)
export interface Request {
  id: string;
  traderId: string;
  traderName: string;
  traderPhone: string;
  agentId?: string;
  agentName?: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  foodWeight: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

// Order
export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  totalWeight: number;
  deliveryStatus: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  pickupCode: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  weight: number;
  pricePerUnit: number;
}

// Product
export interface Product {
  id: string;
  name: string;
  grade: 'A' | 'B' | 'C' | 'D';
  availableWeight: number;
  pricePerKg: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED' | 'PENDING';
  location: string;
  description?: string;
  images: string[];
  traderId: string;
  traderName: string;
  createdAt: string;
  updatedAt: string;
}

// Payment/Grading
export interface Payment {
  id: string;
  traderId: string;
  traderName: string;
  traderPhone: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  agentId?: string;
  agentName?: string;
  totalWeight: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  gradedAt: string;
  paidAt?: string;
  grade: 'A' | 'B' | 'C' | 'D';
  requestId: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetId?: string;
  targetType?: string;
  reason?: string;
  changes?: Record<string, any>;
  createdAt: string;
}

// Admin User
export interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastLogin?: string;
}

// Login Response
export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
  };
}
