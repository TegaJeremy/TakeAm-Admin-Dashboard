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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Check, X, ShieldOff, Ban, RotateCcw } from 'lucide-react';
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
  agentId: string;
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | 'ban' | 'reactivate' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token && params.id) fetchAgent();
  }, [token, params.id]);

  const fetchAgent = async () => {
    try {
      const response: any = await adminApi.getAgentById(params.id as string, token!);
      setAgent(response);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load agent details');
      router.push('/dashboard/agents');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (action: typeof actionType) => {
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
    if (!agent || !token || !actionType) return;
    if (['reject', 'suspend', 'ban'].includes(actionType) && !reason.trim()) return;

    setIsSubmitting(true);
    try {
      switch (actionType) {
        case 'approve':
          await adminApi.approveAgent(agent.agentId, token, reason || 'Approved by admin');
          toast.success('Agent approved successfully');
          break;
        case 'reject':
          await adminApi.rejectAgent(agent.agentId, token, reason);
          toast.success('Agent rejected');
          break;
        case 'suspend':
          await adminApi.suspendUser(agent.user.id, token, reason);
          toast.success('Agent suspended');
          break;
        case 'ban':
          await adminApi.banUser(agent.user.id, token, reason);
          toast.success('Agent banned');
          break;
        case 'reactivate':
          await adminApi.reactivateUser(agent.user.id, token, reason || 'Reactivated by admin');
          toast.success('Agent reactivated');
          break;
      }
      await fetchAgent();
      closeDialog();
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'PENDING':  return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:         return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!agent) return null;

  const isPending = agent.approvalStatus === 'PENDING';
  const isActive = agent.user.status === 'ACTIVE';

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
          {isPending && (
            <>
              <Button onClick={() => openDialog('approve')} className="bg-emerald-500 hover:bg-emerald-600">
                <Check className="w-4 h-4 mr-2" /> Approve
              </Button>
              <Button variant="outline" onClick={() => openDialog('reject')} className="text-destructive border-destructive/20 hover:bg-destructive/10">
                <X className="w-4 h-4 mr-2" /> Reject
              </Button>
            </>
          )}
          {isActive && (
            <>
              <Button variant="outline" onClick={() => openDialog('suspend')} className="text-orange-500 border-orange-500/20 hover:bg-orange-500/10">
                <ShieldOff className="w-4 h-4 mr-2" /> Suspend
              </Button>
              <Button variant="outline" onClick={() => openDialog('ban')} className="text-destructive border-destructive/20 hover:bg-destructive/10">
                <Ban className="w-4 h-4 mr-2" /> Ban
              </Button>
            </>
          )}
          {agent.user.status === 'SUSPENDED' && (
            <>
              <Button variant="outline" onClick={() => openDialog('ban')} className="text-destructive border-destructive/20 hover:bg-destructive/10">
                <Ban className="w-4 h-4 mr-2" /> Ban
              </Button>
              <Button variant="outline" onClick={() => openDialog('reactivate')} className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10">
                <RotateCcw className="w-4 h-4 mr-2" /> Reactivate
              </Button>
            </>
          )}
          {agent.user.status === 'BANNED' && (
            <Button variant="outline" onClick={() => openDialog('reactivate')} className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10">
              <RotateCcw className="w-4 h-4 mr-2" /> Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          <Badge className={getStatusColor(agent.approvalStatus)}>{agent.approvalStatus}</Badge>
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
        <div>
          <label className="text-sm text-muted-foreground">Traders Registered</label>
          <p className="text-2xl font-bold text-foreground">{agent.tradersRegistered}</p>
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
                    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
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

      {/* Activity */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Registered</label>
            <p className="text-foreground font-medium">
              {new Date(agent.user.createdAt).toLocaleString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Last Login</label>
            <p className="text-foreground font-medium">
              {agent.user.lastLogin
                ? new Date(agent.user.lastLogin).toLocaleString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })
                : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={(open) => { if (!open && !isSubmitting) closeDialog(); }}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {actionType === 'approve' && 'Approve Agent'}
              {actionType === 'reject' && 'Reject Agent'}
              {actionType === 'suspend' && 'Suspend Agent'}
              {actionType === 'ban' && 'Ban Agent'}
              {actionType === 'reactivate' && 'Reactivate Agent'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  {actionType === 'approve' && `Approve ${agent.user.fullName} as a field agent?`}
                  {actionType === 'reject' && `Reject ${agent.user.fullName}'s application?`}
                  {actionType === 'suspend' && `Temporarily suspend ${agent.user.fullName}?`}
                  {actionType === 'ban' && `Permanently ban ${agent.user.fullName}?`}
                  {actionType === 'reactivate' && `Restore access for ${agent.user.fullName}?`}
                </p>
                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-1">
                  <p className="font-medium text-foreground">{agent.user.fullName}</p>
                  <p className="text-sm text-muted-foreground">Phone: {agent.user.phoneNumber}</p>
                  <p className="text-sm text-muted-foreground">Email: {agent.user.email}</p>
                  <p className="text-sm text-muted-foreground">Market: {agent.assignedMarketId}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Reason
                    {['reject', 'suspend', 'ban'].includes(actionType || '') && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={actionType === 'approve' ? 'Optional note...' : 'Reason required...'}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    rows={3}
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleAction}
              disabled={isSubmitting || (['reject', 'suspend', 'ban'].includes(actionType || '') && !reason.trim())}
              className={
                actionType === 'approve' || actionType === 'reactivate'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-destructive hover:bg-destructive/90'
              }
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Processing...
                </span>
              ) : (
                actionType === 'approve' ? 'Approve' :
                actionType === 'reject' ? 'Reject' :
                actionType === 'suspend' ? 'Suspend' :
                actionType === 'ban' ? 'Ban' : 'Reactivate'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}