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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`[API] Calling: ${endpoint}`, { 
      method: fetchOptions.method || 'GET',
      hasToken: !!token 
    });

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('[API] Failed to parse JSON response:', jsonError);
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        console.warn('[API] Non-JSON response:', text.substring(0, 200));
        data = { message: text };
      } catch (textError) {
        data = null;
      }
    }

    console.log(`[API] Response from ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data: data,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      } else if (response.status === 401) {
        errorMessage = 'Invalid credentials or session expired';
      } else if (response.status === 403) {
        errorMessage = 'Access denied';
      } else if (response.status === 404) {
        errorMessage = 'Resource not found';
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (response.status === 502) {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
      } else if (response.status === 503) {
        errorMessage = 'Service unavailable. Please try again.';
      }

      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('[API] API Error:', {
        status: error.status,
        message: error.message,
        data: error.data,
      });
      throw error;
    }

    console.error('[API] Network Error:', error);
    throw new ApiError(
      0,
      'Network error. Please check your connection and try again.',
      null
    );
  }
}

export const adminApi = {
  // Stats
  getStats: (token: string) =>
    apiCall('/api/v1/admin/stats', { token }),

  getDashboardStats: (token: string) =>
    apiCall('/api/v1/admin/stats', { token }),

  // Agents
  getAgents: (token: string, params?: { page?: number; size?: number; status?: string }) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return apiCall(`/api/v1/admin/agents/pending${query}`, { token });
},

getAllAgents: (token: string, params?: { page?: number; size?: number }) => {
  const p: Record<string, string> = { role: 'AGENT' };
  if (params?.page !== undefined) p.page = String(params.page);
  if (params?.size !== undefined) p.size = String(params.size);
  return apiCall(`/api/v1/admin/users?${new URLSearchParams(p).toString()}`, { token });
},
  getActiveAgents: (token: string) =>
    apiCall('/api/v1/admin/agents/active', { token }),

  getAgentById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/agents/${id}`, { token }),

  approveAgent: (id: string, token: string, reason?: string) =>
    apiCall(`/api/v1/admin/agents/${id}/approve`, {
      token,
      method: 'POST',
      body: JSON.stringify({ reason: reason || 'Approved by admin' }),
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
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiCall(`/api/v1/admin/users${query ? '?' + query : ''}`, { token });
  },

  getUserById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/users/${id}`, { token }),

  suspendUser: (id: string, token: string, reason: string) =>
    apiCall(`/api/v1/admin/users/${id}/suspend`, {
      token,
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  banUser: (id: string, token: string, reason: string) =>
    apiCall(`/api/v1/admin/users/${id}/ban`, {
      token,
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  reactivateUser: (id: string, token: string, reason: string) =>
    apiCall(`/api/v1/admin/users/${id}/reactivate`, {
      token,
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Orders
  getOrders: (token: string, params?: { page?: number; limit?: number }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall(`/api/v1/admin/orders${query}`, { token });
  },

  getOrderById: (id: string, token: string) =>
    apiCall(`/api/v1/admin/orders/${id}`, { token }),

  updateOrderStatus: (id: string, status: string, token: string) =>
    apiCall(`/api/v1/admin/orders/${id}/status`, {
      token,
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Products
  getProducts: (token: string) =>
    apiCall('/api/v1/admin/products', { token }),

  getProductById: (productId: string, token: string) =>
    apiCall(`/api/v1/admin/products/${productId}`, { token }),

  createProduct: (
    data: FormData | {
      productName: string;
      grade: string;
      availableWeight: number;
      pricePerKg: number;
      description?: string;
      location?: string;
      status?: string;
    },
    token: string
  ): Promise<any> => {
    // If FormData, send as multipart
    if (data instanceof FormData) {
      return fetch(`${BASE_URL}/api/v1/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        },
        body: data,
      }).then(async (response) => {
        const contentType = response.headers.get('content-type');
        let result;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            result = await response.json();
          } catch (jsonError) {
            console.error('[API] Failed to parse JSON response:', jsonError);
            result = null;
          }
        } else {
          const text = await response.text();
          result = { message: text };
        }
        
        console.log(`[API] Response from /api/v1/admin/products:`, {
          status: response.status,
          ok: response.ok,
          data: result,
        });
        
        if (!response.ok) {
          const errorMessage = result?.message || `Failed to create product (${response.status})`;
          throw new ApiError(response.status, errorMessage, result);
        }
        
        return result;
      });
    }

    // Otherwise send as JSON
    return apiCall('/api/v1/admin/products', {
      token,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProduct: (id: string, data: Record<string, any>, token: string) =>
    apiCall(`/api/v1/admin/products/${id}`, {
      token,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (productId: string, token: string) =>
    apiCall(`/api/v1/admin/products/${productId}`, {
      token,
      method: 'DELETE',
    }),

  // Payments/Gradings
  getPendingPayments: (token: string) =>
    apiCall('/api/v1/gradings/admin/pending-payments', { token }),

  getAllGradings: (token: string, params?: { 
    status?: string; 
    agentId?: string; 
    traderId?: string;
    limit?: number;
    offset?: number;
  }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall(`/api/v1/gradings/admin/all${query}`, { token });
  },

  markPaymentAsPaid: (id: string, token: string) =>
    apiCall(`/api/v1/gradings/${id}/mark-paid`, {
      token,
      method: 'PUT',
    }),

  // Audit Logs
  getAuditLogs: (token: string, params?: { page?: number; size?: number }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall(`/api/v1/admin/audit-logs${query}`, { token });
  },

  // Admin Management (Super Admin only)
  getAdmins: (token: string) =>
    apiCall('/api/v1/admin/admins', { token }),

  createAdmin: (data: { 
    email: string; 
    fullName: string;
    phoneNumber: string;
    password: string;
    role?: 'ADMIN' | 'SUPER_ADMIN';
  }, token: string) =>
    apiCall('/api/v1/admin/create', {
      token,
      method: 'POST',
      body: JSON.stringify(data),
    }),
};