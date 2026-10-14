import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Home,
  KeyRound,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  Printer,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCustomer } from "./CustomerContext";
import {
  Address,
  api,
  ApiError,
  Customer,
  date,
  formatAddress,
  money,
  OrderList,
  PAYMENT_STATUS,
  SavedOrder,
  STATUS,
} from "./api";
import {
  AccountShell,
  EmptyState,
  ErrorNotice,
  Loading,
  OrderCard,
  OrderJourney,
  ProductThumb,
  RiceOrbit,
  StatusBadge,
} from "./AccountUI";
import { AppLink } from "../components/ui/AppLink";
import { Button, buttonClass } from "../components/ui/Button";
import { TextField } from "../components/ui/Field";
import { Dialog } from "../components/ui/Dialog";
import {
  BRAND_CONFIG,
  createWhatsAppUrl,
  phoneTelHref,
} from "../config/brandConfig";
import { useCart } from "../context/CartContext";
import { PRODUCTS } from "../data/products";
import { navigate } from "../router";
import { toast } from "../components/ui/Toast";
import { paySavedOrder } from "../checkout/payments";
import { DirectUpiPayment } from "./DirectUpiPayment";

function useResource<T>(url: string, poll = false) {
  const { user, refresh: refreshUser } = useCustomer();
  const [data, setData] = useState<T | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    if (!user) return;
    let live = true;
    setLoading(true);
    setError("");
    const load = async () => {
      try {
        const value = await api<T>(url);
        if (live) {
          setData(value);
          setError("");
        }
      } catch (e) {
        if (live) {
          setError((e as Error).message);
          if ((e as ApiError).status === 401) refreshUser();
        }
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    const timer = poll
      ? setInterval(() => {
          if (!document.hidden) load();
        }, 20000)
      : undefined;
    return () => {
      live = false;
      if (timer) clearInterval(timer);
    };
  }, [url, user?.id, version, poll, refreshUser]);
  return { data, loading, error, refresh, setData };
}
export function CustomerView({
  route,
  param,
}: {
  route: string;
  param?: string;
}) {
  const meta: Record<string, [string, string]> = {
    account: [
      "Welcome to your table.",
      "A little space for the rice you love and the orders on their way.",
    ],
    orders: [
      "Your rice journey.",
      "Every order, from our mill to your doorstep.",
    ],
    "order-detail": [
      "From mill to your door.",
      "Follow your order and keep everything you need close by.",
    ],
    addresses: [
      "Where good food goes.",
      "Save your delivery details for a quicker checkout.",
    ],
    profile: ["A little about you.", "Make your account feel more like home."],
    security: [
      "Keep it yours.",
      "Manage how you sign in and protect your account.",
    ],
    support: [
      "We’re here for you.",
      "Questions about your rice, payment or delivery? Talk directly to the mill.",
    ],
  };
  const [title, subtitle] = meta[route] || meta.account;
  return (
    <AccountShell route={route} title={title} subtitle={subtitle}>
      {route === "account" && <Overview />}
      {route === "orders" && <Orders />}
      {route === "order-detail" && <OrderDetails id={param || ""} />}
      {route === "addresses" && <Addresses />}
      {route === "profile" && <Profile />}
      {route === "security" && <Security />}
      {route === "support" && <Support />}
    </AccountShell>
  );
}
function Overview() {
  const { user } = useCustomer();
  const { data, loading, error, refresh } = useResource<OrderList>("/orders");
  if (loading && !data) return <Loading />;
  const active = data?.orders.find(
    (o) => !["delivered", "cancelled"].includes(o.status),
  );
  return (
    <>
      <div className="account-welcome relative overflow-hidden rounded-[32px] bg-forest-950 p-7 text-white sm:p-10">
        <div className="relative z-10 max-w-md">
          <p className="text-xs uppercase tracking-[.2em] text-gold-300">
            YOUR EVERYDAY, MADE EASIER
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight">
            Hello, {user?.name.split(" ")[0]}.<br />
            <span className="italic text-gold-300">
              Let’s make something good.
            </span>
          </h2>
          <p className="mt-4 text-cream/75">
            Good rice, remembered details and an easier next order.
          </p>
          <AppLink to="products" className={`mt-7 ${buttonClass("light")}`}>
            Back to the rice <ArrowRight className="h-4 w-4" />
          </AppLink>
        </div>
        <RiceOrbit />
      </div>
      <ErrorNotice error={error} />
      {error && (
        <Button variant="outline" onClick={refresh}>
          Try again
        </Button>
      )}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {[
          { label: "Orders placed", value: data?.total || 0 },
          { label: "In progress", value: data?.summary?.active || 0 },
          { label: "Delivered", value: data?.summary?.delivered || 0 },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="account-stat"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <p className="font-display text-4xl text-forest-800 tabular">
              {stat.value}
            </p>
            <p className="mt-2 text-xs text-muted sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
      {active && (
        <div className="account-panel">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-700">
                CURRENTLY ON YOUR TABLE
              </p>
              <h2 className="mt-2 font-display text-2xl text-forest-800">
                {active.orderId}
              </h2>
            </div>
            <StatusBadge order={active} />
          </div>
          <OrderJourney order={active} />
          <AppLink
            to="order-detail"
            param={active.id}
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-forest-800"
          >
            See order details <ArrowRight className="h-4 w-4" />
          </AppLink>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-forest-800">
          Recently ordered
        </h2>
        <AppLink
          to="orders"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest-800"
        >
          View all <ArrowRight className="h-4 w-4" />
        </AppLink>
      </div>
      {data?.orders.length ? (
        <div className="grid gap-4">
          {data.orders.slice(0, 3).map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      ) : (
        !error && (
          <EmptyState
            title="Your first chapter starts here."
            body="Pick your favourite rice. Your saved orders will appear here, ready to track or order again."
          />
        )
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <AppLink
          to="addresses"
          className="account-panel flex items-center gap-4"
        >
          <MapPin className="h-6 w-6 text-gold-700" />
          <div>
            <p className="font-semibold text-forest-800">Your delivery book</p>
            <p className="mt-1 text-sm text-muted">
              {user?.addresses.length || 0} saved addresses
            </p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4" />
        </AppLink>
        <AppLink to="support" className="account-panel flex items-center gap-4">
          <MessageCircle className="h-6 w-6 text-gold-700" />
          <div>
            <p className="font-semibold text-forest-800">
              A real person at the mill
            </p>
            <p className="mt-1 text-sm text-muted">Get help with your order</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4" />
        </AppLink>
      </div>
    </>
  );
}
function Orders() {
  const [page, setPage] = useState(1),
    [filter, setFilter] = useState("all");
  const { data, loading, error, refresh } = useResource<OrderList>(
    `/orders?page=${page}${filter === "all" ? "" : `&status=${filter}`}`,
    true,
  );
  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter orders"
        >
          {[
            ["all", "All orders"],
            ["placed", "Placed"],
            ["shipped", "On the way"],
            ["delivered", "Delivered"],
            ["cancelled", "Cancelled"],
          ].map(([v, label]) => (
            <button
              key={v}
              onClick={() => {
                setFilter(v);
                setPage(1);
              }}
              aria-pressed={filter === v}
              className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-all cursor-pointer ${filter === v ? "bg-forest-800 text-white" : "bg-white text-muted ring-1 ring-line"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          icon={
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          }
          onClick={refresh}
        >
          Refresh
        </Button>
      </div>
      <ErrorNotice error={error} />
      {loading && !data ? (
        <Loading />
      ) : data?.orders.length ? (
        <div className="grid gap-4">
          {data.orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      ) : (
        !error && (
          <EmptyState
            title={
              filter === "all"
                ? "Your first bag is waiting."
                : "Nothing here yet."
            }
            body={
              filter === "all"
                ? "Place an order and follow it here, every step of the way."
                : "No orders match this filter."
            }
          />
        )
      )}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-muted">Page {page}</span>
        <Button
          variant="outline"
          disabled={!data || page * 12 >= data.total || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
}
function OrderDetails({ id }: { id: string }) {
  const { config } = useCustomer();
  const { data, loading, error, refresh, setData } = useResource<{
    order: SavedOrder;
  }>(`/orders/${encodeURIComponent(id)}`, true);
  const [busy, setBusy] = useState(false),
    [actionError, setActionError] = useState(""),
    [cancelOpen, setCancelOpen] = useState(false);
  const { addToCart } = useCart();
  const order = data?.order;
  if (!order)
    return (
      <>
        <ErrorNotice error={error} />
        {loading ? <Loading /> : <Button onClick={refresh}>Try again</Button>}
      </>
    );
  const reorder = () => {
    const available = order.items.map((i) => ({
      item: i,
      product: PRODUCTS.find((p) => p.slug === i.productSlug),
    }));
    if (
      available.some(
        ({ item, product }) =>
          !product?.packOptions.find(
            (p) => p.size === item.packSize && p.inStock,
          ),
      )
    ) {
      setActionError(
        "One of these packs is no longer available. Please choose your rice in the shop.",
      );
      return;
    }
    available.forEach(({ item, product }) =>
      addToCart(product!, item.packSize, item.quantity, { quiet: true }),
    );
    navigate("checkout");
  };
  const cancel = async () => {
    setBusy(true);
    setActionError("");
    try {
      setData(await api(`/orders/${id}/cancel`, "POST"));
      setCancelOpen(false);
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const pay = async () => {
    setBusy(true);
    setActionError("");
    try {
      const paid = await paySavedOrder(order);
      setData({ order: paid });
    } catch (e) {
      setActionError((e as Error).message);
      refresh();
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <AppLink
        to="orders"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest-800"
      >
        ← All orders
      </AppLink>
      <ErrorNotice error={error || actionError} />
      <div className="account-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">
              Placed {date(order.createdAt, true)}
            </p>
            <h2 className="mt-2 font-display text-3xl text-forest-800">
              {order.orderId}
            </h2>
          </div>
          <StatusBadge order={order} />
        </div>
        <OrderJourney order={order} />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="outline"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={refresh}
          >
            Refresh status
          </Button>
          <Button
            variant="outline"
            icon={<Printer className="h-4 w-4" />}
            onClick={() => window.print()}
          >
            Print order summary
          </Button>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="account-panel">
          <h2 className="font-display text-2xl text-forest-800">
            In your order
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 py-4">
                <ProductThumb item={i} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-forest-800">
                    {i.productName}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {i.packSize} × {i.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular">
                  {money(i.price * i.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 border-t border-line pt-5">
            <div className="flex justify-between text-sm">
              <dt>Rice</dt>
              <dd>{money(order.totals.rice)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt>Delivery</dt>
              <dd>
                {order.totals.delivery ? money(order.totals.delivery) : "Free"}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-semibold text-forest-800">
              <dt>Total</dt>
              <dd className="text-xl tabular">{money(order.totals.total)}</dd>
            </div>
          </dl>
          <Button
            block
            className="mt-6"
            onClick={reorder}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Order these packs again
          </Button>
          <p className="mt-2 text-center text-xs text-muted">
            Current prices apply to a new order.
          </p>
        </div>
        <div className="space-y-6">
          <div className="account-panel">
            <MapPin className="h-5 w-5 text-gold-700" />
            <h2 className="mt-3 font-display text-xl text-forest-800">
              Delivering to
            </h2>
            <p className="mt-3 font-semibold">{order.address.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {formatAddress(order.address)}
            </p>
            <p className="mt-2 text-sm text-muted">{order.address.phone}</p>
            {order.tracking && (
              <p className="mt-4 rounded-xl bg-cream p-3 text-sm">
                <strong>Dispatch reference:</strong> {order.tracking}
              </p>
            )}
          </div>
          <div className="account-panel">
            <ShieldCheck className="h-5 w-5 text-gold-700" />
            <h2 className="mt-3 font-display text-xl text-forest-800">
              Payment
            </h2>
            <p className="mt-3 text-sm font-semibold text-forest-800">
              {PAYMENT_STATUS[order.payment.status]}
            </p>
            <p className="mt-2 text-sm text-muted">
              {order.payment.method === "upi"
                ? "Direct UPI · the mill verifies receipt"
                : order.payment.method === "card"
                  ? "Secure gateway payment"
                  : order.payment.method === "cod"
                    ? "Cash on delivery"
                    : "Pay after confirmation"}
            </p>
            {order.payment.reference && (
              <p className="mt-2 break-all text-xs text-muted">
                Reference: {order.payment.reference}
              </p>
            )}
            {order.payment.method === "card" &&
              order.payment.status !== "verified" &&
              order.status !== "cancelled" &&
              config.gateway && (
                <Button className="mt-4" loading={busy} onClick={pay}>
                  Complete payment
                </Button>
              )}
          </div>
        </div>
      </div>
      {order.payment.method === "upi" &&
        order.payment.status !== "verified" &&
        order.status !== "cancelled" && (
          <DirectUpiPayment
            amount={order.totals.total}
            orderId={order.orderId}
          />
        )}
      <div className="account-panel">
        <h2 className="font-display text-2xl text-forest-800">
          The story so far
        </h2>
        <ol className="mt-6 space-y-6 border-l border-line pl-6">
          {order.history.map((h, i) => (
            <li key={`${h.at}-${i}`} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold-600 ring-4 ring-white" />
              <p className="text-sm font-semibold text-forest-800">{h.note}</p>
              <p className="mt-1 text-xs text-muted">{date(h.at, true)}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="account-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-forest-800">Need a hand?</h2>
          <p className="mt-1 text-sm text-muted">
            Your order number is included when you contact us.
          </p>
        </div>
        <Button
          href={createWhatsAppUrl(
            `Hello LG Gold, I need help with order ${order.orderId}.`,
          )}
          variant="whatsapp"
          icon={<MessageCircle className="h-4 w-4" />}
        >
          Ask the mill
        </Button>
        {["placed", "confirmed"].includes(order.status) &&
          order.payment.status !== "verified" && (
            <Button variant="danger" onClick={() => setCancelOpen(true)}>
              Cancel order
            </Button>
          )}
      </div>
      <Dialog
        open={cancelOpen}
        onClose={() => !busy && setCancelOpen(false)}
        label="Cancel order"
      >
        <div className="p-7">
          <h2 className="font-display text-2xl text-forest-800">
            Cancel {order.orderId}?
          </h2>
          <p className="mt-3 text-muted">
            This stops the order before packing. If you transferred money by
            UPI, contact the mill to arrange a refund.
          </p>
          <ErrorNotice error={actionError} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setCancelOpen(false)}
              disabled={busy}
            >
              Keep my order
            </Button>
            <Button variant="danger" loading={busy} onClick={cancel}>
              Cancel this order
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
const blankAddress = (user: Customer | null): Address => ({
  label: "Home",
  name: user?.name || "",
  phone: user?.phone || "",
  house: "",
  landmark: "",
  city: "",
  state: "",
  pin: "",
  isDefault: true,
});
function Addresses() {
  const { user, setUser } = useCustomer();
  const [editing, setEditing] = useState<Address | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function saveList(list: Address[]) {
    setBusy(true);
    setError("");
    try {
      const result = await api<{ user: Customer }>(
        "/account/addresses",
        "PUT",
        { addresses: list },
      );
      setUser(result.user);
      setEditing(null);
      toast({ message: "Delivery book updated." });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const list = [...(user?.addresses || [])]
      .filter((a) => a.id !== editing.id)
      .map((a) => ({
        ...a,
        isDefault: editing.isDefault ? false : a.isDefault,
      }));
    saveList([...list, editing]);
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {user?.addresses.length || 0} of 10 saved addresses
        </p>
        <Button
          disabled={(user?.addresses.length || 0) >= 10}
          onClick={() => {
            setError("");
            setEditing({
              ...blankAddress(user),
              isDefault: !user?.addresses.length,
            });
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Add address
        </Button>
      </div>
      <ErrorNotice error={error} />
      <div className="grid gap-5 sm:grid-cols-2">
        {user?.addresses.map((a) => (
          <article
            key={a.id}
            className={`account-panel address-card ${a.isDefault ? "is-default" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-semibold text-forest-800">
                <Home className="h-5 w-5 text-gold-700" />
                {a.label}
              </span>
              {a.isDefault && (
                <span className="rounded-full bg-forest-50 px-3 py-1 text-xs text-forest-800">
                  Default
                </span>
              )}
            </div>
            <p className="mt-4 font-medium">{a.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {formatAddress(a)}
            </p>
            <p className="mt-2 text-sm text-muted">{a.phone}</p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              <Button
                variant="ghost"
                size="sm"
                icon={<Edit3 className="h-4 w-4" />}
                onClick={() => {
                  setError("");
                  setEditing(a);
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={busy}
                aria-label={`Remove ${a.label} address`}
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() =>
                  saveList(user.addresses.filter((x) => x.id !== a.id))
                }
              >
                Remove
              </Button>
              {!a.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    saveList(
                      user.addresses.map((x) => ({
                        ...x,
                        isDefault: x.id === a.id,
                      })),
                    )
                  }
                >
                  Make default
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
      {!user?.addresses.length && (
        <div className="account-panel py-12 text-center">
          <MapPin className="mx-auto h-10 w-10 text-gold-700" />
          <h2 className="mt-5 font-display text-3xl text-forest-800">
            A doorstep to remember.
          </h2>
          <p className="mt-3 text-muted">
            Add an address once. Choose it at checkout next time.
          </p>
        </div>
      )}
      <Dialog
        open={!!editing}
        onClose={() => !busy && setEditing(null)}
        label={editing?.id ? "Edit delivery address" : "Add delivery address"}
      >
        <div className="max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
          <h2 className="font-display text-3xl text-forest-800">
            {editing?.id ? "Edit your doorstep." : "A new doorstep."}
          </h2>
          {editing && (
            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["label", "Address label"],
                  ["name", "Recipient name"],
                  ["phone", "Mobile number"],
                  ["pin", "PIN code"],
                  ["house", "House / flat no. and street"],
                  ["landmark", "Landmark (optional)"],
                  ["city", "City, town or village"],
                  ["state", "State"],
                ] as const
              ).map(([key, label]) => (
                <TextField
                  key={key}
                  label={label}
                  value={editing[key]}
                  onChange={(e) =>
                    setEditing({ ...editing, [key]: e.target.value })
                  }
                  required={key !== "landmark"}
                  maxLength={key === "house" ? 200 : key === "pin" ? 6 : 120}
                  pattern={key === "pin" ? "[1-9][0-9]{5}" : undefined}
                  inputMode={
                    key === "pin"
                      ? "numeric"
                      : key === "phone"
                        ? "tel"
                        : undefined
                  }
                  wrapperClassName={key === "house" ? "sm:col-span-2" : ""}
                />
              ))}
              <label className="flex min-h-11 items-center gap-3 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={editing.isDefault}
                  onChange={(e) =>
                    setEditing({ ...editing, isDefault: e.target.checked })
                  }
                  className="h-5 w-5 accent-forest-800"
                />
                Use as my default address
              </label>
              <div className="sm:col-span-2">
                <ErrorNotice error={error} />
              </div>
              <Button
                type="submit"
                size="lg"
                block
                loading={busy}
                className="sm:col-span-2"
              >
                Save address
              </Button>
            </form>
          )}
        </div>
      </Dialog>
    </>
  );
}
function Profile() {
  const { user, setUser } = useCustomer();
  const [name, setName] = useState(user?.name || ""),
    [phone, setPhone] = useState(user?.phone || ""),
    [email, setEmail] = useState(user?.email || ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ user: Customer }>(
        "/account/profile",
        "PATCH",
        {
          name,
          ...(phone.trim() ? { phone } : {}),
          ...(email.trim() ? { email } : {}),
        },
      );
      setUser(result.user);
      toast({ message: "Your profile is updated." });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const verify = async () => {
    setBusy(true);
    setError("");
    try {
      await api("/auth/send-verification", "POST");
      toast({ message: "Verification link sent. Check your inbox." });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <form onSubmit={save} className="account-panel space-y-5">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-[24px] bg-forest-800 font-display text-3xl text-gold-300">
            {user?.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h2 className="font-display text-2xl text-forest-800">
              Your details
            </h2>
            <p className="mt-1 text-sm text-muted">
              At the table since {user ? date(user.createdAt) : ""}
            </p>
          </div>
        </div>
        <TextField
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={80}
        />
        <TextField
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={user?.emailVerified}
          hint={
            user?.emailVerified
              ? "Verified email. Contact the mill if you need to change it."
              : "Optional. Lets you reset your password by email."
          }
        />
        <TextField
          label="Mobile number"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint="You sign in with this number, and the mill calls it about deliveries."
        />
        <ErrorNotice error={error} />
        <Button type="submit" loading={busy}>
          Save profile
        </Button>
      </form>
      {user?.email && (
        <div className="account-panel flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-forest-800">
              Email verification
            </h2>
            <p className="mt-2 text-sm text-muted">
              {user.emailVerified
                ? "Your email is verified."
                : "Verify your email to keep account recovery reliable."}
            </p>
          </div>
          {user.emailVerified ? (
            <CheckCircle2 className="h-7 w-7 text-forest-700" />
          ) : (
            <Button variant="outline" loading={busy} onClick={verify}>
              Send verification link
            </Button>
          )}
        </div>
      )}
    </>
  );
}
function Security() {
  const { user, refresh, logout } = useCustomer();
  const [current, setCurrent] = useState(""),
    [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/account/password", "POST", {
        currentPassword: current,
        password,
      });
      setCurrent("");
      setPassword("");
      await refresh();
      toast({
        message: "Password updated. Other devices have been signed out.",
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <ErrorNotice error={error} />
      <form onSubmit={changePassword} className="account-panel space-y-5">
        <div className="flex items-center gap-3">
          <KeyRound className="h-6 w-6 text-gold-700" />
          <h2 className="font-display text-2xl text-forest-800">
            {user?.hasPassword ? "Change password" : "Add a password"}
          </h2>
        </div>
        {user?.hasPassword && (
          <TextField
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        )}
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={128}
          hint="At least 10 characters. Updating this signs out your other devices."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" loading={busy}>
          Update password
        </Button>
      </form>
      <div className="account-panel">
        <h2 className="font-display text-2xl text-forest-800">
          Your signed-in devices
        </h2>
        <p className="mt-3 text-sm text-muted">
          Sign out everywhere, including this browser. You can sign in again
          with your mobile code or password.
        </p>
        <Button
          variant="outline"
          loading={busy}
          className="mt-5"
          onClick={async () => {
            setBusy(true);
            try {
              await logout(true);
              navigate("login");
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Sign out of all devices
        </Button>
      </div>
    </>
  );
}
function Support() {
  return (
    <>
      <div className="account-panel">
        <MessageCircle className="h-8 w-8 text-gold-700" />
        <h2 className="mt-4 font-display text-3xl text-forest-800">
          Straight to the people who mill it.
        </h2>
        <p className="mt-3 max-w-lg text-muted">
          For delivery updates, payment checks or help with an order, talk to
          our team. Keep your order number handy.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            href={createWhatsAppUrl(
              "Hello LG Gold, I need help with my customer account or an order.",
            )}
            variant="whatsapp"
            icon={<MessageCircle className="h-4 w-4" />}
          >
            WhatsApp the mill
          </Button>
          <Button href={phoneTelHref()} variant="outline">
            Call the mill
          </Button>
        </div>
        <p className="mt-5 text-sm text-muted">
          {BRAND_CONFIG.contact.operatingHours}
        </p>
      </div>
      <div className="account-panel">
        <h2 className="font-display text-2xl text-forest-800">
          A few things made clear.
        </h2>
        <div className="mt-5 space-y-5">
          {[
            [
              "Where is my order?",
              "Open My orders and choose your order. Status updates appear when the mill confirms, packs and dispatches it.",
            ],
            [
              "I paid by direct UPI. Why does it say pending?",
              "The mill checks the transfer before marking it verified. If you need help, share your bank reference with the mill on WhatsApp.",
            ],
            [
              "Can I change my delivery address?",
              "Saved-address changes apply to future orders. For an order already placed, contact the mill before dispatch.",
            ],
            [
              "Can I cancel or request a refund?",
              "Unpaid orders can be cancelled online before packing. For paid or dispatched orders, contact the mill to discuss cancellation or a refund.",
            ],
          ].map(([q, a]) => (
            <div key={q}>
              <h3 className="font-semibold text-forest-800">{q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
