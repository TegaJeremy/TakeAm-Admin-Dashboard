'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  ClipboardList,
  Truck,
  LogOut,
  Settings,
  Leaf,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const navItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Traders', href: '/dashboard/traders' },
  { icon: Truck, label: 'Agents', href: '/dashboard/agents' },
  { icon: ShoppingCart, label: 'Orders', href: '/dashboard/orders' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/payments' },
  { icon: ClipboardList, label: 'Requests', href: '/dashboard/requests' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: Settings, label: 'Audit Logs', href: '/dashboard/audit-logs' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, email } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg border border-border bg-card hover:bg-card/50"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-sidebar text-sidebar-foreground transform transition-transform duration-300 md:translate-x-0 md:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-sidebar-border flex items-center px-6 gap-2">
          <Leaf className="w-6 h-6 text-accent" />
          <span className="text-lg font-bold">Take-am</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-4">
          <div className="px-2">
            <p className="text-xs text-sidebar-foreground/60 mb-1">Logged in as</p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">{email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-sidebar border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
