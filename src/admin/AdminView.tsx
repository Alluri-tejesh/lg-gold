import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ClipboardList,
  ExternalLink,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  Users,
} from 'lucide-react';
import { ApiError } from '../customer/api';
import { formatPriceDate } from '../data/prices';
import type { StoreSettings, Storefront } from '../data/storefront';
import { LogoMark } from '../components/ui/Logo';
import { BrandLoader } from '../components/ui/BrandLoader';
import { Button } from '../components/ui/Button';
import { Field, TextField, inputClass } from '../components/ui/Field';
import { toast } from '../components/ui/Toast';
import { navigate } from '../router';
import { AdminError, adminLogin, adminLogout, adminMe, AdminMe, loadStore, saveStore, uploadImage } from './api';
import { EditProduct, buildModel, hasChanges, serialize, validate } from './model';
import { AddProductForm, ProductEditor } from './ProductEditor';
import { OrdersPanel } from './OrdersPanel';
import { CustomersPanel } from './CustomersPanel';
import { SettingsPanel, settingsProblems } from './SettingsPanel';

const TABS = [
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'products', label: 'Products & prices', icon: Package },
  { id: 'add', label: 'Add a product', icon: Plus },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings2 },
] as const;
type Tab = (typeof TABS)[number]['id'];

/** The admin page (#admin): sign in with the admin username and password, then run the shop. */
export const AdminView: React.FC<{ tab?: string }> = ({ tab }) => {
  const [me, setMe] = useState<AdminMe | null>(null);
  const [error, setError] = useState('');

  const check = useCallback(async () => {
    setError('');
    try {
      setMe(await adminMe());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  if (error)
    return (
      <Centered>
        <AlertTriangle className="mx-auto h-10 w-10 text-danger" />
        <p className="mt-4 text-lg font-semibold text-forest-800">The shop server is not responding.</p>
        <p className="mt-2 text-muted">{error}</p>
        {import.meta.env.DEV && (
          <p className="mt-4 rounded-xl bg-gold-50 p-3 text-sm text-gold-700">
            On your computer, start the website and server together with <code>npm run dev</code>.
          </p>
        )}
        <Button className="mt-6" icon={<RefreshCw className="h-4 w-4" />} onClick={check}>
          Try again
        </Button>
      </Centered>
    );
  if (!me) return <Centered><BrandLoader small /></Centered>;
  if (!me.admin) return <SignIn configured={me.configured} onSignedIn={check} />;
  const current = (TABS.some((t) => t.id === tab) ? tab : 'orders') as Tab;
  return (
    <Dashboard
      username={me.username}
      sms={me.sms}
      tab={current}
      onExpired={() => {
        toast({ message: 'Your admin session ended. Please sign in again.', tone: 'info' });
        setMe({ ...me, admin: false });
      }}
      onSignOut={async () => {
        await adminLogout().catch(() => undefined);
        setMe({ ...me, admin: false });
      }}
    />
  );
};

const Centered: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="grid min-h-screen place-items-center bg-cream bg-grain px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center ring-1 ring-line shadow-soft">{children}</div>
  </main>
);

/* ------------------------------------------------------------------ Sign in */

const SignIn: React.FC<{ configured: boolean; onSignedIn: () => void }> = ({ configured, onSignedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) return setError('Enter your username and password.');
    setBusy(true);
    try {
      await adminLogin(username, password);
      onSignedIn();
    } catch (err) {
      setError((err as Error).message);
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-forest-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-grain-light opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gold-500/20 blur-3xl" aria-hidden="true" />
      <div className="relative w-full max-w-sm animate-pop-in">
        <div className="text-center">
          <LogoMark className="mx-auto h-16 w-16" />
          <h1 className="mt-4 font-display text-4xl text-white">LG Gold Admin</h1>
          <p className="mt-2 text-cream/70">Orders, prices, stock and products.</p>
        </div>

        <form onSubmit={submit} noValidate className="mt-8 space-y-5 rounded-3xl bg-white p-6 shadow-lift sm:p-8">
          {!configured && (
            <p className="rounded-2xl bg-gold-50 p-4 text-sm text-gold-700 ring-1 ring-gold-300">
              The admin password is not set yet. Add <code>ADMIN_USERNAME</code> and <code>ADMIN_PASSWORD</code> to <code>server/.env</code> and restart the server.
            </p>
          )}
          {error && (
            <p role="alert" className="flex gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
          <TextField
            label="Username"
            autoComplete="username"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <Field label="Password">
            {({ id }) => (
              <div className="relative">
                <input
                  id={id}
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={`${inputClass} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-forest-800/5 cursor-pointer"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
          </Field>
          <Button type="submit" size="lg" block loading={busy} disabled={!configured} icon={!busy ? <LogIn className="h-5 w-5" /> : undefined}>
            Sign in
          </Button>
          <p className="text-center text-xs text-muted">You stay signed in on this device for 12 hours.</p>
        </form>
        <p className="mt-6 text-center">
          <a href="#home" className="text-sm font-semibold text-cream/70 hover:text-white">
            ← Back to the shop
          </a>
        </p>
      </div>
    </main>
  );
};

/* ------------------------------------------------------------------ Dashboard */

const Dashboard: React.FC<{ username: string; sms: AdminMe['sms']; tab: Tab; onExpired: () => void; onSignOut: () => void }> = ({
  username,
  sms,
  tab,
  onExpired,
  onSignOut,
}) => {
  const [store, setStore] = useState<Storefront | null>(null);
  const [loadError, setLoadError] = useState('');
  const [products, setProducts] = useState<EditProduct[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [showProblems, setShowProblems] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const s = await loadStore();
      setStore(s);
      setProducts(buildModel(s.catalog, s.prices));
      setSettings(s.settings);
    } catch (e) {
      setLoadError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const original = useMemo(() => (store ? buildModel(store.catalog, store.prices) : []), [store]);
  const settingsDirty = !!store && !!settings && JSON.stringify(settings) !== JSON.stringify(store.settings);
  const dirty = !!store && (hasChanges(products, store) || settingsDirty);
  const problems = useMemo(() => validate(products), [products]);
  const settingErrors = settings ? settingsProblems(settings) : {};
  const problemCount = Object.values(problems).reduce<number>((n, list: string[]) => n + list.length, 0) + Object.keys(settingErrors).length;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const go = (t: Tab) => navigate('admin', t === 'orders' ? undefined : t);

  const save = async () => {
    if (!store || !settings) return;
    if (problemCount) {
      setShowProblems(true);
      const first = Object.keys(problems)[0];
      if (first) {
        if (tab !== 'products') go('products');
        requestAnimationFrame(() => document.getElementById(`product-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      } else if (tab !== 'settings') go('settings');
      return;
    }
    setSaving(true);
    try {
      // New photos are uploaded first; each gets its own address on the site.
      const ready: EditProduct[] = [];
      for (const p of products) {
        if (!p.newImage) {
          ready.push(p);
          continue;
        }
        const path = await uploadImage(p.newImage.blob);
        ready.push({ ...p, image: path, newImage: undefined });
      }
      setProducts(ready);
      const out = serialize(ready, store);
      const next = await saveStore({ version: store.version, catalog: out.catalog, prices: out.prices, settings });
      setStore(next);
      setProducts(buildModel(next.catalog, next.prices));
      setSettings(next.settings);
      setShowProblems(false);
      toast({ message: 'Saved. The website shows your changes now.' });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return onExpired();
      toast({ message: e instanceof AdminError || e instanceof ApiError ? e.message : 'Saving failed. Your changes are still here; try again.', tone: 'error', duration: 9000 });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!store) return;
    setProducts(buildModel(store.catalog, store.prices));
    setSettings(store.settings);
    setShowProblems(false);
    toast({ message: 'Changes discarded.', tone: 'info' });
  };

  const needsStore = tab === 'products' || tab === 'add' || tab === 'settings';

  return (
    <div className="min-h-screen bg-cream pb-40">
      <header className="sticky top-0 z-30 bg-forest-900 text-cream shadow-lift">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <LogoMark className="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-tight text-white">LG Gold Admin</p>
            <p className="truncate text-xs text-cream/60">Signed in as {username}</p>
          </div>
          <a
            href="#home"
            target="_blank"
            rel="noopener"
            className="hidden min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-cream/80 hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            View website <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => {
              if (!dirty || window.confirm('You have unsaved changes. Sign out anyway?')) onSignOut();
            }}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-cream/80 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
        <nav aria-label="Admin sections" className="mx-auto max-w-6xl overflow-x-auto px-2 scrollbar-none sm:px-4">
          <div className="flex gap-1 pb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-current={tab === t.id ? 'page' : undefined}
                onClick={() => go(t.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-semibold transition-colors cursor-pointer ${
                  tab === t.id ? 'bg-white text-forest-900' : 'text-cream/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
                {t.id === 'products' && store && <span className="text-xs opacity-60">{products.length}</span>}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {tab === 'orders' && <OrdersPanel onExpired={onExpired} />}
        {tab === 'customers' && <CustomersPanel onExpired={onExpired} />}

        {needsStore &&
          (loadError ? (
            <div className="mt-6 rounded-3xl bg-white p-8 text-center ring-1 ring-line">
              <AlertTriangle className="mx-auto h-10 w-10 text-danger" />
              <p className="mt-4 text-lg font-semibold text-forest-800">{loadError}</p>
              <Button className="mt-6" icon={<RefreshCw className="h-4 w-4" />} onClick={load}>
                Try again
              </Button>
            </div>
          ) : !store || !settings ? (
            <div className="space-y-4" aria-busy="true" aria-label="Loading products">
              {[0, 1].map((i) => (
                <div key={i} className="h-72 skeleton rounded-3xl" />
              ))}
            </div>
          ) : tab === 'settings' ? (
            <SettingsPanel value={settings} onChange={setSettings} errors={showProblems ? settingErrors : {}} sms={sms} />
          ) : tab === 'add' ? (
            <AddProductForm
              existingSlugs={products.map((p) => p.slug)}
              onAdd={(p) => {
                setProducts([...products, p]);
                go('products');
                toast({ message: `${p.name} added. Press Save changes to put it on the website.` });
                setTimeout(() => document.getElementById(`product-${p.slug}`)?.scrollIntoView({ behavior: 'smooth' }), 300);
              }}
            />
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl text-forest-800 sm:text-4xl">Products &amp; prices</h1>
                  <p className="mt-1 text-muted">
                    Prices on the website are dated {formatPriceDate(store.prices.updated ?? null) ?? 'not set'}. Saving sets today’s date.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw className="h-4 w-4" />}
                  onClick={() => (!dirty || window.confirm('Reload and lose your unsaved changes?')) && load()}
                >
                  Reload
                </Button>
              </div>
              <div className="space-y-6">
                {products.map((p, i) => (
                  <ProductEditor
                    key={p.slug}
                    product={p}
                    original={original.find((o) => o.slug === p.slug)}
                    problems={showProblems ? problems[p.slug] : undefined}
                    onChange={(next) => setProducts(products.map((x, j) => (j === i ? next : x)))}
                    onRemove={p.builtIn ? undefined : () => setProducts(products.filter((_, j) => j !== i))}
                  />
                ))}
              </div>
            </>
          ))}
      </main>

      {/* Save bar: appears as soon as something changes, on any tab. */}
      {store && (dirty || saving) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl pb-safe shadow-[0_-12px_32px_-12px_rgb(23_74_50/0.25)] animate-slide-up">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
            <div className="flex-1">
              <p className="font-semibold text-forest-800">You have unsaved changes</p>
              <p className={`text-sm ${showProblems && problemCount ? 'font-medium text-danger' : 'text-muted'}`}>
                {showProblems && problemCount
                  ? `Fix ${problemCount} ${problemCount === 1 ? 'problem' : 'problems'} marked in red, then save.`
                  : 'Customers see them as soon as you save.'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={discard} disabled={saving}>
                Discard
              </Button>
              <Button size="lg" onClick={save} loading={saving} icon={!saving ? <Save className="h-5 w-5" /> : undefined} className="flex-1 sm:flex-none">
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
