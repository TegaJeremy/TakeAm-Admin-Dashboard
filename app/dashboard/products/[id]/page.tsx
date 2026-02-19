'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && params.id) {
      fetchProduct();
    }
  }, [token, params.id]);

  const fetchProduct = async () => {
    try {
      console.log('[ProductDetail] Fetching product:', params.id);
      const response: any = await adminApi.getProductById(params.id as string, token!);
      
      console.log('[ProductDetail] Raw response:', response);
      console.log('[ProductDetail] Response type:', typeof response);
      console.log('[ProductDetail] Response keys:', Object.keys(response || {}));
      
      // Check if response has the data we need
      if (!response) {
        throw new Error('No response from server');
      }
      
      // Handle both response formats: { data: {...} } or direct {...}
      const productResponse = response.data || response;
      
      console.log('[ProductDetail] Product response:', productResponse);
      
      // Transform PascalCase to camelCase
      const productData = {
        id: productResponse.ID,
        productName: productResponse.ProductName,
        grade: productResponse.Grade?.replace('Grade ', ''),
        availableWeight: productResponse.AvailableWeight,
        pricePerKg: productResponse.PricePerKg,
        description: productResponse.Description,
        location: productResponse.Location,
        status: productResponse.Status,
        traderId: productResponse.TraderID,
        gradingId: productResponse.GradingID,
        images: productResponse.Images,
        createdAt: productResponse.CreatedAt,
        updatedAt: productResponse.UpdatedAt,
      };
      
      console.log('[ProductDetail] Transformed product:', productData);
      setProduct(productData);
    } catch (error: any) {
      console.error('[ProductDetail] Error:', error);
      toast.error(error.message || 'Failed to load product');
      router.push('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      console.log('[ProductDetail] Deleting product:', product.id);
      await adminApi.deleteProduct(product.id, token!);
      toast.success('Product deleted successfully');
      router.push('/dashboard/products');
    } catch (error: any) {
      console.error('[ProductDetail] Delete error:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'LOW_STOCK': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'OUT_OF_STOCK': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'RESERVED': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'B': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'C': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{product.productName}</h1>
            <p className="text-muted-foreground mt-1">Product Details</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

{/* Images */}
{product.images && 
 Array.isArray(product.images) &&
 product.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '').length > 0 && (
  <div className="rounded-lg border border-border bg-card p-6">
    <h2 className="text-lg font-semibold text-foreground mb-4">Product Images</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {product.images
        .filter((image: any) => image && typeof image === 'string' && image.trim() !== '')
        .map((image: string, index: number) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
            <Image
              src={image}
              alt={`${product.productName} ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
    </div>
  </div>
)}

      {/* Details */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Grade</label>
            <Badge className={`mt-1 ${getGradeColor(product.grade)}`}>
              Grade {product.grade}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Status</label>
            <Badge className={`mt-1 ${getStatusColor(product.status)}`}>
              {product.status.replace('_', ' ')}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Available Weight</label>
            <p className="text-foreground font-medium">{product.availableWeight} kg</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Price per kg</label>
            <p className="text-foreground font-medium">₦{product.pricePerKg.toLocaleString()}</p>
          </div>

          {product.location && (
            <div>
              <label className="text-sm text-muted-foreground">Location</label>
              <p className="text-foreground">{product.location}</p>
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground">Total Value</label>
            <p className="text-foreground font-medium">
              ₦{(product.availableWeight * product.pricePerKg).toLocaleString()}
            </p>
          </div>
        </div>

        {product.description && (
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <p className="text-foreground mt-1">{product.description}</p>
          </div>
        )}

        <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(product.updatedAt).toLocaleString()}</p>
          <p>Product ID: {product.id}</p>
        </div>
      </div>
    </div>
  );
}