'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Shield, Ban, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Trader {
  id: string;
  phoneNumber?: string;
  email?: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

export default function TraderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [trader, setTrader] = useState<Trader | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'reactivate' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token && params.id) {
      fetchTrader();
    }
  }, [token, params.id]);

  const fetchTrader = async () => {
    try {
      console.log('[TraderDetail] Fetching trader:', params.id);
      const response: any = await adminApi.getUserById(params.id as string, token!);
      
      console.log('[TraderDetail] Response:', response);
      
      // Handle response format
      const traderData = response?.data || response;
      
      console.log('[TraderDetail] Trader data:', traderData);
      
      setTrader(traderData);
    } catch (error: any) {
      console.error('[TraderDetail] Error:', error);
      toast.error(error.message || 'Failed to load trader details');
      router.push('/dashboard/traders');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (action: 'suspend' | 'ban' | 'reactivate') => {
    setActionType(action);
    setReason('');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActionType(null);
    setReason('');
  };

  const handleAction = async () => {
    if (!trader || !token) return;
    
    if ((actionType === 'suspend' || actionType === 'ban') && !reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setIsSubmitting(true);
    try {
      if (actionType === 'suspend') {
        await adminApi.suspendUser(trader.id, token, reason);
        toast.success('Trader suspended successfully');
      } else if (actionType === 'ban') {
        await adminApi.banUser(trader.id, token, reason);
        toast.success('Trader banned successfully');
      } else if (actionType === 'reactivate') {
        await adminApi.reactivateUser(trader.id, token, reason || 'Reactivated by admin');
        toast.success('Trader reactivated successfully');
      }

      // Refresh trader data
      await fetchTrader();
      closeDialog();
    } catch (error: any) {
      console.error(`[TraderDetail] Error ${actionType}ing:`, error);
      toast.error(error.message || `Failed to ${actionType} trader`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'PENDING':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'SUSPENDED':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'BANNED':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!trader) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/traders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{trader.fullName}</h1>
            <p className="text-muted-foreground mt-1">Trader Details</p>
          </div>
        </div>

        <div className="flex gap-2">
          {trader.status === 'ACTIVE' && (
            <>
              <Button
                variant="outline"
                onClick={() => openDialog('suspend')}
                className="text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Suspend
              </Button>
              <Button
                variant="outline"
                onClick={() => openDialog('ban')}
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban
              </Button>
            </>
          )}
          {(trader.status === 'SUSPENDED' || trader.status === 'BANNED') && (
            <Button
              variant="outline"
              onClick={() => openDialog('reactivate')}
              className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          <Badge className={getStatusColor(trader.status)}>
            {trader.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Full Name</label>
            <p className="text-foreground font-medium">{trader.fullName}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Phone Number</label>
            <p className="text-foreground font-medium">{trader.phoneNumber || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="text-foreground font-medium">{trader.email || 'N/A'}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Role</label>
            <p className="text-foreground font-medium">{trader.role}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Account Status</label>
            <p className="text-foreground font-medium">{trader.status}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">User ID</label>
            <p className="text-foreground font-mono text-sm">{trader.id}</p>
          </div>
        </div>
      </div>

      {/* Activity Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Activity</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Registered</label>
            <p className="text-foreground font-medium">
              {trader.createdAt
                ? new Date(trader.createdAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Last Login</label>
            <p className="text-foreground font-medium">
              {trader.lastLogin
                ? new Date(trader.lastLogin).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {actionType === 'suspend' && 'Suspend Trader'}
              {actionType === 'ban' && 'Ban Trader'}
              {actionType === 'reactivate' && 'Reactivate Trader'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground" asChild>
              <div className="space-y-3">
                <p>
                  {actionType === 'suspend' && `Suspend ${trader.fullName}? They will be unable to log in until reactivated.`}
                  {actionType === 'ban' && `Permanently ban ${trader.fullName}? This is a severe action.`}
                  {actionType === 'reactivate' && `Reactivate ${trader.fullName}'s account? They will be able to log in again.`}
                </p>

                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-2">
                  <p className="font-medium text-foreground">{trader.fullName}</p>
                  <p className="text-sm text-muted-foreground">Phone: {trader.phoneNumber || 'N/A'}</p>
                  {trader.email && (
                    <p className="text-sm text-muted-foreground">Email: {trader.email}</p>
                  )}
                </div>

                {(actionType === 'suspend' || actionType === 'ban') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Reason <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={`Why are you ${actionType}ing this trader?`}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isSubmitting || ((actionType === 'suspend' || actionType === 'ban') && !reason.trim())}
              className={
                actionType === 'reactivate'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : actionType === 'suspend'
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-destructive hover:bg-destructive/90'
              }
            >
              {isSubmitting
                ? 'Processing...'
                : actionType === 'suspend'
                ? 'Suspend'
                : actionType === 'ban'
                ? 'Ban'
                : 'Reactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}