# Take-am Admin Dashboard

A comprehensive food waste recovery platform administration system for Lagos, connecting traders, logistics agents, and buyers.

## Overview

Take-am is a web-based admin platform that manages:
- **Traders & Agents**: Register, approve, and manage food traders and logistics agents
- **Orders & Requests**: Track buyer orders and trader pickup requests
- **Payments**: Manage payment processing and financial flows
- **Products**: Catalog food products with quality grades
- **Analytics**: Real-time dashboards with charts and metrics
- **Audit Logs**: Complete transparency with action tracking

## Features

### Public Pages
- **Landing Page**: Hero section with feature overview and CTA
- **About Page**: Platform mission, vision, and impact metrics
- **How It Works**: Step-by-step guides for traders, agents, and buyers
- **Contact Page**: Contact form and support information
- **Privacy Policy**: Data protection and privacy standards

### Admin Dashboard
- **Dashboard Home**: KPI statistics and 5 analytical charts
- **Agent Management**: Approve/reject agents, view details
- **Trader Management**: Filter and manage registered traders
- **Order Management**: Track buyer orders and delivery status
- **Payment Management**: Process payments and mark as paid
- **Request Management**: View and filter trader pickup requests
- **Product Management**: Catalog and manage food products
- **Audit Logs**: Complete action history and transparency

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: React Context
- **API Client**: Custom fetch wrapper

## Project Structure

```
app/
├── layout.tsx                    # Root layout with auth provider
├── globals.css                   # Theme and global styles
├── page.tsx                      # Landing page
├── (public)/                     # Public pages
│   ├── about/page.tsx
│   ├── how-it-works/page.tsx
│   ├── contact/page.tsx
│   └── privacy/page.tsx
├── auth/
│   └── login/page.tsx           # Admin login page
└── dashboard/
    ├── layout.tsx               # Dashboard layout with sidebar
    ├── page.tsx                 # Dashboard home with analytics
    ├── agents/page.tsx          # Agent management
    ├── traders/page.tsx         # Trader management
    ├── orders/page.tsx          # Order management
    ├── payments/page.tsx        # Payment management
    ├── requests/page.tsx        # Request management
    ├── products/page.tsx        # Product catalog
    └── audit-logs/page.tsx      # Audit log viewer

components/
├── dashboard/
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── stats-card.tsx           # KPI stat card
│   └── [other components]
└── protected-route.tsx          # Route protection wrapper

lib/
├── auth-context.tsx             # Authentication context
├── api.ts                       # API client and endpoints
├── types.ts                     # TypeScript interfaces
└── utils.ts                     # Utility functions
```

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_API_BASE_URL=https://takeam-api-gateway.onrender.com
```

### 3. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

## API Integration

The dashboard connects to the Take-am API Gateway:
- **Base URL**: `https://takeam-api-gateway.onrender.com`
- **Authentication**: Bearer token in Authorization header
- **Endpoints**: See `/lib/api.ts` for complete endpoint definitions

### Key Endpoints
- `GET /api/v1/admin/stats` - Dashboard statistics
- `GET /api/v1/admin/agents/pending` - Pending agents
- `GET /api/v1/admin/requests` - All trader requests
- `GET /api/v1/gradings/admin/pending-payments` - Pending payments
- `GET /api/v1/admin/orders` - All orders

All endpoints require `Authorization` header with JWT token.

## Authentication

- Login at `/auth/login` with admin credentials
- Token stored in localStorage
- Protected routes redirect to login if not authenticated
- Token passed automatically to all API requests

## Theme

The application uses a professional dark theme:
- **Primary**: Blue (#3b82f6) - Actions, primary UI
- **Accent**: Emerald (#10b981) - Success states
- **Background**: Very dark blue (#0a0e27)
- **Border**: Slate gray (#2d3748)
- **Chart Colors**: Blue, Emerald, Amber, Purple, Pink

## Charts & Analytics

The dashboard includes 5 interactive charts:
1. **Requests Trend**: Line chart showing requests over time
2. **Agents Status**: Bar chart of agent approval status
3. **Traders Distribution**: Pie chart of trader statuses
4. **Payments Trend**: Stacked area chart of payment status
5. **Revenue Trend**: Area chart of weekly revenue

## Form Validation

All forms use Zod schemas with React Hook Form:
- Email validation
- Required field validation
- Real-time error messages
- Toast notifications for feedback

## Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive tables with horizontal scrolling
- Touch-friendly button sizes
- Optimized for all screen sizes

## Security Considerations

- JWT token validation on all protected routes
- HTTPS enforced for production
- Role-based access control ready (SUPER_ADMIN flag)
- Secure password handling on login
- Audit logs track all admin actions
- CORS configured for API requests

## Performance Optimizations

- Code splitting by route
- Lazy loading for modals
- Optimized chart rendering
- Memoized components where needed
- Production builds with Turbopack

## Future Enhancements

- Agent details page with trader list
- Order details with item breakdown
- Product creation and edit forms
- Trader suspension/ban dialogs
- Payment dispute handling
- Advanced analytics with date ranges
- Export functionality for reports
- Multi-language support

## Support

For issues or questions:
- Email: support@takeam.com
- Phone: +234 (0) 123 4567 890
- Contact page: `/contact`

## License

All rights reserved © 2024 Take-am
