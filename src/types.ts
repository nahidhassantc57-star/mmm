export interface ProductVariant {
  id: string;
  unitName: string; // e.g. "500g", "1 kg", "2 kg", "500 ml", "1 Litre"
  price: number;
  salePrice?: number;
  inStock: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  price: number; // base price
  salePrice?: number;
  image: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  iconName: string;
  image?: string;
}

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryZone: DeliveryZone;
  deliveryCharge: number;
  items: OrderItem[];
  subtotal: number;
  grandTotal: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus: 'unpaid' | 'paid';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  note?: string;
  createdAt: string;
}

export interface DirectOrderPayload {
  productId: string;
  variantId?: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryZone: DeliveryZone;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  note?: string;
}
