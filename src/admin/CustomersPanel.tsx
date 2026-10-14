import React, { useEffect, useState } from 'react';
import { Copy, KeyRound, MessageCircle, Search } from 'lucide-react';
import { api, ApiError, date, money } from '../customer/api';
import { ErrorNotice, Loading } from '../customer/AccountUI';
import { createWhatsAppUrl } from '../config/brandConfig';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/Field';
import { Dialog } from '../components/ui/Dialog';
import { AdminCustomer } from './api';

/** Customer accounts, mainly to help someone who forgot their password. */
export function CustomersPanel({ onExpired }: { onExpired: () => void }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [list, setList] = useState<AdminCustomer[] | null>(null);
  const [error, setError] = useState('');
  const [resetFor, setResetFor] = useState<AdminCustomer | null>(null);
  const [temporary, setTemporary] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    setError('');
    api<{ customers: AdminCustomer[] }>(`/admin/customers?search=${encodeURIComponent(query)}`)
      .then((r) => live && setList(r.customers))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) return onExpired();
        if (live) setError((e as Error).message);
      });
    return () => {
      live = false;
    };
  }, [query]);

  const reset = async () => {
    if (!resetFor) return;
    setBusy(true);
    try {
      const r = await api<{ temporaryPassword: string }>(`/admin/customers/${resetFor.id}/reset-password`, 'POST');
      setTemporary(r.temporaryPassword);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return onExpired();
      setError((e as Error).message);
      setResetFor(null);
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    setResetFor(null);
    setTemporary('');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl text-forest-800 sm:text-4xl">Customers</h1>
        <p className="mt-1 text-muted">People with an account. If someone forgets their password, give them a temporary one here.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search.trim());
        }}
        className="account-panel flex items-end gap-2"
      >
        <TextField
          label="Find a customer"
          placeholder="Name, mobile or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          wrapperClassName="min-w-0 flex-1"
          maxLength={80}
        />
        <Button type="submit" icon={<Search className="h-4 w-4" />}>
          Find
        </Button>
      </form>
      <ErrorNotice error={error} />
      {!list ? (
        <Loading />
      ) : list.length === 0 ? (
        <div className="account-panel py-12 text-center text-muted">{query ? 'Nobody matches that search.' : 'No customer accounts yet.'}</div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((c) => (
            <li key={c.id} className="order-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-forest-800">{c.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">{c.phone || 'No mobile'}</p>
                  {c.email && <p className="truncate text-sm text-muted">{c.email}</p>}
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-100 font-bold text-gold-700">{c.name.charAt(0).toUpperCase()}</span>
              </div>
              <p className="mt-3 text-sm text-muted">
                {c.orders} {c.orders === 1 ? 'order' : 'orders'}
                {c.spent ? ` · ${money(c.spent)}` : ''} · joined {date(c.createdAt)}
              </p>
              <Button variant="outline" size="sm" className="mt-4" icon={<KeyRound className="h-4 w-4" />} onClick={() => setResetFor(c)}>
                Reset password
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!resetFor} onClose={() => !busy && close()} label="Reset password">
        <div className="p-6 sm:p-8">
          {resetFor && !temporary && (
            <>
              <h2 className="font-display text-2xl text-forest-800">Reset {resetFor.name}’s password?</h2>
              <p className="mt-3 text-ink-soft">
                They get a temporary password to sign in with, and are signed out everywhere else. They can change it in their account afterwards.
              </p>
              <div className="mt-6 flex gap-3">
                <Button variant="ghost" onClick={close}>
                  Cancel
                </Button>
                <Button onClick={reset} loading={busy} className="flex-1">
                  Create temporary password
                </Button>
              </div>
            </>
          )}
          {resetFor && temporary && (
            <>
              <h2 className="font-display text-2xl text-forest-800">Temporary password</h2>
              <p className="mt-3 text-ink-soft">Send this to {resetFor.name}. It is shown only once.</p>
              <p className="mt-5 rounded-2xl bg-cream p-5 text-center font-mono text-2xl font-bold tracking-wider text-forest-800 select-all">{temporary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  icon={<Copy className="h-4 w-4" />}
                  onClick={() => navigator.clipboard?.writeText(temporary)}
                >
                  Copy
                </Button>
                {resetFor.phone && (
                  <Button
                    variant="whatsapp"
                    icon={<MessageCircle className="h-4 w-4" />}
                    href={createWhatsAppUrl(
                      `Hello ${resetFor.name}, this is LG Gold. Your temporary password is ${temporary}\n\nSign in with your mobile number and this password, then change it under Account › Security.`,
                      resetFor.phone,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Send on WhatsApp
                  </Button>
                )}
              </div>
              <Button variant="ghost" block className="mt-3" onClick={close}>
                Done
              </Button>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
