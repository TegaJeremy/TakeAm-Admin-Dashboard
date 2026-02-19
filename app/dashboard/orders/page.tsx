'use client';

import { useEffect, useState } from 'react';
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

interface Product {
  id: string;
  productName: string;
  grade: string;
  availableWeight: number;
  pricePerKg: number;
  description?: string;
  location?: string;
  status: string;
  traderId?: string;
  gradingId?: string;
  images?: Array<{
    id: string;
    imageUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

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
    const response = await adminApi.getProducts(token) as any;
    
    // Handle different response formats
    let productsData: Product[] = [];
    if (response?.data) {
      productsData = Array.isArray(response.data) ? response.data : [];
    } else if (Array.isArray(response)) {
      productsData = response;
    }
    
    console.log('[Products] Fetched:', productsData);
    setProducts(productsData);
  } catch (error: any) {
    console.error('[Products] Error fetching products:', error);
    toast.error(error.message || 'Failed to load products');
  } finally {
    setProductsLoading(false);
  }
};

    fetchProducts();
  }, [token, isLoading]);

  const handleDelete = async (productId: string) => {
    if (!token) return;
    
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminApi.deleteProduct(productId, token);
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p.id !== productId));
    } catch (error: any) {
      console.error('[Products] Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    // Search filter - with null checks
    const matchesSearch = !searchQuery || 
      product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
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
          placeholder="Search products by name, location, or description..."
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
            <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            <SelectItem value="RESERVED">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Product</TableHead>
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
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {products.length === 0 ? 'No products yet' : 'No products match your filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {product.productName || 'Unnamed Product'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.grade === 'A' ? 'bg-emerald-500/10 text-emerald-500' :
                      product.grade === 'B' ? 'bg-blue-500/10 text-blue-500' :
                      product.grade === 'C' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      Grade {product.grade}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {product.availableWeight?.toLocaleString() || '0'} kg
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ₦{product.pricePerKg?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {product.location || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : product.status === 'LOW_STOCK'
                        ? 'bg-amber-500/10 text-amber-500'
                        : product.status === 'OUT_OF_STOCK'
                        ? 'bg-blue-500/10 text-blue-500'
                        : product.status === 'RESERVED'
                        ? 'bg-purple-500/10 text-purple-500'
                        : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {product.status || 'UNKNOWN'}
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
                        onClick={() => handleDelete(product.id)}
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