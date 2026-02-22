'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { AdminStats } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/stats-card';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, ShoppingCart, CreditCard, ClipboardList, Zap } from 'lucide-react';

// Mock data for charts - in production, this would come from the API
const requestsTrendData = [
  { date: 'Mon', requests: 45 },
  { date: 'Tue', requests: 52 },
  { date: 'Wed', requests: 48 },
  { date: 'Thu', requests: 61 },
  { date: 'Fri', requests: 55 },
  { date: 'Sat', requests: 67 },
  { date: 'Sun', requests: 70 },
];

const agentsStatusData = [
  { name: 'Pending', value: 12, fill: '#f59e0b' },
  { name: 'Approved', value: 38, fill: '#10b981' },
  { name: 'Rejected', value: 5, fill: '#ef4444' },
];

const tradersStatusData = [
  { name: 'Active', value: 156 },
  { name: 'Suspended', value: 24 },
  { name: 'Banned', value: 8 },
];

const paymentsData = [
  { date: 'Week 1', pending: 1200000, paid: 3400000 },
  { date: 'Week 2', pending: 1800000, paid: 2400000 },
  { date: 'Week 3', pending: 950000, paid: 4200000 },
  { date: 'Week 4', pending: 1200000, paid: 3800000 },
];

export default function DashboardPage() {
  const { token, isLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!token || isLoading) return;

  const fetchStats = async () => {
  try {
    const data: any = await adminApi.getStats(token!);
    console.log('[Dashboard] Stats:', data);
    setStats(data);
  } catch (error: any) {
    console.error('[Dashboard] Error fetching stats:', error);
    // Don't crash - just use default zero stats
    setStats({
      totalRequests: 0,
      pendingRequests: 0,
      activeRequests: 0,
      completedRequests: 0,
      totalPendingPayments: 0,
      totalPendingAmount: 0
    });
  } finally {
    setStatsLoading(false);
  }
};

    fetchStats();
  }, [token, isLoading]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to Take-am admin dashboard</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          label="Total Requests"
          value={stats?.totalRequests || 0}
          change={12}
          trend="up"
          icon={<ClipboardList className="w-8 h-8 text-accent" />}
        />
        <StatsCard
          label="Pending Requests"
          value={stats?.pendingRequests || 0}
          change={8}
          trend="up"
          icon={<TrendingUp className="w-8 h-8 text-blue-500" />}
        />
        <StatsCard
          label="Active Requests"
          value={stats?.activeRequests || 0}
          change={3}
          trend="down"
          icon={<Zap className="w-8 h-8 text-amber-500" />}
        />
        <StatsCard
          label="Completed Requests"
          value={stats?.completedRequests || 0}
          change={15}
          trend="up"
          icon={<ShoppingCart className="w-8 h-8 text-emerald-500" />}
        />
        <StatsCard
          label="Pending Payments"
          value={stats?.pendingPaymentsCount || 0}
          change={5}
          trend="neutral"
          icon={<CreditCard className="w-8 h-8 text-purple-500" />}
        />
        <StatsCard
          label="Pending Amount"
          value={`₦${(stats?.pendingPaymentsAmount || 0).toLocaleString()}`}
          change={22}
          trend="up"
          icon={<Users className="w-8 h-8 text-pink-500" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Trend */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Requests Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={requestsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141829', border: '1px solid #2d3748', borderRadius: 8 }}
                labelStyle={{ color: '#e8eaf6' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agents Status */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Agents Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentsStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141829', border: '1px solid #2d3748', borderRadius: 8 }}
                labelStyle={{ color: '#e8eaf6' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {agentsStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traders Status */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Traders Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tradersStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#141829', border: '1px solid #2d3748', borderRadius: 8 }}
                labelStyle={{ color: '#e8eaf6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payments Trend */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Payment Status Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={paymentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141829', border: '1px solid #2d3748', borderRadius: 8 }}
                labelStyle={{ color: '#e8eaf6' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="paid"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Width Revenue Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={paymentsData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis stroke="#94a3b8" style={{ fontSize: 12 }} dataKey="date" />
            <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#141829', border: '1px solid #2d3748', borderRadius: 8 }}
              labelStyle={{ color: '#e8eaf6' }}
              formatter={(value: number) => `₦${(value / 1000000).toFixed(1)}M`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="paid"
              stroke="#10b981"
              fill="url(#colorRevenue)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
