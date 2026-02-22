'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, ShoppingCart } from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  grade: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
}

interface Order {
  id: string;
  buyerId: string;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  deliveryAddress: string;
  deliveryType: string;
  deliveryStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const { token, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    if (!token || isLoading) return;
    fetchOrders();
  }, [token, isLoading, page]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await adminApi.getOrders(token!, { page, limit: PAGE_SIZE }) as any;

      // Go backend returns { orders: [], total: number } or just an array
      const ordersData =
        response?.orders ||
        response?.data?.orders ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);

      const totalCount = response?.total || ordersData.length;

      console.log('[Orders] Fetched:', ordersData);
      setOrders(ordersData);
      setTotal(totalCount);
    } catch (error: any) {
      console.error('[Orders] Error:', error);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    if (!token) return;
    try {
      await adminApi.updateOrderStatus(orderId, status, token);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;

    const matchesSearch =
      !searchQuery ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':     return 'bg-amber-500/10 text-amber-500';
      case 'CONFIRMED':   return 'bg-blue-500/10 text-blue-500';
      case 'IN_TRANSIT':  return 'bg-purple-500/10 text-purple-500';
      case 'DELIVERED':
      case 'PICKED_UP':   return 'bg-emerald-500/10 text-emerald-500';
      case 'CANCELLED':
      case 'FAILED':      return 'bg-red-500/10 text-red-500';
      default:            return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':    return 'bg-emerald-500/10 text-emerald-500';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500';
      case 'FAILED':  return 'bg-red-500/10 text-red-500';
      default:        return 'bg-muted text-muted-foreground';
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by order ID, buyer ID, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground md:flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-input border-border text-foreground md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="PICKED_UP">Picked Up</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Order ID</TableHead>
              <TableHead className="text-foreground">Items</TableHead>
              <TableHead className="text-foreground">Grand Total</TableHead>
              <TableHead className="text-foreground">Delivery</TableHead>
              <TableHead className="text-foreground">Payment</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Date</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="w-8 h-8 opacity-40 mx-auto mb-2" />
                  {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-muted/20">
                  <TableCell className="font-mono text-xs text-foreground">
                    {order.id?.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ₦{order.grandTotal?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(order.deliveryStatus)}`}>
                        {order.deliveryStatus}
                      </span>
                      <div className="text-xs text-muted-foreground">{order.deliveryType}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}