import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  BRAND_CONFIG,
  createWhatsAppUrl,
  fssaiLabel,
  openWhatsApp,
  phoneTelHref,
} from "../config/brandConfig";
import { priceInfo, formatPriceDate } from "../data/prices";
import {
  buildOrderMessage,
  createOrderId,
  OrderPayment,
  PaymentMethod,
  paymentLine,
} from "../data/order";
import {
  lookupPin,
  paySavedOrder,
  PinPlace,
  upiEnabled,
} from "../checkout/payments";
import { api, SavedOrder } from "../customer/api";
import { useCustomer } from "../customer/CustomerContext";
import { AccountShell } from "../customer/AccountUI";
import { DirectUpiPayment } from "../customer/DirectUpiPayment";
import { setPageMeta } from "../router";
import { CartItem } from "../types";
import { Container } from "../components/ui/Section";
import { Button, buttonClass } from "../components/ui/Button";
import { Field, inputClass, TextField } from "../components/ui/Field";
import { AppLink } from "../components/ui/AppLink";
import { toast } from "../components/ui/Toast";
import { RollingNumber } from "../components/fx/RollingNumber";

interface CheckoutViewProps {
  onNavigate: (route: string, param?: string) => void;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface Details {
  name: string;
  phone: string;
  pin: string;
  house: string;
  landmark: string;
  city: string;
  state: string;
}
const EMPTY: Details = {
  name: "",
  phone: "",
  pin: "",
  house: "",
  landmark: "",
  city: "",
  state: "",
};

/** Indian mobile number: 10 digits starting 6-9, with or without +91 / 0 in front. Returns the 10 digits or null. */
export const normalizeIndianMobile = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};

interface Placed {
  id: string;
  orderId: string;
  items: CartItem[];
  totals: { rice: number; delivery: number; total: number };
  url: string;
  payment: OrderPayment;
  address: string;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const { user, config, loading: accountLoading } = useCustomer();
  const {
    cart,
    totalItems,
    totalAmount,
    totalSavings,
    deliveryCharge,
    isFreeDelivery,
    amountForFreeDelivery,
    grandTotal,
    updateQuantity,
    removeFromCart,
    completeOrder,
  } = useCart();

  const methods = useMemo(() => {
    const list: {
      id: PaymentMethod;
      title: string;
      body: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
    }[] = [];
    if (upiEnabled())
      list.push({
        id: "upi",
        title: "UPI",
        body: "GPay, PhonePe, Paytm, BHIM or any bank app",
        icon: Smartphone,
        badge: "No extra charges",
      });
    if (config.gateway)
      list.push({
        id: "card",
        title: "Card, net banking or wallet",
        body: "Visa, Mastercard, RuPay, all major banks. Secured by Razorpay",
        icon: CreditCard,
      });
    if (BRAND_CONFIG.payments.cashOnDelivery)
      list.push({
        id: "cod",
        title: "Cash on delivery",
        body: "Pay in cash or UPI when the rice reaches you",
        icon: Banknote,
      });
    list.push({
      id: "later",
      title: "Pay after the mill confirms",
      body: "The mill confirms today’s rate on WhatsApp first, then shares payment details",
      icon: Clock,
    });
    return list;
  }, [config.gateway]);

  const [d, setD] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Details | "payment", string>>
  >({});
  const [orderId] = useState(createOrderId);
  const [method, setMethod] = useState<PaymentMethod>(methods[0].id);
  const [pin, setPin] = useState<{
    state: "idle" | "loading" | "found" | "notfound";
    place?: PinPlace;
  }>({ state: "idle" });
  const [card, setCard] = useState<{
    busy: boolean;
    id?: string;
    error?: string;
  }>({ busy: false });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<SavedOrder | null>(null);
  const submission = useRef({ signature: "", requestId: crypto.randomUUID() });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => setPageMeta({ route: "checkout" }), []);
  useEffect(() => {
    if (!user) return;
    const address =
      user.addresses.find((a) => a.isDefault) || user.addresses[0];
    setD(
      address
        ? {
            name: address.name,
            phone: address.phone,
            pin: address.pin,
            house: address.house,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
          }
        : {
            ...EMPTY,
            name: user.name === "Customer" ? "" : user.name,
            phone: user.phone,
          },
    );
  }, [user?.id]);

  // Look the PIN code up as soon as it has 6 digits, and fill in city and state.
  useEffect(() => {
    if (!/^[1-9]\d{5}$/.test(d.pin)) {
      setPin({ state: "idle" });
      return;
    }
    let live = true;
    setPin({ state: "loading" });
    lookupPin(d.pin).then((place) => {
      if (!live) return;
      if (!place) return setPin({ state: "notfound" });
      setPin({ state: "found", place });
      setD((cur) => ({
        ...cur,
        state: place.state,
        city: cur.city || place.district,
      }));
    });
    return () => {
      live = false;
    };
  }, [d.pin]);

  const set =
    (k: keyof Details) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v =
        k === "pin"
          ? e.target.value.replace(/\D/g, "").slice(0, 6)
          : e.target.value;
      setD({ ...d, [k]: v });
      if (errors[k]) setErrors({ ...errors, [k]: undefined });
    };

  const validate = () => {
    const e: typeof errors = {};
    if (!d.name.trim()) e.name = "Enter your name.";
    if (!normalizeIndianMobile(d.phone))
      e.phone = "Enter a 10-digit mobile number, for example 98765 43210.";
    if (!/^[1-9]\d{5}$/.test(d.pin)) e.pin = "Enter the 6-digit PIN code.";
    if (d.house.trim().length < 4)
      e.house = "Enter your house or flat number and street.";
    if (!d.city.trim()) e.city = "Enter your city, town or village.";
    if (!d.state.trim()) e.state = "Enter your state.";
    return e;
  };

  const finish = (order: SavedOrder) => {
    const payment: OrderPayment = {
      method: order.payment.method,
      paid: order.payment.status === "verified",
      reference: order.payment.reference,
    };
    const address = `${order.address.house}${order.address.landmark ? `, near ${order.address.landmark}` : ""}, ${order.address.city}, ${order.address.state} ${order.address.pin}`;
    const url = createWhatsAppUrl(
      buildOrderMessage({
        orderId: order.orderId,
        items: order.items,
        totals: order.totals,
        customer: {
          name: order.address.name,
          phone: order.address.phone,
          address,
        },
        payment,
      }),
    );
    setPlaced({
      id: order.id,
      orderId: order.orderId,
      items: order.items,
      totals: order.totals,
      url,
      payment,
      address,
    });
    completeOrder();
    window.scrollTo({ top: 0 });
  };
  const place = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user || cart.length === 0 || submitting) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = formRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"], [data-payment-error]',
      );
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (
        first instanceof HTMLInputElement ||
        first instanceof HTMLTextAreaElement
      )
        first.focus({ preventScroll: true });
      return;
    }

    setSubmitting(true);
    setCard({ busy: method === "card" });
    const payload = {
      items: cart.map((i) => ({
        productSlug: i.productSlug,
        packSize: i.packSize,
        quantity: i.quantity,
      })),
      expectedTotal: grandTotal,
      method,
      address: { ...d, label: "Checkout", isDefault: false },
    };
    const signature = JSON.stringify(payload);
    if (submission.current.signature !== signature)
      submission.current = { signature, requestId: crypto.randomUUID() };
    try {
      const saved = await api<{ order: SavedOrder }>("/orders", "POST", {
        ...payload,
        requestId: submission.current.requestId,
      });
      setPendingOrder(saved.order);
      const order =
        method === "card" ? await paySavedOrder(saved.order) : saved.order;
      finish(order);
    } catch (err) {
      setErrors({ payment: (err as Error).message });
      setCard({ busy: false, error: (err as Error).message });
    } finally {
      setSubmitting(false);
      setCard((c) => ({ ...c, busy: false }));
    }
  };
  const payByCard = () => place();

  /* ---------------------------------------------------------------- After placing */
  if (placed) return <OrderPlaced placed={placed} onNavigate={onNavigate} />;

  /* ---------------------------------------------------------------- Empty cart */
  if (cart.length === 0) {
    return (
      <section className="bg-grain">
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-gold-100 text-gold-700">
            <ShoppingBag className="h-9 w-9" />
          </span>
          <h1 className="mt-5 font-display text-4xl text-forest-800">
            Your cart is empty
          </h1>
          <p className="mt-3 text-lg text-muted">
            Pick your rice and pack size, then come back here to order.
          </p>
          <AppLink
            to="products"
            className={`mt-8 ${buttonClass("primary", "lg")}`}
          >
            Shop rice
          </AppLink>
        </div>
      </section>
    );
  }

  if (accountLoading || !user)
    return (
      <AccountShell route="checkout" title="Sign in to checkout">
        {null}
      </AccountShell>
    );

  const date = formatPriceDate(priceInfo.updated);
  const ctaLabel =
    method === "card" ? `Pay securely & place order` : `Place order`;

  const Summary = (
    <div className="rounded-3xl bg-white ring-1 ring-line shadow-soft">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="font-display text-2xl text-forest-800">Your order</h2>
        <span className="text-sm text-muted">
          {totalItems} {totalItems === 1 ? "pack" : "packs"}
        </span>
      </div>
      <ul className="mt-4 divide-y divide-line px-6">
        {cart.map((i) => (
          <li key={i.id} className="flex gap-4 py-4">
            <img
              src={i.image}
              alt=""
              className="h-16 w-16 shrink-0 rounded-xl bg-cream object-contain p-1 ring-1 ring-line"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-forest-800">
                    {i.productName}
                  </p>
                  <p className="text-sm text-muted">{i.packSize}</p>
                </div>
                <p className="font-semibold tabular">
                  {inr(i.price * i.quantity)}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="flex items-center rounded-full bg-cream ring-1 ring-line"
                  role="group"
                  aria-label={`Quantity of ${i.productName}`}
                >
                  <button
                    type="button"
                    aria-label="One less"
                    onClick={() => updateQuantity(i.id, i.quantity - 1)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-white cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold tabular">
                    {i.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="One more"
                    onClick={() => updateQuantity(i.id, i.quantity + 1)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-white cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${i.productName}`}
                  onClick={() => removeFromCart(i.id)}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-danger-50 hover:text-danger cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-line px-6 py-5 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Rice</dt>
          <dd className="tabular">{inr(totalAmount)}</dd>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-forest-700">
            <dt>You save on MRP</dt>
            <dd className="tabular">−{inr(totalSavings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Doorstep delivery</dt>
          <dd
            className={`tabular ${isFreeDelivery ? "font-semibold text-forest-700" : ""}`}
          >
            {isFreeDelivery ? "FREE" : inr(deliveryCharge)}
          </dd>
        </div>
        {!isFreeDelivery && (
          <p className="rounded-xl bg-gold-50 px-3 py-2 text-sm text-gold-700">
            Add {inr(amountForFreeDelivery)} more for free delivery.
          </p>
        )}
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="font-semibold text-forest-800">Total</dt>
          <dd className="text-3xl font-bold tracking-tight text-forest-800">
            <RollingNumber value={grandTotal} />
          </dd>
        </div>
        {date && (
          <p className="text-sm text-muted">Today’s mill rates, {date}.</p>
        )}
      </dl>
    </div>
  );

  return (
    <section className="bg-cream pb-32 lg:pb-16">
      <Container className="pt-6 sm:pt-10">
        <AppLink
          to="products"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest-800 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </AppLink>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-medium text-forest-800 sm:text-5xl">
            Checkout
          </h1>
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Lock className="h-4 w-4 text-gold-600" aria-hidden="true" /> Order{" "}
            {orderId}
          </p>
        </div>

        {/* Phones: order summary folded above the form */}
        <div className="mt-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen(!summaryOpen)}
            aria-expanded={summaryOpen}
            className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 ring-1 ring-line cursor-pointer"
          >
            <span className="flex items-center gap-2 font-semibold text-forest-800">
              <ShoppingBag className="h-5 w-5 text-gold-600" />{" "}
              {summaryOpen ? "Hide" : "Show"} order summary
              <ChevronDown
                className={`h-4 w-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`}
              />
            </span>
            <span className="font-display text-2xl text-forest-800 tabular">
              {inr(grandTotal)}
            </span>
          </button>
          {summaryOpen && <div className="mt-3 animate-pop-in">{Summary}</div>}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <form
            id="checkout-form"
            ref={formRef}
            onSubmit={place}
            noValidate
            className="min-w-0 space-y-6 lg:col-span-7"
          >
            {/* 1. Delivery */}
            <fieldset className="min-w-0 rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
              <legend className="contents">
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-800 font-display text-lg text-gold-300 tabular">
                    1
                  </span>
                  <span className="font-display text-2xl text-forest-800">
                    Where should we deliver?
                  </span>
                </span>
              </legend>
              {user.addresses.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-forest-800">
                    Choose a saved address
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.addresses.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() =>
                          setD({
                            name: a.name,
                            phone: a.phone,
                            pin: a.pin,
                            house: a.house,
                            landmark: a.landmark,
                            city: a.city,
                            state: a.state,
                          })
                        }
                        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold text-forest-800 ring-1 ring-line cursor-pointer"
                      >
                        <MapPin className="h-4 w-4" />
                        {a.label} · {a.city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Full name"
                  required
                  autoComplete="name"
                  value={d.name}
                  onChange={set("name")}
                  error={errors.name}
                />
                <Field
                  label="Mobile number (WhatsApp)"
                  required
                  error={errors.phone}
                >
                  {({ id, describedBy, invalid }) => (
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-medium text-muted">
                        +91
                      </span>
                      <input
                        id={id}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="98765 43210"
                        value={d.phone}
                        onChange={set("phone")}
                        aria-describedby={describedBy}
                        aria-invalid={invalid || undefined}
                        className={`${inputClass} pl-14`}
                      />
                    </div>
                  )}
                </Field>
                <Field label="PIN code" required error={errors.pin}>
                  {({ id, describedBy, invalid }) => (
                    <div className="relative">
                      <input
                        id={id}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="508207"
                        value={d.pin}
                        onChange={set("pin")}
                        aria-describedby={describedBy}
                        aria-invalid={invalid || undefined}
                        className={`${inputClass} tabular tracking-[0.2em]`}
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        aria-live="polite"
                      >
                        {pin.state === "loading" && (
                          <Loader2
                            className="h-5 w-5 animate-spin text-muted"
                            aria-label="Looking up PIN code"
                          />
                        )}
                        {pin.state === "found" && (
                          <CheckCircle2
                            className="h-5 w-5 text-forest-700"
                            aria-label="PIN code found"
                          />
                        )}
                      </span>
                    </div>
                  )}
                </Field>
                <div className="flex items-end">
                  {pin.state === "found" && pin.place && (
                    <p className="flex animate-pop-in items-center gap-2 rounded-xl bg-forest-50 px-4 py-3 text-sm text-forest-800 ring-1 ring-forest-200">
                      <MapPin
                        className="h-4 w-4 shrink-0 text-forest-700"
                        aria-hidden="true"
                      />
                      {pin.place.district}, {pin.place.state}
                    </p>
                  )}
                  {pin.state === "notfound" && (
                    <p className="text-sm text-muted">
                      We could not look up this PIN code. Please type your city
                      below.
                    </p>
                  )}
                </div>
                <TextField
                  label="House / flat no. and street"
                  required
                  autoComplete="street-address"
                  placeholder="H.No 4-12, Main Road"
                  value={d.house}
                  onChange={set("house")}
                  error={errors.house}
                  wrapperClassName="sm:col-span-2"
                />
                <TextField
                  label="Landmark"
                  placeholder="Near Sai Baba temple (optional)"
                  value={d.landmark}
                  onChange={set("landmark")}
                />
                <TextField
                  label="City, town or village"
                  required
                  autoComplete="address-level2"
                  list="pin-towns"
                  value={d.city}
                  onChange={set("city")}
                  error={errors.city}
                />
                <TextField
                  label="State"
                  required
                  autoComplete="address-level1"
                  value={d.state}
                  onChange={set("state")}
                  error={errors.state}
                />
                <datalist id="pin-towns">
                  {pin.place?.towns.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
            </fieldset>

            {/* 2. Payment */}
            <fieldset className="min-w-0 rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
              <legend className="contents">
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-800 font-display text-lg text-gold-300 tabular">
                    2
                  </span>
                  <span className="font-display text-2xl text-forest-800">
                    How would you like to pay?
                  </span>
                </span>
              </legend>
              {/* Only on the owner's computer (npm run dev): explains why UPI or card is missing. Never shown on the live site. */}
              {import.meta.env.DEV && (!upiEnabled() || !config.gateway) && (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-gold-400 bg-gold-50 p-4 text-sm text-gold-700">
                  <p className="font-semibold">
                    Setup needed (only you see this on localhost)
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {!upiEnabled() && (
                      <li>
                        UPI (GPay, PhonePe, Paytm) appears once the mill’s UPI
                        ID is set in <code>payments.upiId</code> in
                        src/config/brandConfig.ts.
                      </li>
                    )}
                    {!config.gateway && (
                      <li>
                        Secure gateway payments will appear once the server
                        payment account is connected.
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <div
                role="radiogroup"
                aria-label="Payment method"
                className="mt-6 space-y-3"
              >
                {methods.map((m) => {
                  const on = method === m.id;
                  return (
                    <div
                      key={m.id}
                      className={`overflow-hidden rounded-2xl ring-1 transition-all ${on ? "bg-forest-50/60 ring-2 ring-forest-700" : "ring-line hover:ring-forest-700"}`}
                    >
                      <label className="flex cursor-pointer items-center gap-4 p-4">
                        <input
                          type="radio"
                          name="payment"
                          value={m.id}
                          checked={on}
                          onChange={() => {
                            setMethod(m.id);
                            setErrors({ ...errors, payment: undefined });
                          }}
                          className="h-5 w-5 shrink-0 accent-forest-800"
                        />
                        <span
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${on ? "bg-forest-800 text-gold-300" : "bg-cream text-forest-800"}`}
                        >
                          <m.icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2 font-semibold text-forest-800">
                            {m.title}
                            {m.badge && (
                              <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-700">
                                {m.badge}
                              </span>
                            )}
                          </span>
                          <span className="block text-sm text-muted">
                            {m.body}
                          </span>
                        </span>
                      </label>

                      {on && m.id === "upi" && (
                        <div className="animate-pop-in border-t border-forest-200 p-4 sm:p-5">
                          <p className="font-semibold text-forest-800">
                            Your order comes first.
                          </p>
                          <p className="mt-2 text-sm text-muted">
                            Place your order below to get its UPI QR code or
                            payment-app link. Your order is saved before you
                            pay, and the mill updates payment verification in My
                            orders.
                          </p>
                        </div>
                      )}

                      {on && m.id === "card" && (
                        <div className="animate-pop-in space-y-3 border-t border-forest-200 p-4 sm:p-5">
                          <>
                            <Button
                              size="lg"
                              block
                              loading={card.busy}
                              icon={
                                !card.busy ? (
                                  <Lock className="h-5 w-5 text-gold-400" />
                                ) : undefined
                              }
                              onClick={payByCard}
                            >
                              Pay {inr(grandTotal)} & place order
                            </Button>
                            {card.error && (
                              <p
                                role="alert"
                                className="text-sm font-medium text-danger"
                              >
                                {card.error}
                              </p>
                            )}
                            <p className="text-center text-sm text-muted">
                              Cards, net banking, wallets and UPI through
                              Razorpay. We never see your card details.
                            </p>
                          </>
                        </div>
                      )}

                      {on && (m.id === "cod" || m.id === "later") && (
                        <p className="animate-pop-in border-t border-forest-200 px-4 py-3 text-sm text-ink-soft sm:px-5">
                          {m.id === "cod"
                            ? "Nothing to pay now. Keep the amount ready when the rice arrives."
                            : "Send the order now. The mill replies on WhatsApp with the confirmed rate and how to pay."}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.payment && (
                <p
                  data-payment-error
                  role="alert"
                  className="mt-3 text-sm font-medium text-danger"
                >
                  {errors.payment}
                </p>
              )}
            </fieldset>

            {pendingOrder && errors.payment && (
              <AppLink
                to="order-detail"
                param={pendingOrder.id}
                className="inline-flex min-h-11 items-center font-semibold text-forest-800 underline"
              >
                Your order is saved. Check payment status in My orders.
              </AppLink>
            )}
            {/* 3. Save order */}
            <div className="min-w-0 rounded-3xl bg-forest-800 p-6 text-cream bg-grain-light sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 font-display text-lg text-forest-900 tabular">
                  3
                </span>
                <span className="font-display text-2xl text-white">
                  Make it yours
                </span>
              </div>
              <p className="mt-3 text-cream/80">
                Your order is saved to your account. Follow its progress in My
                orders, and message the mill on WhatsApp whenever you need a
                hand.
              </p>
              <Button
                type="submit"
                variant={method === "card" ? "gold" : "light"}
                size="lg"
                block
                loading={submitting}
                className="mt-6 whitespace-normal text-center"
                icon={<ShoppingBag className="h-5 w-5" />}
              >
                {ctaLabel} · {inr(grandTotal)}
              </Button>
              <ul className="mt-5 grid gap-2 text-sm text-cream/75 sm:grid-cols-3">
                <li className="flex items-center gap-2">
                  <ShieldCheck
                    className="h-4 w-4 text-gold-400"
                    aria-hidden="true"
                  />{" "}
                  {fssaiLabel()}
                </li>
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gold-400" aria-hidden="true" />{" "}
                  From our mill
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gold-400" aria-hidden="true" />{" "}
                  Details shared only with the mill
                </li>
              </ul>
            </div>

            {/* Phones: total and the button always within thumb reach. Portalled to <body> so the page's entrance animation cannot unpin it. */}
            {createPortal(
              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 pb-safe backdrop-blur-xl lg:hidden">
                <div className="mx-auto flex max-w-lg items-center gap-3">
                  <div className="shrink-0">
                    <p className="text-xs text-muted">Total</p>
                    <p className="text-2xl font-bold leading-none tracking-tight text-forest-800">
                      <RollingNumber value={grandTotal} />
                    </p>
                  </div>
                  <Button
                    type="submit"
                    form="checkout-form"
                    variant={method === "card" ? "gold" : "primary"}
                    loading={submitting}
                    size="lg"
                    className="flex-1"
                    icon={<ShoppingBag className="h-5 w-5" />}
                  >
                    {method === "card" ? "Pay & order" : "Place order"}
                  </Button>
                </div>
              </div>,
              document.body,
            )}
          </form>

          {/* Desktop: summary stays in view */}
          <aside
            className="hidden lg:col-span-5 lg:block"
            aria-label="Order summary"
          >
            <div className="sticky top-24 space-y-4">
              {Summary}
              <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm ring-1 ring-line">
                <span className="text-muted">Questions before ordering?</span>
                <span className="flex gap-3 font-semibold text-forest-800">
                  <a
                    href={phoneTelHref()}
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                  <a
                    href={createWhatsAppUrl(
                      "Hello LG Gold, I have a question before ordering.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
};

/** The confirmation screen once the order has been handed to WhatsApp. */
const OrderPlaced: React.FC<{
  placed: Placed;
  onNavigate: (route: string) => void;
}> = ({ placed, onNavigate }) => (
  <section className="bg-cream bg-grain py-12 sm:py-16">
    <Container narrow>
      <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-line shadow-lift sm:p-10">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-whatsapp/10 animate-pop-in">
          <svg viewBox="0 0 52 52" className="h-14 w-14" aria-hidden="true">
            <circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#157a42"
              strokeWidth="3"
              className="[stroke-dasharray:151] [stroke-dashoffset:151] animate-[draw_0.6s_ease-out_forwards]"
            />
            <path
              d="M15 27l7 7 15-15"
              fill="none"
              stroke="#157a42"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="[stroke-dasharray:40] [stroke-dashoffset:40] animate-[draw_0.4s_0.5s_ease-out_forwards]"
            />
          </svg>
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-gold-700">
          Order {placed.orderId}
        </p>
        <h1 className="mt-2 font-display text-4xl text-forest-800">
          Your order has a place at the table.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">
          Your order is saved in your account. The mill will confirm
          availability and dispatch. Follow every update in My orders.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate("order-detail/" + placed.id)}
          >
            Track my order
          </Button>
          <Button
            variant="whatsapp"
            size="lg"
            icon={<MessageCircle className="h-5 w-5" />}
            onClick={() => openWhatsApp(placed.url)}
          >
            Share on WhatsApp
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate("products")}
          >
            Continue shopping
          </Button>
        </div>
      </div>

      {placed.payment.method === "upi" && (
        <div className="mt-6">
          <DirectUpiPayment
            amount={placed.totals.total}
            orderId={placed.orderId}
          />
        </div>
      )}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
          <h2 className="font-display text-xl text-forest-800">
            Order details
          </h2>
          <ul className="mt-3 space-y-1.5 text-[15px]">
            {placed.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="text-ink-soft">
                  {i.quantity} × {i.productName}, {i.packSize}
                </span>
                <span className="tabular">{inr(i.price * i.quantity)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-3 text-muted">
              <span>Delivery</span>
              <span>
                {placed.totals.delivery ? inr(placed.totals.delivery) : "Free"}
              </span>
            </li>
            <li className="flex justify-between gap-3 border-t border-line pt-2 font-semibold text-forest-800">
              <span>Total</span>
              <span className="tabular">{inr(placed.totals.total)}</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted">
            <strong className="text-forest-800">Deliver to:</strong>{" "}
            {placed.address}
          </p>
          <p className="mt-1 text-sm text-muted">
            <strong className="text-forest-800">Payment:</strong>{" "}
            {paymentLine(placed.payment)}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
          <h2 className="font-display text-xl text-forest-800">
            What happens next
          </h2>
          <ol className="mt-4 space-y-4">
            {[
              {
                t: "Your order is saved",
                s: "Available in My orders on any signed-in device.",
              },
              {
                t: "The mill confirms",
                s: "Availability, payment and dispatch updates appear in your order.",
              },
              {
                t: "Rice at your door",
                s: "Fresh from our mill in Venkatadri Palem.",
              },
            ].map((step, i) => (
              <li key={step.t} className="flex gap-3">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${i === 0 ? "bg-whatsapp text-white" : "bg-cream text-forest-800 ring-1 ring-line"}`}
                >
                  {i === 0 ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <div>
                  <p className="font-semibold text-forest-800">{step.t}</p>
                  <p className="text-sm text-muted">{step.s}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Container>
  </section>
);
