import { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal?: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  reference: string;
  date: string;
  customer: OrderCustomer;
  items: {
    productId: string;
    name: string;
    size: string;
    price: number;
    qty: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  deliveryDiscount: number;
  vat: number;
  total: number;
  zone: string;
  paymentMethod: 'Card' | 'Bank Transfer' | 'USSD' | 'Pay on Delivery';
  paymentStatus: 'pending' | 'paid' | 'failed';
  fulfillmentStatus: 'confirmed' | 'processing' | 'dispatched' | 'delivered';
}
