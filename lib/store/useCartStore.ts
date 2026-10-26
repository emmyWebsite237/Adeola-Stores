import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { CartItem, Coupon } from '@/types/cart';
import { DELIVERY_ZONES } from '@/data/products';

interface CartState {
  items: CartItem[];
  wishlist: string[];
  coupon: Coupon | null;
  zoneId: string;
  
  // Cart Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Coupon & Zone Actions
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setZoneId: (zoneId: string) => void;
  
  // Computed / Getter methods
  getItemQuantity: (productId: string) => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: () => number;
  getFreeDeliveryThreshold: () => number;
  getFreeDeliveryGap: () => number;
  getTotal: () => number;
  getTotalCount: () => number;
}

const FREE_DELIVERY_THRESHOLD = 50000; // ₦50,000 across Lagos
const VAT_RATE = 0.075; // 7.5%

const VALID_COUPONS: Record<string, Coupon> = {
  WELCOME10: { code: 'WELCOME10', type: 'percent', value: 10 },
  ADEOLA5: { code: 'ADEOLA5', type: 'percent', value: 5 },
  FREEDEL: { code: 'FREEDEL', type: 'fixed', value: 2000, minSubtotal: 20000 },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      coupon: null,
      zoneId: 'mainland',

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find((it) => it.id === product.id);
        if (existing) {
          set({
            items: items.map((it) =>
              it.id === product.id ? { ...it, quantity: it.quantity + quantity } : it
            ),
          });
        } else {
          set({ items: [...items, { id: product.id, product, quantity }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((it) => it.id !== productId) });
      },

      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((it) =>
            it.id === productId ? { ...it, quantity: Math.min(99, quantity) } : it
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      toggleWishlist: (productId) => {
        const { wishlist } = get();
        const on = wishlist.includes(productId);
        set({
          wishlist: on
            ? wishlist.filter((id) => id !== productId)
            : [...wishlist, productId],
        });
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        const found = VALID_COUPONS[clean];
        if (found) {
          const sub = get().getSubtotal();
          if (found.minSubtotal && sub < found.minSubtotal) {
            return false;
          }
          set({ coupon: found });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ coupon: null }),

      setZoneId: (zoneId) => set({ zoneId }),

      getItemQuantity: (productId) => {
        const item = get().items.find((it) => it.id === productId);
        return item ? item.quantity : 0;
      },

      getSubtotal: () => {
        return get().items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
      },

      getDiscount: () => {
        const { coupon } = get();
        const sub = get().getSubtotal();
        if (!coupon || sub <= 0) return 0;
        if (coupon.type === 'percent') {
          return Math.round((sub * coupon.value) / 100);
        }
        return Math.min(sub, coupon.value);
      },

      getDeliveryFee: () => {
        const { zoneId } = get();
        const sub = get().getSubtotal();
        if (sub >= FREE_DELIVERY_THRESHOLD) return 0;
        const z = DELIVERY_ZONES.find((zn) => zn.id === zoneId) || DELIVERY_ZONES[0];
        return z.fee;
      },

      getFreeDeliveryThreshold: () => FREE_DELIVERY_THRESHOLD,

      getFreeDeliveryGap: () => {
        const sub = get().getSubtotal();
        return Math.max(0, FREE_DELIVERY_THRESHOLD - sub);
      },

      getTotal: () => {
        const sub = get().getSubtotal();
        const disc = get().getDiscount();
        const fee = get().getDeliveryFee();
        const vat = Math.round((sub - disc) * VAT_RATE);
        return Math.max(0, sub - disc + fee + vat);
      },

      getTotalCount: () => {
        return get().items.reduce((count, it) => count + it.quantity, 0);
      },
    }),
    {
      name: 'adeola_cart_v2',
    }
  )
);
