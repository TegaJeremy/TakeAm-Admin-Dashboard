'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { Product } from '@/lib/types';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Plus, Trash2 } from 'lucide-react';

export default function ProductsPage() {
  const { token, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!token || isLoading) return;

    const fetchProducts = async () => {
      try {
        const data = await adminApi.getProducts(token);
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [token, isLoading]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.traderName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-2">Manage available food products</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2 bg-primary hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            New Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products by name or trader..."
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
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Product</TableHead>
              <TableHead className="text-foreground">Trader</TableHead>
              <TableHead className="text-foreground">Grade</TableHead>
              <TableHead className="text-foreground">Weight (kg)</TableHead>
              <TableHead className="text-foreground">Price per kg</TableHead>
              <TableHead className="text-foreground">Location</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.traderName}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-medium">
                      {product.grade}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground">{product.availableWeight.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ₦{product.pricePerKg.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{product.location}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : product.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : product.status === 'OUT_OF_STOCK'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
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
