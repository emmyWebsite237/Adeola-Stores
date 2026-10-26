export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  size: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: 'bestseller' | 'new' | 'deal';
  short: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  image?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  eta: string;
  coverage: string;
}
