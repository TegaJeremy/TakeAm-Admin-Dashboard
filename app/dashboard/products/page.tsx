'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Search, Eye, Trash2 } from 'lucide-react';

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
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, statusFilter, products]);

  const fetchProducts = async () => {
    try {
      const response: any = await adminApi.getProducts(token!);
      
      let productsData = response?.data || response || [];
      
      console.log('[Products] Raw data:', productsData);
      
      // Transform PascalCase to camelCase
      productsData = productsData.map((p: any) => ({
        id: p.ID,
        productName: p.ProductName,
        grade: p.Grade?.replace('Grade ', ''), // Remove "Grade " prefix
        availableWeight: p.AvailableWeight,
        pricePerKg: p.PricePerKg,
        description: p.Description,
        location: p.Location,
        status: p.Status,
        traderId: p.TraderID,
        gradingId: p.GradingID,
        images: p.Images,
        createdAt: p.CreatedAt,
        updatedAt: p.UpdatedAt,
      }));
      
      console.log('[Products] Transformed data:', productsData);
      console.log('[Products] First product structure:', productsData[0]);
      
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error: any) {
      console.error('[Products] Error fetching products:', error);
      toast.error(error.message || 'Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      console.log('[Products] Deleting product:', productToDelete.id);
      await adminApi.deleteProduct(productToDelete.id, token!);
      
      console.log('[Products] Delete successful, updating UI');
      toast.success('Product deleted successfully');
      
      // Close dialog first
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      
      // Remove from local state using functional updates
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productToDelete.id));
      setFilteredProducts((prevFiltered) => prevFiltered.filter((p) => p.id !== productToDelete.id));
    } catch (error: any) {
      console.error('[Products] Error deleting:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'LOW_STOCK':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'OUT_OF_STOCK':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'RESERVED':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'DISCONTINUED':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'B':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'C':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage marketplace products
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/products/new')}
          className="bg-primary hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            <SelectItem value="RESERVED">Reserved</SelectItem>
            <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Product</TableHead>
              <TableHead className="text-muted-foreground">Grade</TableHead>
              <TableHead className="text-muted-foreground">Weight (kg)</TableHead>
              <TableHead className="text-muted-foreground">Price (₦/kg)</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {product.productName}
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(product.grade)}>
                      {product.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {product.availableWeight}
                  </TableCell>
                  <TableCell className="text-foreground">
                    ₦{product.pricePerKg.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.location || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/products/${product.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground" asChild>
              <div className="space-y-3">
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                
                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-2">
                  <p className="font-medium text-foreground">{productToDelete?.productName}</p>
                  <p className="text-sm text-muted-foreground">Grade: {productToDelete?.grade}</p>
                  <p className="text-sm text-muted-foreground">Location: {productToDelete?.location || 'N/A'}</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}