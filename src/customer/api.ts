import { CartItem } from "../types";
export interface Address {
  id?: string;
  label: string;
  name: string;
  phone: string;
  house: string;
  landmark: string;
  city: string;
  state: string;
  pin: string;
  isDefault: boolean;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: "customer" | "admin";
  hasPassword: boolean;
  addresses: Address[];
  createdAt: string;
}
export type OrderStatus =
  "placed" | "confirmed" | "packing" | "shipped" | "delivered" | "cancelled";
export interface SavedOrder {
  id: string;
  orderId: string;
  customer: { name: string; email: string; phone: string };
  items: CartItem[];
  totals: { rice: number; delivery: number; total: number };
  address: Address;
  status: OrderStatus;
  payment: {
    method: "upi" | "card" | "cod" | "later";
    status: "pending" | "unpaid" | "verified";
    reference?: string;
  };
  history: { status: OrderStatus; at: string; note: string }[];
  tracking?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface AuthConfig {
  sms: boolean;
  localSms?: boolean;
  email: boolean;
  gateway: boolean;
  razorpayKey: string;
}
export interface OrderList {
  orders: SavedOrder[];
  total: number;
  page: number;
  summary?: { active: number; delivered: number; total: number };
  stats?: { _id: OrderStatus; count: number; value: number }[];
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status = 0,
  ) {
    super(message);
  }
}
export async function api<T = { ok: boolean }>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      headers: {
        "X-LG-Client": "web",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    throw new ApiError(
      "Could not reach the shop. Check your connection and try again.",
    );
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      result.error || "The request could not be completed.",
      response.status,
    );
  return result as T;
}
export const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const date = (s: string, time = false) =>
  new Date(s).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "numeric", minute: "2-digit" } : {}),
  });
export const STATUS: Record<OrderStatus, string> = {
  placed: "Order placed",
  confirmed: "Confirmed",
  packing: "Being packed",
  shipped: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
export const PAYMENT_STATUS = {
  pending: "Awaiting payment verification",
  unpaid: "Payment due",
  verified: "Payment verified",
};
export const formatAddress = (a: Address) =>
  `${a.house}${a.landmark ? `, near ${a.landmark}` : ""}, ${a.city}, ${a.state} ${a.pin}`;
