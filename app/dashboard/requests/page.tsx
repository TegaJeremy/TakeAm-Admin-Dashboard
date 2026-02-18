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
        let data;
        if (statusFilter === 'PENDING') {
          data = await adminApi.getPendingRequests(token);
        } else if (statusFilter === 'ACTIVE') {
          data = await adminApi.getActiveRequests(token);
        } else if (statusFilter === 'COMPLETED') {
          data = await adminApi.getCompletedRequests(token);
        } else {
          data = await adminApi.getAllRequests(token);
        }
        setRequests(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching requests:', error);
        toast.error('Failed to load requests');
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequests();
  }, [token, isLoading, statusFilter]);

  const filteredRequests = requests.filter(request =>
    request.traderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.traderPhone.includes(searchQuery) ||
    request.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          placeholder="Search requests by ID, trader name, or phone..."
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
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
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
              <TableHead className="text-foreground">Weight (kg)</TableHead>
              <TableHead className="text-foreground">Agent</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Created</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className="border-border">
                  <TableCell className="font-mono text-sm text-foreground">{request.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium text-foreground">{request.traderName}</TableCell>
                  <TableCell className="text-muted-foreground">{request.traderPhone}</TableCell>
                  <TableCell className="text-foreground">{request.foodWeight.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {request.agentName || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : request.status === 'ACTIVE'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
