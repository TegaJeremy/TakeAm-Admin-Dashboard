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
import { CheckCircle2 } from 'lucide-react';
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
        const data = await adminApi.getPendingPayments(token);
        setPayments(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching payments:', error);
        toast.error('Failed to load payments');
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
      setPayments(payments.map(p =>
        p.id === selectedPayment.id
          ? { ...p, status: 'PAID' }
          : p
      ));
      toast.success('Payment marked as paid');
      setSelectedPayment(null);
    } catch (error: any) {
      console.error('[v0] Error marking payment:', error);
      toast.error(error?.data?.message || 'Failed to mark payment');
    } finally {
      setIsMarking(false);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.traderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.traderPhone.includes(searchQuery)
  );

  const totalPendingAmount = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

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
          value={pendingCount}
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
              <TableHead className="text-foreground">Grade</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{payment.traderName}</TableCell>
                  <TableCell className="text-muted-foreground">{payment.traderPhone}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="space-y-1">
                      <p>{payment.bankName}</p>
                      <p className="text-xs opacity-75">{payment.accountNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{payment.totalWeight.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ₦{payment.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-medium">
                      {payment.grade}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : payment.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'PENDING' && (
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
                  <p><strong>Amount:</strong> ₦{selectedPayment.totalAmount.toLocaleString()}</p>
                  <p><strong>Weight:</strong> {selectedPayment.totalWeight.toLocaleString()} kg</p>
                  <p><strong>Bank:</strong> {selectedPayment.bankName} - {selectedPayment.accountNumber}</p>
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

function CreditCard({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
