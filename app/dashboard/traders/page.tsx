'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Shield, Ban, CheckCircle2, Search } from 'lucide-react';

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

export default function TradersPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [traders, setTraders] = useState<Trader[]>([]);
  const [filteredTraders, setFilteredTraders] = useState<Trader[]>([]);
  const [tradersLoading, setTradersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'reactivate' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTraders();
    }
  }, [token]);

  useEffect(() => {
    filterTraders();
  }, [searchQuery, statusFilter, traders]);

  const fetchTraders = async () => {
    try {
      const params: Record<string, string> = { role: 'TRADER' };
      
      const response: any = await adminApi.getUsers(token!, params);
      
      console.log('[Traders] Raw response:', response);
      
      // Handle paginated response
      let tradersData = response?.content || response?.data || response || [];
      
      console.log('[Traders] Traders data:', tradersData);
      
      setTraders(Array.isArray(tradersData) ? tradersData : []);
    } catch (error: any) {
      console.error('[Traders] Error fetching traders:', error);
      toast.error(error.message || 'Failed to load traders');
    } finally {
      setTradersLoading(false);
    }
  };

  const filterTraders = () => {
    let filtered = [...traders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (trader) =>
          trader.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trader.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trader.phoneNumber?.includes(searchQuery)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((trader) => trader.status === statusFilter);
    }

    setFilteredTraders(filtered);
  };

  const openDialog = (trader: Trader, action: 'suspend' | 'ban' | 'reactivate') => {
    setSelectedTrader(trader);
    setActionType(action);
    setReason('');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedTrader(null);
    setActionType(null);
    setReason('');
  };

  const handleAction = async () => {
    if (!selectedTrader || !token) return;
    
    if ((actionType === 'suspend' || actionType === 'ban') && !reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setIsSubmitting(true);
    try {
      if (actionType === 'suspend') {
        await adminApi.suspendUser(selectedTrader.id, token, reason);
        toast.success('Trader suspended successfully');
      } else if (actionType === 'ban') {
        await adminApi.banUser(selectedTrader.id, token, reason);
        toast.success('Trader banned successfully');
      } else if (actionType === 'reactivate') {
        await adminApi.reactivateUser(selectedTrader.id, token, reason || 'Reactivated by admin');
        toast.success('Trader reactivated successfully');
      }

      // Refresh traders list
      await fetchTraders();
      closeDialog();
    } catch (error: any) {
      console.error(`[Traders] Error ${actionType}ing:`, error);
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

  if (tradersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading traders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Traders</h1>
        <p className="text-muted-foreground mt-1">Manage registered food traders</p>
      </div>

      {/* Summary Cards */}
      {traders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Total Traders</p>
            <p className="text-2xl font-bold text-foreground">{traders.length}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-emerald-500">
              {traders.filter((t) => t.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Suspended</p>
            <p className="text-2xl font-bold text-amber-500">
              {traders.filter((t) => t.status === 'SUSPENDED').length}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Banned</p>
            <p className="text-2xl font-bold text-destructive">
              {traders.filter((t) => t.status === 'BANNED').length}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search traders by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-input border-border text-foreground">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Traders Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Contact</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Registered</TableHead>
              <TableHead className="text-muted-foreground">Last Login</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTraders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {traders.length === 0 ? 'No traders found' : 'No traders match your filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTraders.map((trader) => (
                <TableRow key={trader.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {trader.fullName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {trader.phoneNumber && (
                        <p className="text-sm text-foreground">{trader.phoneNumber}</p>
                      )}
                      {trader.email && (
                        <p className="text-xs text-muted-foreground">{trader.email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(trader.status)}>
                      {trader.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {trader.createdAt
                      ? new Date(trader.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {trader.lastLogin
                      ? new Date(trader.lastLogin).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/traders/${trader.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {trader.status === 'ACTIVE' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDialog(trader, 'suspend')}
                          >
                            <Shield className="w-4 h-4 text-amber-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDialog(trader, 'ban')}
                          >
                            <Ban className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      {(trader.status === 'SUSPENDED' || trader.status === 'BANNED') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(trader, 'reactivate')}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
                  {actionType === 'suspend' && `Suspend ${selectedTrader?.fullName}? They will be unable to log in until reactivated.`}
                  {actionType === 'ban' && `Permanently ban ${selectedTrader?.fullName}? This is a severe action.`}
                  {actionType === 'reactivate' && `Reactivate ${selectedTrader?.fullName}'s account? They will be able to log in again.`}
                </p>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-2">
                  <p className="font-medium text-foreground">{selectedTrader?.fullName}</p>
                  <p className="text-sm text-muted-foreground">Phone: {selectedTrader?.phoneNumber || 'N/A'}</p>
                  {selectedTrader?.email && (
                    <p className="text-sm text-muted-foreground">Email: {selectedTrader.email}</p>
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