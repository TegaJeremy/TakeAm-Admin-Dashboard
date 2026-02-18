# Take-am Admin Dashboard - Installation Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- Git (for version control)

### 2. Clone/Download Project
```bash
# If you have the project as a zip
unzip takeam-admin.zip
cd takeam-admin

# Or clone from git
git clone <repo-url>
cd takeam-admin
```

### 3. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 4. Environment Setup

Create a `.env.local` file in the project root:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://takeam-api-gateway.onrender.com

# Optional: For development
NEXT_PUBLIC_DEBUG=false
```

### 5. Start Development Server
```bash
pnpm dev
# or
npm run dev
```

The application will be available at: `http://localhost:3000`

## Build for Production

```bash
pnpm build
pnpm start
```

## Deployment to Vercel

### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Go to vercel.com
3. Import project from GitHub
4. Add environment variables in Vercel dashboard
5. Deploy automatically on push

### Environment Variables for Production
Set these in your Vercel project settings:
- `NEXT_PUBLIC_API_BASE_URL` = `https://takeam-api-gateway.onrender.com`

## Verify Installation

After starting the dev server:

1. **Access Landing Page**
   - Open `http://localhost:3000`
   - Should show Take-am landing page with hero section
   - Click "Admin Login" button

2. **Test Login Flow**
   - Go to `http://localhost:3000/auth/login`
   - Enter demo credentials:
     - Email: `admin@takeam.com`
     - Password: `Demo@123456`
   - Should redirect to dashboard

3. **Verify Dashboard**
   - Check sidebar navigation loads
   - Verify stats cards appear
   - Check that charts render without errors

4. **Test API Connection**
   - Dashboard home should fetch stats from API
   - Check browser console for any errors
   - Verify data appears in stats cards and charts

## Common Issues & Solutions

### Issue: Module not found errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Issue: API connection errors

**Solution:**
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check network tab in browser DevTools
- Ensure API is running and accessible
- Try accessing API directly in browser:
  - `https://takeam-api-gateway.onrender.com/api/v1/admin/stats`

### Issue: Login fails with "Network error"

**Solution:**
- Confirm API base URL in `.env.local`
- Check if API server is online
- Try in incognito mode (clears cache)
- Check CORS settings on API

### Issue: Charts not displaying

**Solution:**
```bash
# Ensure Recharts is installed
pnpm add recharts
pnpm dev
```

### Issue: Sidebar not appearing

**Solution:**
- Clear browser cache: Ctrl+Shift+Del (Windows) or Cmd+Shift+Delete (Mac)
- Refresh page: Ctrl+R or Cmd+R
- Check console for errors

### Issue: Token not persisting after login

**Solution:**
- Check browser localStorage is enabled
- Try clearing localStorage: 
  ```javascript
  // In browser console
  localStorage.clear()
  ```
- Re-login and verify token is saved

## Project Structure Quick Reference

```
takeam-admin/
├── app/                        # Next.js app directory
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   ├── (public)/              # Public pages
│   ├── auth/login/            # Login page
│   └── dashboard/             # Admin dashboard
├── components/                # React components
│   ├── dashboard/             # Dashboard components
│   ├── ui/                    # shadcn UI components
│   └── protected-route.tsx    # Route protection
├── lib/                       # Utilities and logic
│   ├── auth-context.tsx       # Authentication
│   ├── api.ts                 # API client
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Helper functions
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind configuration
├── next.config.mjs            # Next.js configuration
├── README.md                  # Project overview
├── API_INTEGRATION.md         # API documentation
└── INSTALLATION.md            # This file
```

## Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code (if configured)
pnpm format
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Performance Tips

1. **Optimize Images**: Compress images before uploading
2. **Enable Caching**: Use browser cache for static assets
3. **Code Splitting**: Routes split automatically by Next.js
4. **Lazy Loading**: Charts and tables load on demand
5. **API Caching**: Consider caching endpoint responses

## Security Checklist

Before going to production:

- [ ] Change demo login credentials
- [ ] Implement token refresh logic
- [ ] Set up HTTPS enforcement
- [ ] Enable CORS for trusted origins only
- [ ] Implement rate limiting
- [ ] Set up audit logging
- [ ] Add API authentication verification
- [ ] Test with real API endpoints
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection if needed

## Getting Help

### Documentation
- [README.md](./README.md) - Project overview
- [API_INTEGRATION.md](./API_INTEGRATION.md) - API reference
- Next.js Docs: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com

### Troubleshooting
1. Check browser console (F12) for errors
2. Review network tab for API failures
3. Check terminal for build errors
4. Clear cache and restart server

### Contact Support
- Email: support@takeam.com
- Phone: +234 (0) 123 4567 890
- Website: https://takeam.com

## Next Steps

1. **Customize Branding**
   - Update logo in components
   - Change color scheme in `globals.css`
   - Update company name and links

2. **Connect Real API**
   - Update `NEXT_PUBLIC_API_BASE_URL` to production API
   - Test all endpoints
   - Verify authentication flow

3. **Add Missing Features**
   - Agent details page
   - Product creation forms
   - Order details view
   - Advanced filters and search

4. **Deploy Application**
   - Use Vercel for easiest deployment
   - Or deploy to your own server
   - Set up CI/CD pipeline

5. **Monitor & Maintain**
   - Monitor error rates
   - Check performance metrics
   - Review audit logs
   - Update dependencies regularly

## Upgrade Guide

To update dependencies:
```bash
pnpm upgrade
# or for specific package
pnpm upgrade package-name
```

## Useful Links

- **Next.js**: https://nextjs.org
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Recharts**: https://recharts.org
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

---

**Last Updated**: December 2024
**Version**: 1.0.0
