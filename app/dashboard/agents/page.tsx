'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ShieldOff,
  Ban,
  RotateCcw,
  Users,
} from 'lucide-react';
import Link from 'next/link';

type ApprovalFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface Agent {
  id: string;       // User UUID
  email: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

interface ActionDialog {
  open: boolean;
  type: 'suspend' | 'ban' | 'reactivate' | 'approve' | 'reject' | null;
  agentId: string;  // Agent entity UUID → for approve/reject
  userId: string;   // User UUID → for suspend/ban/reactivate
  agentName: string;
  reason: string;
}

export default function AgentsPage() {
  const { token } = useAuth();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 20;

  // Map: user.id → AgentDetailDto (contains agentId and approvalStatus)
  const [agentDetailMap, setAgentDetailMap] = useState<Record<string, any>>({});

  const [dialog, setDialog] = useState<ActionDialog>({
    open: false,
    type: null,
    agentId: '',
    userId: '',
    agentName: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAgents();
      fetchAllAgentDetails();
    }
  }, [token, page]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response: any = await adminApi.getAllAgents(token!, { page, size: PAGE_SIZE });
      setAgents(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  // Fetches from /agents/pending — gives us agentId (Agent entity UUID) keyed by user.id
  const fetchAllAgentDetails = async () => {
    try {
      const response: any = await adminApi.getAgents(token!, { page: 0, size: 100 });
      const map: Record<string, any> = {};
      (response.content || []).forEach((a: any) => {
        if (a.user?.id) {
          map[a.user.id] = a; // a.agentId = Agent entity UUID, a.approvalStatus
        }
      });
      setAgentDetailMap(map);
    } catch {
      // non-critical — status will fall back to user.status
    }
  };

  // Agent entity UUID (for approve/reject/view detail)
  const getAgentEntityId = (userId: string): string =>
    agentDetailMap[userId]?.agentId || userId;

  // Approval status — prefer from agent entity, fall back to user status
  const getApprovalStatus = (agent: Agent): string => {
    const detail = agentDetailMap[agent.id];
    if (detail?.approvalStatus) return detail.approvalStatus;
    if (agent.status === 'ACTIVE') return 'APPROVED';
    if (agent.status === 'PENDING') return 'PENDING';
    if (agent.status === 'SUSPENDED') return 'SUSPENDED';
    if (agent.status === 'BANNED') return 'BANNED';
    return agent.status;
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      !search ||
      agent.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      agent.email?.toLowerCase().includes(search.toLowerCase()) ||
      agent.phoneNumber?.includes(search);

    const status = getApprovalStatus(agent);
    const matchesFilter =
      approvalFilter === 'ALL' ||
      (approvalFilter === 'PENDING' && status === 'PENDING') ||
      (approvalFilter === 'APPROVED' && status === 'APPROVED') ||
      (approvalFilter === 'REJECTED' && ['SUSPENDED', 'BANNED', 'REJECTED'].includes(status));

    return matchesSearch && matchesFilter;
  });

  const openDialog = (type: ActionDialog['type'], agent: Agent) => {
    setDialog({
      open: true,
      type,
      agentId: getAgentEntityId(agent.id), // Agent entity UUID
      userId: agent.id,                      // User UUID
      agentName: agent.fullName,
      reason: '',
    });
  };

  const closeDialog = () => {
    setDialog({ open: false, type: null, agentId: '', userId: '', agentName: '', reason: '' });
  };

  const handleAction = async () => {
    if (!token || !dialog.type) return;
    if (['suspend', 'ban', 'reject'].includes(dialog.type) && !dialog.reason.trim()) return;

    setIsSubmitting(true);
    try {
      switch (dialog.type) {
        case 'approve':
          await adminApi.approveAgent(dialog.agentId, token, dialog.reason || 'Approved by admin');
          toast.success('Agent approved successfully');
          break;
        case 'reject':
          await adminApi.rejectAgent(dialog.agentId, token, dialog.reason);
          toast.success('Agent rejected');
          break;
        case 'suspend':
          await adminApi.suspendUser(dialog.userId, token, dialog.reason);
          toast.success('Agent suspended');
          break;
        case 'ban':
          await adminApi.banUser(dialog.userId, token, dialog.reason);
          toast.success('Agent banned');
          break;
        case 'reactivate':
          await adminApi.reactivateUser(dialog.userId, token, dialog.reason || 'Reactivated by admin');
          toast.success('Agent reactivated');
          break;
      }
      await fetchAgents();
      await fetchAllAgentDetails();
      closeDialog();
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (agent: Agent) => {
    const status = getApprovalStatus(agent);
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Suspended</Badge>;
      case 'BANNED':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Banned</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">{status}</Badge>;
    }
  };

  const filterCounts = {
    ALL: agents.length,
    PENDING: agents.filter((a) => getApprovalStatus(a) === 'PENDING').length,
    APPROVED: agents.filter((a) => getApprovalStatus(a) === 'APPROVED').length,
    REJECTED: agents.filter((a) => ['SUSPENDED', 'BANNED', 'REJECTED'].includes(getApprovalStatus(a))).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agents</h1>
          <p className="text-muted-foreground mt-1">{totalElements} total agents</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as ApprovalFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setApprovalFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              approvalFilter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f === 'ALL' ? 'All' : f === 'REJECTED' ? 'Suspended/Banned' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className="ml-2 opacity-70">({filterCounts[f]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            Loading agents...
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Users className="w-8 h-8 opacity-40" />
            <p>No agents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Registered</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAgents.map((agent) => {
                  const status = getApprovalStatus(agent);
                  const isPending = status === 'PENDING';
                  const isActive = status === 'APPROVED';
                  const isSuspendedOrBanned = ['SUSPENDED', 'BANNED'].includes(status);
                  const agentEntityId = getAgentEntityId(agent.id);

                  return (
                    <tr key={agent.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{agent.fullName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{agent.email || '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{agent.phoneNumber || '—'}</td>
                      <td className="px-4 py-3">{getStatusBadge(agent)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(agent.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {/* View — uses Agent entity UUID */}
                          <Link href={`/dashboard/agents/${agentEntityId}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="View details">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>

                          {isPending && (
                            <>
                              <Button
                                variant="ghost" size="icon"
                                className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10"
                                title="Approve"
                                onClick={() => openDialog('approve', agent)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost" size="icon"
                                className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                                title="Reject"
                                onClick={() => openDialog('reject', agent)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          {isActive && (
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-orange-500 hover:bg-orange-500/10"
                              title="Suspend"
                              onClick={() => openDialog('suspend', agent)}
                            >
                              <ShieldOff className="w-4 h-4" />
                            </Button>
                          )}

                          {(isActive || status === 'SUSPENDED') && (
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-red-600 hover:bg-red-500/10"
                              title="Ban"
                              onClick={() => openDialog('ban', agent)}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}

                          {isSuspendedOrBanned && (
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                              title="Reactivate"
                              onClick={() => openDialog('reactivate', agent)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <AlertDialog open={dialog.open} onOpenChange={(open) => !open && closeDialog()}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {dialog.type === 'approve' && 'Approve Agent'}
              {dialog.type === 'reject' && 'Reject Agent'}
              {dialog.type === 'suspend' && 'Suspend Agent'}
              {dialog.type === 'ban' && 'Ban Agent'}
              {dialog.type === 'reactivate' && 'Reactivate Agent'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  {dialog.type === 'approve' && `Approve ${dialog.agentName} as a field agent?`}
                  {dialog.type === 'reject' && `Reject ${dialog.agentName}'s application?`}
                  {dialog.type === 'suspend' && `Temporarily suspend ${dialog.agentName}?`}
                  {dialog.type === 'ban' && `Permanently ban ${dialog.agentName}?`}
                  {dialog.type === 'reactivate' && `Restore access for ${dialog.agentName}?`}
                </p>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Reason
                    {['reject', 'suspend', 'ban'].includes(dialog.type || '') && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>
                  <textarea
                    value={dialog.reason}
                    onChange={(e) => setDialog((d) => ({ ...d, reason: e.target.value }))}
                    placeholder={dialog.type === 'approve' ? 'Optional note...' : 'Reason required...'}
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
    disabled={isSubmitting || (['reject', 'suspend', 'ban'].includes(dialog.type || '') && !dialog.reason.trim())}
    className={
      dialog.type === 'approve' || dialog.type === 'reactivate'
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
      dialog.type === 'approve' ? 'Approve' :
      dialog.type === 'reject' ? 'Reject' :
      dialog.type === 'suspend' ? 'Suspend' :
      dialog.type === 'ban' ? 'Ban' : 'Reactivate'
    )}
  </Button>
</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}