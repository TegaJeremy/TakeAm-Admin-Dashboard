'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { Payment } from '@/lib/types';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';

export default function PaymentsPage() {
  const { token, isLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    if (!token || isLoading) return;

    const fetchPayments = async () => {
      try {
        const response = await adminApi.getPendingPayments(token) as any;
        
        // Handle different response formats
        const paymentsData = response?.data || response || [];
        console.log('[Payments] Fetched:', paymentsData);
        
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (error: any) {
        console.error('[Payments] Error fetching payments:', error);
        toast.error(error.message || 'Failed to load payments');
      } finally {
        setPaymentsLoading(false);
      }
    };

    fetchPayments();
  }, [token, isLoading]);

  const handleMarkAsPaid = async () => {
    if (!selectedPayment || !token) return;

    setIsMarking(true);
    try {
      await adminApi.markPaymentAsPaid(selectedPayment.id, token);
      
      // Remove from pending list instead of updating status
      setPayments(payments.filter(p => p.id !== selectedPayment.id));
      
      toast.success('Payment marked as paid successfully');
      setSelectedPayment(null);
    } catch (error: any) {
      console.error('[Payments] Error marking payment:', error);
      toast.error(error?.message || 'Failed to mark payment');
    } finally {
      setIsMarking(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (!payment) return false;
    
    const matchesSearch = !searchQuery ||
      payment.traderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.traderPhone?.includes(searchQuery);
    
    return matchesSearch;
  });

  // Parse amounts as they come as strings from backend
  const totalPendingAmount = payments
    .filter(p => p.paymentStatus === 'PENDING')
    .reduce((sum, p) => sum + parseFloat(p.totalAmount || '0'), 0);

  const pendingCount = payments.filter(p => p.paymentStatus === 'PENDING').length;

  if (paymentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-2">Manage trader payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          label="Pending Payments"
          value={pendingCount.toString()}
          icon={<CreditCard className="w-8 h-8 text-amber-500" />}
        />
        <StatsCard
          label="Pending Amount"
          value={`₦${totalPendingAmount.toLocaleString()}`}
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />}
        />
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Search payments by trader name or phone..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
      />

      {/* Payments Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Trader</TableHead>
              <TableHead className="text-foreground">Phone</TableHead>
              <TableHead className="text-foreground">Bank Details</TableHead>
              <TableHead className="text-foreground">Weight (kg)</TableHead>
              <TableHead className="text-foreground">Amount</TableHead>
              <TableHead className="text-foreground">Agent</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {payments.length === 0 ? 'No pending payments' : 'No payments match your search'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {payment.traderName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.traderPhone || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="space-y-1">
                      <p>{payment.traderBankName || 'N/A'}</p>
                      <p className="text-xs opacity-75">
                        {payment.traderBankAccount || 'N/A'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {parseFloat(payment.totalWeight || '0').toLocaleString()} kg
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ₦{parseFloat(payment.totalAmount || '0').toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {payment.agentName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : payment.paymentStatus === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {payment.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.paymentStatus === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Mark Paid</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mark as Paid Dialog */}
      {selectedPayment && (
        <AlertDialog open={!!selectedPayment} onOpenChange={(open) => {
          if (!open) setSelectedPayment(null);
        }}>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogTitle className="text-foreground">Mark Payment as Paid</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              <div className="space-y-3 mt-4">
                <p>Are you sure you want to mark this payment as paid?</p>
                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-2">
                  <p><strong>Trader:</strong> {selectedPayment.traderName}</p>
                  <p><strong>Amount:</strong> ₦{parseFloat(selectedPayment.totalAmount).toLocaleString()}</p>
                  <p><strong>Weight:</strong> {parseFloat(selectedPayment.totalWeight).toLocaleString()} kg</p>
                  <p><strong>Bank:</strong> {selectedPayment.traderBankName} - {selectedPayment.traderBankAccount}</p>
                </div>
              </div>
            </AlertDialogDescription>
            <div className="flex gap-3">
              <AlertDialogCancel className="border-border text-foreground">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMarkAsPaid}
                disabled={isMarking}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {isMarking ? 'Processing...' : 'Mark as Paid'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}