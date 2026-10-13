import { BRAND_CONFIG } from "../config/brandConfig";
import { api, SavedOrder } from "../customer/api";

/* ------------------------------------------------------------------ UPI */

export const upiEnabled = () => !!BRAND_CONFIG.payments.upiId;

/**
 * A UPI payment link (the NPCI "upi://pay" format) that GPay, PhonePe, Paytm, BHIM and bank apps understand.
 * The amount and order number are filled in, so the customer only confirms with their PIN.
 */
export const upiLink = (amount: number, orderId: string) => {
  const p = BRAND_CONFIG.payments;
  const q = new URLSearchParams({
    pa: p.upiId,
    pn: p.upiPayeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tn: `LG Gold order ${orderId}`,
    tr: orderId,
  });
  return `upi://pay?${q.toString()}`;
};

/* ------------------------------------------------------------------ Razorpay (cards, net banking, wallets) */

export const razorpayEnabled = () => !!BRAND_CONFIG.payments.razorpayKeyId;

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    cb: (r: { error?: { description?: string } }) => void,
  ) => void;
}

type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;

let scriptPromise: Promise<RazorpayCtor> | null = null;

/** Loads Razorpay's checkout script the first time it is needed (never for visitors who do not pay by card). */
const loadRazorpay = (): Promise<RazorpayCtor> => {
  const w = window as unknown as { Razorpay?: RazorpayCtor };
  if (w.Razorpay) return Promise.resolve(w.Razorpay);
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () =>
      w.Razorpay
        ? resolve(w.Razorpay)
        : reject(new Error("Razorpay did not load"));
    s.onerror = () => {
      scriptPromise = null;
      reject(
        new Error(
          "Could not reach Razorpay. Check your connection and try again.",
        ),
      );
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
};

/**
 * Opens Razorpay's secure payment window (cards, net banking, wallets, UPI).
 * Resolves with the payment id when paid; rejects with a readable message if it fails or is closed.
 */
export async function paySavedOrder(order: SavedOrder): Promise<SavedOrder> {
  const setup = await api<{
    key: string;
    gatewayOrderId: string;
    amount: number;
    currency: string;
  }>(`/orders/${order.id}/payment`, "POST");
  const Razorpay = await loadRazorpay();
  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key: setup.key,
      order_id: setup.gatewayOrderId,
      amount: setup.amount,
      currency: setup.currency,
      name: "LG Gold Rice",
      description: `Order ${order.orderId}`,
      prefill: { name: order.address.name, contact: order.address.phone },
      theme: { color: "#174A32" },
      handler: async (r: RazorpayResponse) => {
        try {
          const result = await api<{ order: SavedOrder }>(
            `/orders/${order.id}/payment/verify`,
            "POST",
            r,
          );
          resolve(result.order);
        } catch (e) {
          reject(e);
        }
      },
      modal: {
        ondismiss: () =>
          reject(
            new Error(
              "Payment window closed. Your order is saved; check its payment status in My orders before retrying.",
            ),
          ),
      },
    });
    rzp.on("payment.failed", (r) =>
      reject(
        new Error(
          r.error?.description ||
            "Payment could not be completed. Check My orders before retrying.",
        ),
      ),
    );
    rzp.open();
  });
}

/* ------------------------------------------------------------------ PIN code lookup */

export interface PinPlace {
  district: string;
  state: string;
  towns: string[];
}

/**
 * Looks up an Indian PIN code (India Post data) so city, district and state fill themselves in.
 * Returns null when the lookup is not possible; the fields simply stay editable.
 */
export async function lookupPin(pin: string): Promise<PinPlace | null> {
  if (!/^[1-9]\d{5}$/.test(pin)) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      Status: string;
      PostOffice:
        | { Name: string; District: string; State: string; Block?: string }[]
        | null;
    }[];
    const offices =
      data?.[0]?.Status === "Success" ? (data[0].PostOffice ?? []) : [];
    if (!offices.length) return null;
    return {
      district: offices[0].District,
      state: offices[0].State,
      towns: [...new Set(offices.map((o) => o.Name))].slice(0, 8),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
