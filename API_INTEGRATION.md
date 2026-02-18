# Take-am API Integration Guide

## Base Configuration

- **API Base URL**: `https://takeam-api-gateway.onrender.com`
- **Authentication**: Bearer token via `Authorization` header
- **Content-Type**: `application/json`

## Authentication Flow

1. User logs in at `/auth/login` with email and password
2. API returns JWT token + admin details
3. Token stored in localStorage via AuthContext
4. Token automatically included in all API requests

```typescript
// Login
POST /api/v1/auth/login
{
  "email": "admin@takeam.com",
  "password": "Demo@123456"
}

// Response
{
  "token": "eyJhbGc...",
  "admin": {
    "id": "admin-123",
    "email": "admin@takeam.com",
    "role": "ADMIN"
  }
}
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/auth/logout` - Admin logout
- `POST /api/v1/auth/refresh` - Refresh token

### Admin Stats
- `GET /api/v1/admin/stats` - Get dashboard statistics
  - Returns: Total, pending, active, completed requests + payment counts

### Agents Management
- `GET /api/v1/admin/agents/pending` - List pending agents
- `GET /api/v1/admin/agents/active` - List active agents
- `GET /api/v1/admin/agents/:id` - Get agent details
- `POST /api/v1/admin/agents/:id/approve` - Approve agent
  - Body: `{ reason?: string }`
- `POST /api/v1/admin/agents/:id/reject` - Reject agent
  - Body: `{ reason: string }` (required)

### Trader Management
- `GET /api/v1/admin/users` - List users (with filters)
  - Query: `?role=TRADER&status=ACTIVE`
- `GET /api/v1/admin/users/:id` - Get user details
- `PUT /api/v1/admin/users/:id/status` - Update user status
  - Body: `{ status: "ACTIVE|SUSPENDED|BANNED", reason?: string }`

### Order Management
- `GET /api/v1/admin/orders` - List all orders
- `GET /api/v1/admin/orders/:id` - Get order details
- `PUT /api/v1/admin/orders/:id/delivery-status` - Update delivery
  - Body: `{ deliveryStatus: "PENDING|IN_TRANSIT|DELIVERED|CANCELLED" }`

### Product Management
- `GET /api/v1/admin/products` - List all products
- `GET /api/v1/admin/products/:id` - Get product details
- `POST /api/v1/admin/products` - Create product
  - Body: Product creation data
- `PUT /api/v1/admin/products/:id` - Update product
  - Body: Updated product data
- `DELETE /api/v1/admin/products/:id` - Delete product

### Requests Management
- `GET /api/v1/admin/requests` - List all requests
- `GET /api/v1/admin/requests/pending` - List pending requests
- `GET /api/v1/admin/requests/active` - List active requests
- `GET /api/v1/admin/requests/completed` - List completed requests
- `GET /api/v1/admin/requests/:id` - Get request details

### Payments Management
- `GET /api/v1/gradings/admin/pending-payments` - List pending payments
- `PUT /api/v1/gradings/:id/mark-paid` - Mark payment as paid
  - Body: `{}`

### Audit Logs
- `GET /api/v1/admin/audit-logs` - List audit logs

### Admin Management
- `GET /api/v1/admin/admins` - List admins (SUPER_ADMIN only)
- `POST /api/v1/admin/admins` - Create admin
  - Body: `{ email: string, password: string }`

## Request/Response Examples

### Get Dashboard Stats
```bash
curl -X GET https://takeam-api-gateway.onrender.com/api/v1/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "totalRequests": 150,
  "pendingRequests": 32,
  "activeRequests": 45,
  "completedRequests": 73,
  "pendingPaymentsCount": 8,
  "pendingPaymentsAmount": 425000
}
```

### List Pending Agents
```bash
curl -X GET https://takeam-api-gateway.onrender.com/api/v1/admin/agents/pending \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
[
  {
    "id": "agent-123",
    "name": "John Doe",
    "email": "john@takeam.com",
    "phone": "08012345678",
    "market": "Yaba Market",
    "identityType": "NIN",
    "identityNumber": "12345678901",
    "documentUrl": "https://...",
    "tradersCount": 0,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Approve Agent
```bash
curl -X POST https://takeam-api-gateway.onrender.com/api/v1/admin/agents/agent-123/approve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "All documents verified"}'
```

### Mark Payment as Paid
```bash
curl -X PUT https://takeam-api-gateway.onrender.com/api/v1/gradings/payment-123/mark-paid \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Data Types

### Agent Status
- `PENDING` - Awaiting approval
- `ACTIVE` - Approved and working
- `REJECTED` - Application rejected

### Trader Status
- `ACTIVE` - Can trade
- `SUSPENDED` - Temporarily blocked
- `BANNED` - Permanently blocked

### Request Status
- `PENDING` - Waiting for pickup
- `ACTIVE` - In progress
- `COMPLETED` - Finished

### Order Delivery Status
- `PENDING` - Not yet delivered
- `IN_TRANSIT` - On the way
- `DELIVERED` - Successfully delivered
- `CANCELLED` - Delivery cancelled

### Order Payment Status
- `PENDING` - Waiting for payment
- `PAID` - Payment received
- `FAILED` - Payment failed

### Product Status
- `AVAILABLE` - Ready for sale
- `OUT_OF_STOCK` - No inventory
- `DISCONTINUED` - Stopped selling
- `PENDING` - Awaiting approval

### Product Grade
- `A` - Excellent quality
- `B` - Good quality
- `C` - Fair quality
- `D` - Poor quality

## Error Handling

API errors follow this format:

```json
{
  "status": 400,
  "message": "Invalid request",
  "data": {
    "field": "email",
    "error": "Invalid email format"
  }
}
```

The application handles errors with:
- Toast notifications for user feedback
- Console logging for debugging
- Graceful fallbacks where applicable
- Validation before API calls

## Rate Limiting

- API rate limit: 100 requests/minute per admin
- Implement exponential backoff for retries
- Queue requests if rate limited

## Caching Strategy

- Stats refreshed on dashboard load
- Lists refreshed manually or on action
- No client-side caching to ensure freshness
- Server handles all caching logic

## Security Notes

- Always use HTTPS in production
- Never expose tokens in logs
- Validate all inputs before sending
- Use strong passwords
- Rotate tokens periodically
- Monitor audit logs regularly
- Implement IP whitelisting if possible

## Testing the Integration

### Demo Credentials
```
Email: admin@takeam.com
Password: Demo@123456
```

### Test Flows

1. **Authentication**
   - Login with demo credentials
   - Verify token is stored
   - Attempt to access protected routes

2. **Agent Approval**
   - Navigate to Agents page
   - Find pending agents
   - Approve with reason
   - Verify status change

3. **Payment Processing**
   - Navigate to Payments page
   - Click "Mark as Paid"
   - Verify update in table

4. **Dashboard Analytics**
   - Check all KPI cards
   - Verify chart data loads
   - Test filters and searches

## Troubleshooting

### Token Expired
- Clear localStorage
- Re-login to get new token
- Token refresh endpoint can be implemented

### 401 Unauthorized
- Verify token is in localStorage
- Check Authorization header format
- Try re-login

### 404 Not Found
- Verify endpoint URL is correct
- Check API base URL configuration
- Verify resource ID exists

### CORS Errors
- Verify API allows request origin
- Check Content-Type headers
- Use proxy in development if needed

## Implementation Checklist

- [x] Auth context setup
- [x] API client with error handling
- [x] Protected routes middleware
- [x] Login page with validation
- [x] Dashboard with stats
- [x] Agent management with actions
- [x] Trader management with filters
- [x] Payment management
- [x] Order and request tracking
- [x] Audit log viewing
- [x] Responsive design
- [x] Error notifications
- [ ] Agent details page
- [ ] Order details page
- [ ] Product create/edit forms
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Email notifications
