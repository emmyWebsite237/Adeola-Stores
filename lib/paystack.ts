export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder_ladydee';

export interface PaystackPaymentArgs {
  email: string;
  amount: number; // in Naira (will be converted to Kobo for Paystack)
  reference: string;
  metadata?: Record<string, any>;
  onSuccess: (response: { reference: string }) => void;
  onClose: () => void;
}

/**
 * Loads the Paystack Inline JS script dynamically
 */
export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).PaystackPop) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens the Paystack Payment Modal (Card, Bank Transfer, USSD)
 */
export async function openPaystackModal(args: PaystackPaymentArgs) {
  const loaded = await loadPaystackScript();
  if (!loaded || !(window as any).PaystackPop) {
    alert('Could not initialize Paystack payment gateway. Please check your internet connection.');
    args.onClose();
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: args.email,
    amount: Math.round(args.amount * 100), // Naira to Kobo
    currency: 'NGN',
    ref: args.reference,
    metadata: args.metadata || {},
    callback: function (response: { reference: string }) {
      args.onSuccess(response);
    },
    onClose: function () {
      args.onClose();
    },
  });

  handler.openIframe();
}
