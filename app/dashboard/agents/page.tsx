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
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';

interface Agent {
  user: {
    id: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin?: string;
  };
  assignedMarketId: string;
  identityType: string;
  identityDocument: string;
  approvalStatus: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedByAdminEmail?: string;
  tradersRegistered: number;
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token && params.id) {
      fetchAgent();
    }
  }, [token, params.id]);

  const fetchAgent = async () => {
    try {
      console.log('[AgentDetail] Fetching agent:', params.id);
      const response: any = await adminApi.getAgentById(params.id as string, token!);
      
      console.log('[AgentDetail] Response:', response);
      
      setAgent(response);
    } catch (error: any) {
      console.error('[AgentDetail] Error:', error);
      toast.error(error.message || 'Failed to load agent details');
      router.push('/dashboard/agents');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (action: 'approve' | 'reject') => {
    setActionType(action);
    setReason('');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActionType(null);
    setReason('');
  };

  const handleApprove = async () => {
    if (!agent || !token) return;
    
    setIsSubmitting(true);
    try {
      await adminApi.approveAgent(agent.user.id, token, reason || 'Approved by admin');
      
      toast.success('Agent approved successfully');
      
      // Refresh agent data
      await fetchAgent();
      closeDialog();
    } catch (error: any) {
      console.error('[AgentDetail] Error approving:', error);
      toast.error(error.message || 'Failed to approve agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!agent || !token || !reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await adminApi.rejectAgent(agent.user.id, token, reason);
      
      toast.success('Agent rejected successfully');
      
      // Refresh agent data
      await fetchAgent();
      closeDialog();
    } catch (error: any) {
      console.error('[AgentDetail] Error rejecting:', error);
      toast.error(error.message || 'Failed to reject agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'REJECTED':
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

  if (!agent) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/agents">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{agent.user.fullName}</h1>
            <p className="text-muted-foreground mt-1">Agent Details</p>
          </div>
        </div>

        <div className="flex gap-2">
          {agent.approvalStatus === 'PENDING' && (
            <>
              <Button
                onClick={() => openDialog('approve')}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => openDialog('reject')}
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          <Badge className={getStatusColor(agent.approvalStatus)}>
            {agent.approvalStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Full Name</label>
            <p className="text-foreground font-medium">{agent.user.fullName}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="text-foreground font-medium">{agent.user.email}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Phone Number</label>
            <p className="text-foreground font-medium">{agent.user.phoneNumber}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Assigned Market</label>
            <p className="text-foreground font-medium">{agent.assignedMarketId}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Account Status</label>
            <p className="text-foreground font-medium">{agent.user.status}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Role</label>
            <p className="text-foreground font-medium">{agent.user.role}</p>
          </div>
        </div>
      </div>

      {/* Identity Verification */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Identity Verification</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Identity Type</label>
            <p className="text-foreground font-medium">{agent.identityType}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Identity Document</label>
            <p className="text-foreground font-mono text-sm">{agent.identityDocument}</p>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Traders Registered</label>
            <p className="text-2xl font-bold text-foreground">{agent.tradersRegistered}</p>
          </div>
        </div>
      </div>

      {/* Approval Information */}
      {agent.approvalStatus !== 'PENDING' && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Approval Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agent.approvedAt && (
              <div>
                <label className="text-sm text-muted-foreground">
                  {agent.approvalStatus === 'APPROVED' ? 'Approved At' : 'Rejected At'}
                </label>
                <p className="text-foreground font-medium">
                  {new Date(agent.approvedAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            {agent.approvedByAdminEmail && (
              <div>
                <label className="text-sm text-muted-foreground">
                  {agent.approvalStatus === 'APPROVED' ? 'Approved By' : 'Rejected By'}
                </label>
                <p className="text-foreground font-medium">{agent.approvedByAdminEmail}</p>
              </div>
            )}

            {agent.rejectionReason && (
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Rejection Reason</label>
                <p className="text-foreground">{agent.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Activity</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Registered</label>
            <p className="text-foreground font-medium">
              {new Date(agent.user.createdAt).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Last Login</label>
            <p className="text-foreground font-medium">
              {agent.user.lastLogin
                ? new Date(agent.user.lastLogin).toLocaleString('en-US', {
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
              {actionType === 'approve' ? 'Approve Agent' : 'Reject Agent'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground" asChild>
              <div className="space-y-3">
                <p>
                  {actionType === 'approve'
                    ? `Approve ${agent.user.fullName} as a field agent? They will be able to register traders and grade produce.`
                    : `Reject ${agent.user.fullName}'s agent application?`}
                </p>

                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-2">
                  <p className="font-medium text-foreground">{agent.user.fullName}</p>
                  <p className="text-sm text-muted-foreground">Phone: {agent.user.phoneNumber}</p>
                  <p className="text-sm text-muted-foreground">Email: {agent.user.email}</p>
                  <p className="text-sm text-muted-foreground">Market: {agent.assignedMarketId}</p>
                </div>

                {actionType === 'reject' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Reason <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Why are you rejecting this agent?"
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Approval Note (optional)</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Add an optional note..."
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={2}
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
              onClick={actionType === 'approve' ? handleApprove : handleReject}
              disabled={isSubmitting || (actionType === 'reject' && !reason.trim())}
              className={
                actionType === 'approve'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-destructive hover:bg-destructive/90'
              }
            >
              {isSubmitting ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}