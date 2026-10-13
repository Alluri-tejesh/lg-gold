import { CartItem } from '../types';
import { priceInfo, formatPriceDate } from './prices';

/**
 * Orders are placed by sending a WhatsApp message to the mill. This builds that message:
 * plain, readable text with an order number both sides can refer to.
 * (WhatsApp's *bold* markers and ---- lines show up as raw symbols in the message box, so none are used.)
 */

export type PaymentMethod = 'upi' | 'card' | 'cod' | 'later';

export interface OrderPayment {
  method: PaymentMethod;
  /** Payment reference, when available. A reference alone does not verify a payment. */
  reference?: string;
  paid?: boolean;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
}

export interface OrderTotals {
  rice: number;
  delivery: number;
  total: number;
  savings?: number;
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** LG-261013-K7QD: date plus four random characters. Short enough to read out on a phone call. */
export const createOrderId = (now = new Date()): string => {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: '2-digit', month: '2-digit', day: '2-digit' })
    .format(now)
    .replace(/-/g, '');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I, which are easy to confuse
  const rand = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `LG-${ymd}-${rand}`;
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Card / net banking',
  cod: 'Cash on delivery',
  later: 'Pay after the mill confirms',
};

export const paymentLine = (p: OrderPayment): string => {
  // Direct UPI links have no verified callback. Never treat a client-supplied flag or reference as proof of payment.
  if (p.method === 'upi') return `UPI — awaiting payment verification by the mill${p.reference ? `, ref ${p.reference}` : ''}`;
  if (p.method === 'card') return p.paid ? `Paid online${p.reference ? `, payment id ${p.reference}` : ''}` : 'Card / net banking';
  return PAYMENT_LABEL[p.method];
};

export function buildOrderMessage(opts: {
  orderId?: string;
  items: CartItem[];
  totals: OrderTotals;
  customer?: OrderCustomer;
  payment?: OrderPayment;
}): string {
  const { orderId, items, totals, customer, payment } = opts;
  const lines: string[] = [];
  lines.push(customer ? 'Hello LG Gold, I’d like to place an order.' : 'Hello LG Gold, I’d like to order:');
  if (orderId) lines.push('', `Order ${orderId}`);
  lines.push('');
  for (const i of items) {
    lines.push(`• ${i.productName}, ${i.packSize} × ${i.quantity} = ${inr(i.price * i.quantity)}`);
  }
  lines.push('', `Rice: ${inr(totals.rice)}`, `Delivery: ${totals.delivery ? inr(totals.delivery) : 'Free'}`, `Total: ${inr(totals.total)}`);
  if (customer) {
    lines.push('', 'Deliver to:', `${customer.name}, ${customer.phone}`, customer.address);
  }
  if (payment) lines.push('', `Payment: ${paymentLine(payment)}`);
  const asOf = formatPriceDate(priceInfo.updated);
  lines.push('', customer ? `Prices as of ${asOf ?? 'today'}. Please confirm the dispatch time. Thank you!` : `Please confirm today’s rate and delivery. Thank you!`);
  return lines.join('\n');
}
