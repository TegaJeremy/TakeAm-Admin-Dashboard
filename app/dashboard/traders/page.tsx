'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { Trader } from '@/lib/types';
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
import { Eye, Shield, Ban } from 'lucide-react';

export default function TradersPage() {
  const { token, isLoading } = useAuth();
  const [traders, setTraders] = useState<Trader[]>([]);
  const [tradersLoading, setTradersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!token || isLoading) return;

    const fetchTraders = async () => {
      try {
        const params: Record<string, string> = { role: 'TRADER' };
        if (statusFilter) params.status = statusFilter;
        
        const data = await adminApi.getUsers(token, params);
        setTraders(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching traders:', error);
        toast.error('Failed to load traders');
      } finally {
        setTradersLoading(false);
      }
    };

    fetchTraders();
  }, [token, isLoading, statusFilter]);

  const filteredTraders = traders.filter(trader =>
    trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.phone.includes(searchQuery)
  );

  if (tradersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading traders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Traders</h1>
        <p className="text-muted-foreground mt-2">Manage registered food traders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search traders by name, email, or phone..."
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
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Traders Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Email</TableHead>
              <TableHead className="text-foreground">Phone</TableHead>
              <TableHead className="text-foreground">Business</TableHead>
              <TableHead className="text-foreground">Agent</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Registered</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTraders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No traders found
                </TableCell>
              </TableRow>
            ) : (
              filteredTraders.map((trader) => (
                <TableRow key={trader.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{trader.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{trader.email}</TableCell>
                  <TableCell className="text-muted-foreground">{trader.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{trader.businessName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {trader.agentName || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trader.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : trader.status === 'SUSPENDED'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {trader.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(trader.registrationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      {trader.status === 'ACTIVE' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
                          >
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">Suspend</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                          >
                            <Ban className="w-4 h-4" />
                            <span className="hidden sm:inline">Ban</span>
                          </Button>
                        </>
                      )}
                      {trader.status === 'SUSPENDED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
                        >
                          <Shield className="w-4 h-4" />
                          <span className="hidden sm:inline">Reactivate</span>
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
    </div>
  );
}
