export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface Product {
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
    publicId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}