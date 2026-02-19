'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { Request } from '@/lib/types';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye } from 'lucide-react';
import Link from 'next/link';

export default function RequestsPage() {
  const { token, isLoading } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!token || isLoading) return;

    const fetchRequests = async () => {
      try {
        let response: any;
        
        if (statusFilter === 'PENDING') {
          response = await adminApi.getPendingRequests(token);
        } else if (statusFilter === 'ACCEPTED') {
          response = await adminApi.getActiveRequests(token);
        } else if (statusFilter === 'COMPLETED') {
          response = await adminApi.getCompletedRequests(token);
        } else {
          response = await adminApi.getAllRequests(token);
        }
        
        // Handle different response formats
        const requestsData = response?.data || response || [];
        console.log('[Requests] Fetched:', requestsData);
        
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (error: any) {
        console.error('[Requests] Error fetching requests:', error);
        toast.error(error.message || 'Failed to load requests');
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequests();
  }, [token, isLoading, statusFilter]);

  const filteredRequests = requests.filter(request => {
    if (!request) return false;
    
    const matchesSearch = !searchQuery ||
      request.traderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.traderPhone?.includes(searchQuery) ||
      request.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.productType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trader Requests</h1>
        <p className="text-muted-foreground mt-2">Manage pickup requests from traders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search requests by ID, trader, phone, or product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground md:flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-input border-border text-foreground md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Request ID</TableHead>
              <TableHead className="text-foreground">Trader</TableHead>
              <TableHead className="text-foreground">Phone</TableHead>
              <TableHead className="text-foreground">Product</TableHead>
              <TableHead className="text-foreground">Est. Weight (kg)</TableHead>
              <TableHead className="text-foreground">Agent</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Created</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {requests.length === 0 ? 'No requests yet' : 'No requests match your filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className="border-border">
                  <TableCell className="font-mono text-xs text-foreground">
                    {request.id?.substring(0, 8) || 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {request.traderName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.traderPhone || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.productType || 'N/A'}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {request.estimatedWeight?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div>
                      {request.agentName ? (
                        <>
                          <p className="font-medium">{request.agentName}</p>
                          <p className="text-xs opacity-75">{request.agentPhone}</p>
                        </>
                      ) : (
                        <span className="text-amber-500">Unassigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : request.status === 'ACCEPTED'
                        ? 'bg-blue-500/10 text-blue-500'
                        : request.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {request.createdAt 
                      ? new Date(request.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/requests/${request.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {requests.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold text-foreground">{requests.length}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-500">
              {requests.filter(r => r.status === 'PENDING').length}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <p className="text-2xl font-bold text-blue-500">
              {requests.filter(r => r.status === 'ACCEPTED').length}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-emerald-500">
              {requests.filter(r => r.status === 'COMPLETED').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}