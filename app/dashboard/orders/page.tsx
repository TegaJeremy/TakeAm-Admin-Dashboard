'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { Order } from '@/lib/types';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye } from 'lucide-react';

export default function OrdersPage() {
  const { token, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!token || isLoading) return;

    const fetchOrders = async () => {
      try {
        const data = await adminApi.getOrders(token);
        setOrders(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [token, isLoading]);

  const filteredOrders = orders.filter(order =>
    order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.buyerPhone.includes(searchQuery) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage buyer orders</p>
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Search orders by ID, buyer name, or phone..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
      />

      {/* Orders Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Order ID</TableHead>
              <TableHead className="text-foreground">Buyer</TableHead>
              <TableHead className="text-foreground">Phone</TableHead>
              <TableHead className="text-foreground">Items</TableHead>
              <TableHead className="text-foreground">Weight</TableHead>
              <TableHead className="text-foreground">Amount</TableHead>
              <TableHead className="text-foreground">Delivery</TableHead>
              <TableHead className="text-foreground">Payment</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-border">
                  <TableCell className="font-mono text-sm text-foreground">{order.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium text-foreground">{order.buyerName}</TableCell>
                  <TableCell className="text-muted-foreground">{order.buyerPhone}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className="text-foreground">{order.totalWeight.toLocaleString()} kg</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ₦{order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.deliveryStatus === 'DELIVERED'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : order.deliveryStatus === 'IN_TRANSIT'
                        ? 'bg-blue-500/10 text-blue-500'
                        : order.deliveryStatus === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {order.deliveryStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : order.paymentStatus === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
