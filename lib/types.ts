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
  fullName: string;  // Backend uses "fullName" not "name"
  email: string;
  phoneNumber: string;  // Backend uses "phoneNumber" not "phone"
  assignedMarketId: string;  // Backend uses this
  identityType: 'NIN' | 'BVN' | 'PASSPORT';
  identityNumber: string;
  identityDocument: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  createdAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

// Trader/User
export interface Trader {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  marketId: string;
  stallNumber: string;
  bankAccountNumber: string;
  bankCode: string;
  bankName: string;
  accountName?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
  verified: boolean;
  registeredByAgentId?: string;
  createdAt: string;
  lastLogin?: string;
}

// Request (Trader Pickup Request)
export interface Request {
  id: string;
  traderId: string;
  traderName: string;
  traderPhone: string;
  productType: string;
  estimatedWeight: number;
  location?: string;
  notes?: string;
  agentId?: string;
  agentName?: string;
  agentPhone?: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

// Order
export interface Order {
  id: string;
  buyerId: string;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  deliveryAddress: string;
  paymentMethod: 'CARD' | 'CASH' | 'TRANSFER';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  grade: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
}

// Product - CORRECTED
export interface Product {
  id: string;
  productName: string;
  grade: 'A' | 'B' | 'C' | 'D';
  availableWeight: number;
  pricePerKg: number;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'RESERVED';
  location?: string;
  description?: string;
  images?: Array<{
    id: string;
    imageUrl: string;
    publicId: string;
  }>;
  traderId?: string;
  gradingId?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment/Grading - CORRECTED
export interface Payment {
  id: string;
  traderId: string;
  traderName: string;
  traderPhone: string;
  traderBankAccount: string;
  traderBankName: string;
  agentId: string;
  agentName: string;
  agentPhone: string;
  gradeAWeight: string;
  gradeBWeight: string;
  gradeCWeight: string;
  gradeDWeight: string;
  gradeAAmount: string;
  gradeBAmount: string;
  gradeCAmount: string;
  gradeDAmount: string;
  totalWeight: string;
  totalAmount: string;
  baseReferencePrice: string;
  agentNotes?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  gradedAt: string;
  paidAt?: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Admin User
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  createdAt: string;
  lastLogin?: string;
}

// Login Response - CORRECTED
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    phoneNumber: string | null;
    fullName: string;
    role: 'ADMIN' | 'SUPER_ADMIN' | 'AGENT' | 'TRADER' | 'BUYER';
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
    createdAt: string;
    lastLogin: string;
  };
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}