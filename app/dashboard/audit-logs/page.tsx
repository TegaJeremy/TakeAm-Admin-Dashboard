'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { AuditLog } from '@/lib/types';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AuditLogsPage() {
  const { token, isLoading } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    if (!token || isLoading) return;

    const fetchLogs = async () => {
      try {
        const response = await adminApi.getAuditLogs(token) as any;
        
        // Handle different response formats
        const logsData = response?.data || response || [];
        console.log('[AuditLogs] Fetched:', logsData);
        
        setLogs(Array.isArray(logsData) ? logsData : []);
      } catch (error: any) {
        console.error('[AuditLogs] Error fetching logs:', error);
        toast.error(error.message || 'Failed to load audit logs');
      } finally {
        setLogsLoading(false);
      }
    };

    fetchLogs();
  }, [token, isLoading]);

  const filteredLogs = logs.filter(log => {
    if (!log) return false;
    
    const matchesSearch = !searchQuery ||
      log.adminEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = !actionFilter || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(logs.map(log => log.action).filter(Boolean))];

  if (logsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">Track all administrative actions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search logs by admin email, action, or target..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground md:flex-1"
        />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="bg-input border-border text-foreground md:w-[200px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="">All Actions</SelectItem>
            {uniqueActions.map(action => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Admin</TableHead>
              <TableHead className="text-foreground">Action</TableHead>
              <TableHead className="text-foreground">Target</TableHead>
              <TableHead className="text-foreground">Details</TableHead>
              <TableHead className="text-foreground">IP Address</TableHead>
              <TableHead className="text-foreground">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {logs.length === 0 ? 'No audit logs yet' : 'No logs match your filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-card/50">
                  <TableCell className="font-medium text-foreground text-sm">
                    {log.adminEmail || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-medium">
                      {log.action || 'UNKNOWN'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {log.targetType && log.targetId
                      ? `${log.targetType}#${log.targetId.substring(0, 8)}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs">
                    <div className="truncate" title={log.details || '-'}>
                      {log.details || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {log.ipAddress || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {log.createdAt 
                      ? new Date(log.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination info */}
      {logs.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredLogs.length} of {logs.length} log{logs.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}