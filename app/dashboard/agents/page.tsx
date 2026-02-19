'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { Agent } from '@/lib/types';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Check, X } from 'lucide-react';

export default function AgentsPage() {
  const { token, isLoading } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token || isLoading) return;

    const fetchAgents = async () => {
      try {
        const response = await adminApi.getAgents(token) as any;
        
        // Handle different response formats
        const agentsData = response?.data || response || [];
        console.log('[Agents] Fetched:', agentsData);
        
        setAgents(Array.isArray(agentsData) ? agentsData : []);
      } catch (error: any) {
        console.error('[Agents] Error fetching agents:', error);
        toast.error(error.message || 'Failed to load agents');
      } finally {
        setAgentsLoading(false);
      }
    };

    fetchAgents();
  }, [token, isLoading]);

  const handleApprove = async () => {
    if (!selectedAgent || !token) return;
    
    setIsSubmitting(true);
    try {
      await adminApi.approveAgent(selectedAgent.id, token, reason || 'Approved by admin');
      
      // Remove from list or refetch
      setAgents(agents.filter(a => a.id !== selectedAgent.id));
      
      toast.success('Agent approved successfully');
      setActionType(null);
      setReason('');
      setSelectedAgent(null);
    } catch (error: any) {
      console.error('[Agents] Error approving agent:', error);
      toast.error(error?.message || 'Failed to approve agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAgent || !token || !reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await adminApi.rejectAgent(selectedAgent.id, token, reason);
      
      // Remove from list or update status
      setAgents(agents.map(a => 
        a.id === selectedAgent.id 
          ? { ...a, status: 'REJECTED', rejectionReason: reason }
          : a
      ));
      
      toast.success('Agent rejected successfully');
      setActionType(null);
      setReason('');
      setSelectedAgent(null);
    } catch (error: any) {
      console.error('[Agents] Error rejecting agent:', error);
      toast.error(error?.message || 'Failed to reject agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    if (!agent) return false;
    
    const matchesSearch = !searchQuery ||
      agent.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.phoneNumber?.includes(searchQuery);
    
    return matchesSearch;
  });

  if (agentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agents</h1>
        <p className="text-muted-foreground mt-2">Manage and approve logistics agents</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          placeholder="Search agents by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Agents Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Email</TableHead>
              <TableHead className="text-foreground">Phone</TableHead>
              <TableHead className="text-foreground">Market</TableHead>
              <TableHead className="text-foreground">Identity</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {agents.length === 0 ? 'No pending agents' : 'No agents match your search'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => (
                <TableRow key={agent.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {agent.fullName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent.email || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent.phoneNumber || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent.assignedMarketId || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div>
                      <span className="font-medium">{agent.identityType}</span>
                      <p className="text-xs opacity-75">{agent.identityNumber || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : agent.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {agent.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/agents/${agent.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                      {agent.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
                            onClick={() => {
                              setSelectedAgent(agent);
                              setActionType('approve');
                            }}
                          >
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => {
                              setSelectedAgent(agent);
                              setActionType('reject');
                            }}
                          >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Action Dialogs */}
      {selectedAgent && (
        <AlertDialog open={!!actionType} onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setReason('');
            setSelectedAgent(null);
          }
        }}>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogTitle className="text-foreground">
              {actionType === 'approve' ? 'Approve Agent' : 'Reject Agent'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              <div className="space-y-3 mt-4">
                <p>
                  {actionType === 'approve'
                    ? `You are about to approve ${selectedAgent.fullName} as a logistics agent.`
                    : `You are about to reject ${selectedAgent.fullName}'s application.`}
                </p>
                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-2 text-sm">
                  <p><strong>Email:</strong> {selectedAgent.email}</p>
                  <p><strong>Phone:</strong> {selectedAgent.phoneNumber}</p>
                  <p><strong>Market:</strong> {selectedAgent.assignedMarketId}</p>
                  <p><strong>Identity:</strong> {selectedAgent.identityType} - {selectedAgent.identityNumber}</p>
                </div>
              </div>
            </AlertDialogDescription>
            
            {actionType === 'reject' && (
              <div className="space-y-2 py-4">
                <label className="text-sm font-medium text-foreground">Reason (required)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you rejecting this agent?"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-3">
              <AlertDialogCancel className="border-border text-foreground">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={actionType === 'approve' ? handleApprove : handleReject}
                disabled={isSubmitting || (actionType === 'reject' && !reason.trim())}
                className={actionType === 'approve' 
                  ? 'bg-emerald-500 hover:bg-emerald-600' 
                  : 'bg-destructive hover:bg-destructive/90'
                }
              >
                {isSubmitting ? 'Processing...' : (actionType === 'approve' ? 'Approve' : 'Reject')}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}