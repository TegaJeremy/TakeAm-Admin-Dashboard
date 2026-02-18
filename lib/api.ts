const BASE_URL = 'https://takeam-api-gateway.onrender.com';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || `HTTP ${response.status}`,
      data
    );
  }

  return data;
}

// Admin Dashboard API endpoints
export const adminApi = {
  // Stats
  getStats: (token: string) =>
    apiCall('/api/v1/admin/stats', { token }),

  // Agents
  getAgents: (token: string) =>
    apiCall('/api/v1/admin/agents/pending', { token }),

  getActiveAgents: (token: string) =>
    apiCall('/api/v1/admin/agents/active', { token }),

  getAgentById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/agents/${id}`, { token }),

  approveAgent: (id: string, token: string, reason?: string) =>
    apiCall(`/api/v1/admin/agents/${id}/approve`, {
      token,
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  rejectAgent: (id: string, token: string, reason: string) =>
    apiCall(`/api/v1/admin/agents/${id}/reject`, {
      token,
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Requests
  getAllRequests: (token: string) =>
    apiCall('/api/v1/admin/requests', { token }),

  getPendingRequests: (token: string) =>
    apiCall('/api/v1/admin/requests/pending', { token }),

  getActiveRequests: (token: string) =>
    apiCall('/api/v1/admin/requests/active', { token }),

  getCompletedRequests: (token: string) =>
    apiCall('/api/v1/admin/requests/completed', { token }),

  getRequestById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/requests/${id}`, { token }),

  // Users/Traders
  getUsers: (token: string, params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/v1/admin/users${query ? '?' + query : ''}`, {
      token,
    });
  },

  getUserById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/users/${id}`, { token }),

  updateUserStatus: (
    id: string,
    status: string,
    token: string,
    reason?: string
  ) =>
    apiCall(`/api/v1/admin/users/${id}/status`, {
      token,
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    }),

  // Orders
  getOrders: (token: string) =>
    apiCall('/api/v1/admin/orders', { token }),

  getOrderById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/orders/${id}`, { token }),

  updateOrderDeliveryStatus: (
    id: string,
    deliveryStatus: string,
    token: string
  ) =>
    apiCall(`/api/v1/admin/orders/${id}/delivery-status`, {
      token,
      method: 'PUT',
      body: JSON.stringify({ deliveryStatus }),
    }),

  // Products
  getProducts: (token: string) =>
    apiCall('/api/v1/admin/products', { token }),

  getProductById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/products/${id}`, { token }),

  createProduct: (
    data: {
      name: string;
      grade: string;
      availableWeight: number;
      pricePerKg: number;
      description?: string;
      location?: string;
      images?: string[];
    },
    token: string
  ) =>
    apiCall('/api/v1/admin/products', {
      token,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (
    id: string,
    data: Record<string, any>,
    token: string
  ) =>
    apiCall(`/api/v1/admin/products/${id}`, {
      token,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string, token: string) =>
    apiCall(`/api/v1/admin/products/${id}`, {
      token,
      method: 'DELETE',
    }),

  // Payments/Gradings
  getPendingPayments: (token: string) =>
    apiCall('/api/v1/gradings/admin/pending-payments', { token }),

  markPaymentAsPaid: (id: string, token: string) =>
    apiCall(`/api/v1/gradings/${id}/mark-paid`, {
      token,
      method: 'PUT',
      body: JSON.stringify({}),
    }),

  // Audit Logs
  getAuditLogs: (token: string) =>
    apiCall('/api/v1/admin/audit-logs', { token }),

  // Admin Management
  getAdmins: (token: string) =>
    apiCall('/api/v1/admin/admins', { token }),

  createAdmin: (data: { email: string; password: string }, token: string) =>
    apiCall('/api/v1/admin/admins', {
      token,
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
