import React, { useEffect, useState } from "react";
import {
  Box,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Filter,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import {
  AccountShell,
  ErrorNotice,
  Loading,
  ProductThumb,
  StatusBadge,
} from "./AccountUI";
import {
  api,
  date,
  formatAddress,
  money,
  OrderList,
  OrderStatus,
  PAYMENT_STATUS,
  SavedOrder,
  STATUS,
} from "./api";
import { useCustomer } from "./CustomerContext";
import { Button, buttonClass } from "../components/ui/Button";
import { TextField, SelectField } from "../components/ui/Field";
import { AppLink } from "../components/ui/AppLink";
import { Dialog } from "../components/ui/Dialog";
import { toast } from "../components/ui/Toast";
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["packing", "cancelled"],
  packing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
export function AdminOrdersView() {
  const { user } = useCustomer();
  const [data, setData] = useState<OrderList | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [status, setStatus] = useState("all"),
    [search, setSearch] = useState(""),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<SavedOrder | null>(null),
    [busy, setBusy] = useState(false),
    [actionError, setActionError] = useState("");
  const [next, setNext] = useState(""),
    [note, setNote] = useState(""),
    [tracking, setTracking] = useState(""),
    [reference, setReference] = useState(""),
    [verify, setVerify] = useState(false);
  useEffect(() => {
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }
    let live = true;
    const load = async () => {
      setLoading(true);
      try {
        const result = await api<OrderList>(
          `/admin/orders?page=${page}${status === "all" ? "" : `&status=${status}`}&search=${encodeURIComponent(query)}`,
        );
        if (live) {
          setData(result);
          setError("");
        }
      } catch (e) {
        if (live) setError((e as Error).message);
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    const timer = setInterval(() => {
      if (!document.hidden) load();
    }, 30000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [user?.id, user?.role, status, query, page, tick]);
  const open = (o: SavedOrder) => {
    setSelected(o);
    setNext(o.status);
    setNote("");
    setTracking(o.tracking || "");
    setReference("");
    setVerify(false);
    setActionError("");
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setActionError("");
    try {
      await api(`/admin/orders/${selected.id}`, "PATCH", {
        version: selected.version,
        status: next,
        note,
        tracking,
        verifyPayment: verify,
        reference,
      });
      setSelected(null);
      setTick((t) => t + 1);
      toast({
        message: "Order updated. The customer can see its latest status.",
      });
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <AccountShell
      route="admin-orders"
      title="The mill’s order desk."
      subtitle="Real orders. Clear payment checks. Every delivery accounted for."
    >
      {user?.role !== "admin" ? (
        <ErrorNotice error="This page is available to order administrators. Sign in with your verified administrator account." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [
                "Orders",
                data?.stats?.reduce((n, s) => n + s.count, 0) || 0,
                ClipboardList,
              ],
              [
                "To confirm",
                data?.stats?.find((s) => s._id === "placed")?.count || 0,
                Box,
              ],
              [
                "On the way",
                data?.stats?.find((s) => s._id === "shipped")?.count || 0,
                Truck,
              ],
            ].map(([label, value, Icon]) => {
              const Component = Icon as typeof Box;
              return (
                <div key={String(label)} className="account-stat">
                  <Component className="h-5 w-5 text-gold-700" />
                  <p className="mt-3 font-display text-3xl text-forest-800">
                    {String(value)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{String(label)}</p>
                </div>
              );
            })}
          </div>
          <div className="account-panel">
            <div className="flex flex-wrap items-end gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuery(search.trim());
                  setPage(1);
                }}
                className="flex min-w-0 flex-1 items-end gap-2"
              >
                <TextField
                  label="Find an order"
                  placeholder="Order number, name or phone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  wrapperClassName="min-w-0 flex-1"
                  maxLength={80}
                />
                <Button
                  type="submit"
                  aria-label="Search orders"
                  icon={<Search className="h-4 w-4" />}
                >
                  Find
                </Button>
              </form>
              <SelectField
                label="Status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All statuses" },
                  ...Object.entries(STATUS).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
              />
              <Button
                variant="outline"
                onClick={() => setTick((t) => t + 1)}
                icon={
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                }
              >
                Refresh
              </Button>
            </div>
            <AppLink
              to="admin"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest-800"
            >
              Product and price administration{" "}
              <ExternalLink className="h-4 w-4" />
            </AppLink>
          </div>
          <ErrorNotice error={error} />
          {loading && !data ? (
            <Loading />
          ) : (
            <div className="space-y-3">
              {data?.orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => open(o)}
                  className="order-card w-full text-left cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-forest-800">
                        {o.orderId}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {date(o.createdAt, true)}
                      </p>
                    </div>
                    <StatusBadge order={o} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {o.customer.name} · {o.address.city}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {o.items.reduce((n, i) => n + i.quantity, 0)} packs ·{" "}
                        {PAYMENT_STATUS[o.payment.status]}
                      </p>
                    </div>
                    <p className="font-semibold text-forest-800">
                      {money(o.totals.total)}
                    </p>
                  </div>
                </button>
              ))}
              {data && !data.orders.length && (
                <div className="account-panel py-10 text-center text-muted">
                  No orders match your search.
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <p className="text-sm text-muted">
              {data?.total || 0} orders · Page {page}
            </p>
            <Button
              variant="outline"
              disabled={!data || page * 20 >= data.total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
          <Dialog
            open={!!selected}
            onClose={() => !busy && setSelected(null)}
            label="Manage order"
          >
            <div className="max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
              {selected && (
                <>
                  <div className="flex flex-wrap justify-between gap-3">
                    <h2 className="font-display text-2xl text-forest-800">
                      {selected.orderId}
                    </h2>
                    <StatusBadge order={selected} />
                  </div>
                  <p className="mt-4 font-semibold">
                    {selected.address.name} · {selected.address.phone}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {formatAddress(selected.address)}
                  </p>
                  <ul className="mt-5 divide-y divide-line">
                    {selected.items.map((i) => (
                      <li key={i.id} className="flex items-center gap-3 py-3">
                        <ProductThumb item={i} />
                        <p className="flex-1 text-sm">
                          {i.productName}
                          <br />
                          {i.packSize} × {i.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          {money(i.price * i.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex justify-between border-t border-line pt-4 font-semibold">
                    <span>Total including delivery</span>
                    <span>{money(selected.totals.total)}</span>
                  </p>
                  <p className="mt-3 rounded-xl bg-cream p-3 text-sm">
                    {selected.payment.method.toUpperCase()} ·{" "}
                    {PAYMENT_STATUS[selected.payment.status]}
                    {selected.payment.reference &&
                      ` · ${selected.payment.reference}`}
                  </p>
                  <form onSubmit={save} className="mt-6 space-y-4">
                    <SelectField
                      label="Next order status"
                      value={next}
                      onChange={(e) => setNext(e.target.value)}
                      options={[selected.status, ...NEXT[selected.status]].map(
                        (value) => ({ value, label: STATUS[value] }),
                      )}
                    />
                    <TextField
                      label="Customer update"
                      hint="Visible in the customer's order timeline."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      maxLength={300}
                    />
                    <TextField
                      label="Dispatch / tracking reference"
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      maxLength={150}
                    />
                    {selected.payment.status !== "verified" &&
                      selected.status !== "cancelled" &&
                      selected.payment.method !== "card" && (
                        <>
                          <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
                            <input
                              type="checkbox"
                              checked={verify}
                              onChange={(e) => setVerify(e.target.checked)}
                              className="h-5 w-5 accent-forest-800"
                            />
                            I checked the bank transfer or received cash
                          </label>
                          {verify && (
                            <TextField
                              label="Bank reference or cash receipt"
                              required
                              minLength={6}
                              maxLength={100}
                              value={reference}
                              onChange={(e) => setReference(e.target.value)}
                              hint="Recorded in the payment audit. Verify receipt before confirming."
                            />
                          )}
                        </>
                      )}
                    <ErrorNotice error={actionError} />
                    <Button type="submit" block loading={busy}>
                      Save order update
                    </Button>
                  </form>
                </>
              )}
            </div>
          </Dialog>
        </>
      )}
    </AccountShell>
  );
}
