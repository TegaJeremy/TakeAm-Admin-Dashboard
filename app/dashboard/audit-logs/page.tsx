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
        const data = await adminApi.getAuditLogs(token);
        setLogs(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching audit logs:', error);
        toast.error('Failed to load audit logs');
      } finally {
        setLogsLoading(false);
      }
    };

    fetchLogs();
  }, [token, isLoading]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = !actionFilter || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(logs.map(log => log.action))];

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
          placeholder="Search logs by admin email or action..."
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
              <TableHead className="text-foreground">Reason</TableHead>
              <TableHead className="text-foreground">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-card/50">
                  <TableCell className="font-medium text-foreground text-sm">
                    {log.adminEmail}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-medium">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {log.targetType && log.targetId
                      ? `${log.targetType}#${log.targetId.substring(0, 8)}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                    {log.reason || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(log.createdAt).toLocaleString()}
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
