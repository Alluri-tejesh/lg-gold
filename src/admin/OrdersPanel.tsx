import React, { useEffect, useState } from 'react';
import { Box, ClipboardList, MessageCircle, Phone, RefreshCw, Search, Truck, Wallet } from 'lucide-react';
import { ErrorNotice, Loading, ProductThumb, StatusBadge } from '../customer/AccountUI';
import { api, ApiError, date, formatAddress, money, OrderList, OrderStatus, PAYMENT_STATUS, SavedOrder, STATUS } from '../customer/api';
import { createWhatsAppUrl } from '../config/brandConfig';
import { Button } from '../components/ui/Button';
import { TextField, SelectField } from '../components/ui/Field';
import { Dialog } from '../components/ui/Dialog';
import { toast } from '../components/ui/Toast';

const NEXT: Record<OrderStatus, OrderStatus[]> = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['packing', 'cancelled'],
  packing: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const METHOD: Record<SavedOrder['payment']['method'], string> = {
  upi: 'UPI',
  card: 'Card / net banking',
  cod: 'Cash on delivery',
  later: 'Pay after confirmation',
};

/** A WhatsApp message to the customer about their order, already typed. */
const customerChat = (o: SavedOrder, text: string) => createWhatsAppUrl(text, o.address.phone);

const packs = (o: SavedOrder) => {
  const n = o.items.reduce((sum, i) => sum + i.quantity, 0);
  return `${n} ${n === 1 ? 'pack' : 'packs'}`;
};

/** The mill's order desk: find orders, confirm them, record payments and dispatch. */
export function OrdersPanel({ onExpired }: { onExpired: () => void }) {
  const [data, setData] = useState<OrderList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<SavedOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [next, setNext] = useState('');
  const [note, setNote] = useState('');
  const [tracking, setTracking] = useState('');
  const [reference, setReference] = useState('');
  const [verify, setVerify] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const result = await api<OrderList>(
          `/admin/orders?page=${page}${status === 'all' ? '' : `&status=${status}`}&search=${encodeURIComponent(query)}`,
        );
        if (live) {
          setData(result);
          setError('');
        }
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return onExpired();
        if (live) setError((e as Error).message);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [status, query, page, tick]);

  const open = (o: SavedOrder) => {
    setSelected(o);
    setNext(o.status);
    setNote('');
    setTracking(o.tracking || '');
    setReference(o.payment.reference || '');
    setVerify(false);
    setActionError('');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setActionError('');
    try {
      await api(`/admin/orders/${selected.id}`, 'PATCH', {
        version: selected.version,
        status: next,
        note,
        tracking,
        verifyPayment: verify,
        reference,
      });
      setSelected(null);
      setTick((t) => t + 1);
      toast({ message: 'Order updated. The customer sees the new status straight away.' });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return onExpired();
      setActionError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const count = (s: OrderStatus) => data?.stats?.find((x) => x._id === s)?.count || 0;
  const stats: [string, number, typeof Box, string][] = [
    ['All orders', data?.stats?.reduce((n, s) => n + s.count, 0) || 0, ClipboardList, 'all'],
    ['To confirm', count('placed'), Box, 'placed'],
    ['To pack', count('confirmed'), Wallet, 'confirmed'],
    ['On the way', count('shipped'), Truck, 'shipped'],
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value, Icon, filter]) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setStatus(filter);
              setPage(1);
            }}
            aria-pressed={status === filter}
            className={`account-stat text-left transition-shadow cursor-pointer ${status === filter ? 'ring-2 ring-forest-700' : 'hover:ring-1 hover:ring-gold-400'}`}
          >
            <Icon className="h-5 w-5 text-gold-700" />
            <p className="mt-3 text-3xl font-bold tabular text-forest-800">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </button>
        ))}
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
              placeholder="Order number, name or mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              wrapperClassName="min-w-0 flex-1"
              maxLength={80}
            />
            <Button type="submit" aria-label="Search orders" icon={<Search className="h-4 w-4" />}>
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
            options={[{ value: 'all', label: 'All statuses' }, ...Object.entries(STATUS).map(([value, label]) => ({ value, label }))]}
          />
          <Button variant="outline" onClick={() => setTick((t) => t + 1)} icon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}>
            Refresh
          </Button>
        </div>
      </div>

      <ErrorNotice error={error} />
      {loading && !data ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {data?.orders.map((o) => (
            <button key={o.id} onClick={() => open(o)} className="order-card w-full text-left cursor-pointer">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest-800">{o.orderId}</p>
                  <p className="mt-1 text-xs text-muted">{date(o.createdAt, true)}</p>
                </div>
                <StatusBadge order={o} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {o.address.name} · {o.address.city}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {packs(o)} · {METHOD[o.payment.method]} · {PAYMENT_STATUS[o.payment.status]}
                  </p>
                </div>
                <p className="text-lg font-bold tabular text-forest-800">{money(o.totals.total)}</p>
              </div>
            </button>
          ))}
          {data && !data.orders.length && (
            <div className="account-panel py-12 text-center text-muted">
              {query || status !== 'all' ? 'No orders match.' : 'No orders yet. New orders appear here the moment a customer places them.'}
            </div>
          )}
        </div>
      )}

      {data && data.total > 20 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <p className="text-sm text-muted">
            {data.total} orders · Page {page}
          </p>
          <Button variant="outline" disabled={page * 20 >= data.total} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      <Dialog open={!!selected} onClose={() => !busy && setSelected(null)} label="Manage order">
        <div className="max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
          {selected && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
                <h2 className="font-display text-2xl text-forest-800">{selected.orderId}</h2>
                <StatusBadge order={selected} />
              </div>
              <p className="mt-1 text-sm text-muted">Placed {date(selected.createdAt, true)}</p>

              <div className="mt-5 rounded-2xl bg-cream p-4">
                <p className="font-semibold text-forest-800">{selected.address.name}</p>
                <p className="mt-1 text-sm text-ink-soft">{formatAddress(selected.address)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`tel:${selected.address.phone}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-forest-800 ring-1 ring-line">
                    <Phone className="h-4 w-4" /> {selected.address.phone}
                  </a>
                  <a
                    href={customerChat(selected, `Hello ${selected.address.name}, this is LG Gold about your order ${selected.orderId}. `)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-whatsapp px-4 text-sm font-semibold text-white"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp customer
                  </a>
                </div>
              </div>

              <ul className="mt-5 divide-y divide-line">
                {selected.items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 py-3">
                    <ProductThumb item={i} />
                    <p className="flex-1 text-sm">
                      {i.productName}
                      <br />
                      <span className="text-muted">
                        {i.packSize} × {i.quantity}
                      </span>
                    </p>
                    <p className="text-sm font-semibold tabular">{money(i.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-2 space-y-1 border-t border-line pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="tabular">{selected.totals.delivery ? money(selected.totals.delivery) : 'Free'}</dd>
                </div>
                <div className="flex justify-between text-base font-bold text-forest-800">
                  <dt>Total</dt>
                  <dd className="tabular">{money(selected.totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 rounded-xl bg-gold-50 p-3 text-sm text-gold-700">
                {METHOD[selected.payment.method]} · {PAYMENT_STATUS[selected.payment.status]}
                {selected.payment.reference && ` · ref ${selected.payment.reference}`}
              </p>

              <form onSubmit={save} className="mt-6 space-y-4">
                <SelectField
                  label="Order status"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  options={[selected.status, ...NEXT[selected.status]].map((value) => ({ value, label: STATUS[value] }))}
                />
                <TextField label="Message for the customer" hint="Shown in their order timeline." value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} />
                <TextField label="Lorry / tracking reference" value={tracking} onChange={(e) => setTracking(e.target.value)} maxLength={150} />
                {selected.payment.status !== 'verified' && selected.status !== 'cancelled' && selected.payment.method !== 'card' && (
                  <>
                    <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
                      <input type="checkbox" checked={verify} onChange={(e) => setVerify(e.target.checked)} className="h-5 w-5 accent-forest-800" />
                      I checked the money arrived (UPI in the bank app, or cash received)
                    </label>
                    {verify && (
                      <TextField
                        label="UPI reference (UTR) or cash receipt number"
                        required
                        minLength={6}
                        maxLength={100}
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        hint="Kept with the order as proof of payment."
                      />
                    )}
                  </>
                )}
                <ErrorNotice error={actionError} />
                <Button type="submit" block size="lg" loading={busy}>
                  Save order update
                </Button>
              </form>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
