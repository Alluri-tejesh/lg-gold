import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyRound, LogOut, ExternalLink, Eye, EyeOff, RefreshCw, Rocket, CheckCircle2, AlertTriangle, Loader2, Plus, Package, ChevronDown } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';
import type { Catalog } from '../data/catalog';
import type { PriceTable } from '../data/prices';
import { formatPriceDate } from '../data/prices';
import { LogoMark } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Field, TextField, inputClass } from '../components/ui/Field';
import { toast } from '../components/ui/Toast';
import { AdminError, Auth, ConflictError, DeployState, commitFiles, deployState, headSha, readText, verifyAccess, FileChange } from './github';
import { EditProduct, buildModel, fileText, hasChanges, serialize, validate } from './model';
import { AppLink } from '../components/ui/AppLink';
import { AddProductForm, ProductEditor } from './ProductEditor';

const AUTH_KEY = 'lg_gold_admin_auth';
const CATALOG_PATH = 'public/catalog.json';
const PRICES_PATH = 'public/prices.json';

const loadAuth = (): Auth | null => {
  for (const store of [localStorage, sessionStorage]) {
    try {
      const raw = store.getItem(AUTH_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* storage blocked: sign in each visit */
    }
  }
  return null;
};

const saveAuth = (auth: Auth | null, remember = false) => {
  try {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    if (auth) (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, JSON.stringify(auth));
  } catch {
    /* ignore */
  }
};

/** The admin page: sign in once, then change prices, stock, pack sizes and products. */
export const AdminView: React.FC = () => {
  const [auth, setAuth] = useState<Auth | null>(loadAuth);
  return auth ? (
    <Dashboard
      auth={auth}
      onSignOut={() => {
        saveAuth(null);
        setAuth(null);
      }}
    />
  ) : (
    <SignIn
      onSignedIn={(a, remember) => {
        saveAuth(a, remember);
        setAuth(a);
      }}
    />
  );
};

/* ------------------------------------------------------------------ Sign in */

const SignIn: React.FC<{ onSignedIn: (a: Auth, remember: boolean) => void }> = ({ onSignedIn }) => {
  const [repo, setRepo] = useState(BRAND_CONFIG.admin.repo);
  const [token, setToken] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [help, setHelp] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const auth = { repo: repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, ''), token: token.trim() };
    if (!auth.repo || !auth.token) return setError('Enter the repository and your access key.');
    setBusy(true);
    try {
      await verifyAccess(auth);
      onSignedIn(auth, remember);
    } catch (err) {
      setError(err instanceof AdminError ? err.message : 'Sign-in failed. Check the details and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream bg-grain px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <LogoMark className="mx-auto h-16 w-16" />
          <h1 className="mt-4 font-display text-4xl text-forest-800">LG Gold Admin</h1>
          <AppLink to="admin-orders" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-800 px-5 text-sm font-semibold text-white">Open order administration <ExternalLink className="h-4 w-4" /></AppLink>
          <p className="mt-2 text-muted">Change prices, stock, pack sizes and products. Publish to GitHub, then deploy the updated shop.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
          {error && (
            <p role="alert" className="flex gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
          <TextField
            label="Website repository on GitHub"
            required
            placeholder="owner/repository"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            hint="As in github.com/owner/repository"
          />
          <Field label="Access key" required>
            {({ id }) => (
              <div className="relative">
                <input
                  id={id}
                  type={show ? 'text' : 'password'}
                  placeholder="github_pat_…"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoComplete="current-password"
                  spellCheck={false}
                  required
                  className={`${inputClass} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Hide access key' : 'Show access key'}
                  className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-forest-800/5 cursor-pointer"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
          </Field>
          <label className="flex min-h-11 items-center gap-3 text-[15px] text-ink-soft cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-5 w-5 accent-forest-800" />
            Keep me signed in on this device
          </label>
          <Button type="submit" size="lg" block loading={busy} icon={!busy ? <KeyRound className="h-5 w-5" /> : undefined}>
            Sign in
          </Button>
        </form>

        <div className="mt-5 rounded-3xl bg-white ring-1 ring-line">
          <button
            type="button"
            onClick={() => setHelp(!help)}
            aria-expanded={help}
            className="flex min-h-14 w-full items-center justify-between px-6 text-left font-semibold text-forest-800 cursor-pointer"
          >
            First time? Get your access key (2 minutes)
            <ChevronDown className={`h-5 w-5 text-muted transition-transform ${help ? 'rotate-180' : ''}`} />
          </button>
          {help && (
            <ol className="list-decimal space-y-2.5 px-6 pb-6 pl-11 text-[15px] leading-relaxed text-ink-soft">
              <li>
                Sign in to GitHub and open{' '}
                <a
                  href="https://github.com/settings/personal-access-tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-forest-700 underline underline-offset-2"
                >
                  New access token
                </a>
                .
              </li>
              <li>Name it “LG Gold admin” and pick an expiry, for example 1 year.</li>
              <li>
                Under <strong>Repository access</strong> choose <strong>Only select repositories</strong> and pick the website repository.
              </li>
              <li>
                Under <strong>Permissions</strong> set <strong>Contents</strong> to <strong>Read and write</strong>. Optionally set{' '}
                <strong>Actions</strong> to <strong>Read-only</strong> to see validation status.
              </li>
              <li>Press <strong>Generate token</strong>, copy it and paste it above.</li>
              <li className="list-none -ml-5 rounded-xl bg-gold-50 p-3 text-sm text-gold-700 ring-1 ring-gold-300">
                Treat the key like a password: anyone who has it can change your website. If it leaks, delete it on the same GitHub page.
              </li>
            </ol>
          )}
        </div>
      </div>
    </main>
  );
};

/* ------------------------------------------------------------------ Dashboard */

interface Loaded {
  sha: string;
  catalog: Catalog;
  prices: PriceTable;
  catalogText: string | null;
  pricesText: string | null;
}

const Dashboard: React.FC<{ auth: Auth; onSignOut: () => void }> = ({ auth, onSignOut }) => {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState('');
  const [products, setProducts] = useState<EditProduct[]>([]);
  const [tab, setTab] = useState<'products' | 'add'>('products');
  const [publishing, setPublishing] = useState(false);
  const [showProblems, setShowProblems] = useState(false);
  const [deploy, setDeploy] = useState<{ sha: string; state: DeployState; url?: string } | null>(null);

  const load = useCallback(async () => {
    setLoadError('');
    setLoaded(null);
    try {
      const sha = await headSha(auth);
      const [catalogText, pricesText] = await Promise.all([readText(auth, CATALOG_PATH, sha), readText(auth, PRICES_PATH, sha)]);
      const catalog: Catalog = catalogText ? JSON.parse(catalogText) : { products: [] };
      const prices: PriceTable = pricesText ? JSON.parse(pricesText) : { prices: {} };
      setLoaded({ sha, catalog, prices, catalogText, pricesText });
      setProducts(buildModel(catalog, prices));
    } catch (e) {
      setLoadError(e instanceof AdminError ? e.message : 'The products could not be loaded. Check your connection and try again.');
    }
  }, [auth]);

  useEffect(() => {
    load();
  }, [load]);

  const original = useMemo(() => (loaded ? buildModel(loaded.catalog, loaded.prices) : []), [loaded]);
  const dirty = !!loaded && hasChanges(products, loaded);
  const problems = useMemo(() => validate(products), [products]);
  const problemCount = Object.values(problems).reduce<number>((n, list: string[]) => n + list.length, 0);

  // Warn before leaving with unpublished changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  // Follow the website rebuild after a publish until it is live (or fails).
  useEffect(() => {
    if (!deploy || deploy.state === 'live' || deploy.state === 'failed' || deploy.state === 'unknown') return;
    let tries = 0;
    const timer = setInterval(async () => {
      tries++;
      const next = await deployState(auth, deploy.sha);
      if (next.state !== 'building' || tries > 45) {
        clearInterval(timer);
        setDeploy({ sha: deploy.sha, ...(tries > 45 && next.state === 'building' ? { state: 'unknown' } : next) });
      } else if (next.url && next.url !== deploy.url) setDeploy({ ...deploy, url: next.url });
    }, 8000);
    return () => clearInterval(timer);
  }, [deploy?.sha, deploy?.state]);

  const publish = async () => {
    if (!loaded) return;
    if (problemCount) {
      setShowProblems(true);
      const first = Object.keys(problems)[0];
      document.getElementById(`product-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setPublishing(true);
    try {
      // Someone (or the GitHub price form) may have changed the files since this page loaded them.
      const latest = await headSha(auth);
      if (latest !== loaded.sha) {
        const [c, p] = await Promise.all([readText(auth, CATALOG_PATH, latest), readText(auth, PRICES_PATH, latest)]);
        if (c !== loaded.catalogText || p !== loaded.pricesText) {
          throw new ConflictError('Prices or products were changed somewhere else since you opened this page. Reload to get the latest, then make your change again.');
        }
      }
      const out = serialize(products, loaded);
      const files: FileChange[] = [
        { path: CATALOG_PATH, text: fileText(out.catalog) },
        { path: PRICES_PATH, text: fileText(out.prices) },
        ...products.filter((p) => p.newImage).map((p) => ({ path: `public/${p.newImage!.sitePath}`, base64: p.newImage!.base64 })),
      ];
      const changedNames = products.filter((p) => JSON.stringify(p) !== JSON.stringify(original.find((o) => o.slug === p.slug))).map((p) => p.shortName || p.name);
      const sha = await commitFiles(auth, latest, files, `Admin: update ${changedNames.join(', ') || 'products'}`);

      // What is on GitHub now becomes the new starting point.
      const catalogText = fileText(out.catalog);
      const pricesText = fileText(out.prices);
      setLoaded({ sha, catalog: out.catalog, prices: out.prices, catalogText, pricesText });
      setProducts(buildModel(out.catalog, out.prices));
      setDeploy({ sha, state: 'building' });
      setShowProblems(false);
      toast({ message: 'Saved to GitHub. Deploy the updated shop on your backend host.' });
    } catch (e) {
      toast({ message: e instanceof AdminError ? e.message : 'Publishing failed. Your changes are still here; try again.', tone: 'error', duration: 9000 });
    } finally {
      setPublishing(false);
    }
  };

  const discard = () => {
    if (!loaded) return;
    setProducts(buildModel(loaded.catalog, loaded.prices));
    setShowProblems(false);
    toast({ message: 'Changes discarded.', tone: 'info' });
  };

  return (
    <div className="min-h-screen bg-cream pb-40">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-forest-900 text-cream shadow-lift">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <LogoMark className="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-tight text-white">LG Gold Admin</p>
            <p className="truncate text-xs text-cream/60">{auth.repo}</p>
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
              if (!dirty || window.confirm('You have unpublished changes. Sign out anyway?')) onSignOut();
            }}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-cream/80 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <AppLink to="admin-orders" className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-800 px-5 text-sm font-semibold text-white">Open order administration <ExternalLink className="h-4 w-4" /></AppLink>
        {/* Rebuild status after a publish */}
        {deploy && <DeployBanner deploy={deploy} repo={auth.repo} onClose={() => setDeploy(null)} />}

        {loadError ? (
          <div className="mt-10 rounded-3xl bg-white p-8 text-center ring-1 ring-line">
            <AlertTriangle className="mx-auto h-10 w-10 text-danger" />
            <p className="mt-4 text-lg font-semibold text-forest-800">{loadError}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button icon={<RefreshCw className="h-4 w-4" />} onClick={load}>
                Try again
              </Button>
              <Button variant="outline" onClick={onSignOut}>
                Sign in again
              </Button>
            </div>
          </div>
        ) : !loaded ? (
          <div className="mt-6 space-y-4" aria-busy="true" aria-label="Loading products">
            {[0, 1].map((i) => (
              <div key={i} className="h-72 skeleton rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl text-forest-800 sm:text-4xl">Products &amp; prices</h1>
                <p className="mt-1 text-muted">
                  Prices on the website are dated {formatPriceDate(loaded.prices.updated ?? null) ?? 'not set'}. Publishing sets today’s date.
                </p>
              </div>
              <Button variant="ghost" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => (!dirty || window.confirm('Reload and lose your unpublished changes?')) && load()}>
                Reload
              </Button>
            </div>

            <div role="tablist" aria-label="Admin sections" className="mb-6 inline-flex rounded-full bg-white p-1 ring-1 ring-line">
              {[
                { id: 'products' as const, label: `My products (${products.length})`, icon: Package },
                { id: 'add' as const, label: 'Add a product', icon: Plus },
              ].map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors cursor-pointer ${
                    tab === t.id ? 'bg-forest-800 text-white' : 'text-forest-800 hover:bg-forest-800/5'
                  }`}
                >
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </div>

            {tab === 'add' ? (
              <AddProductForm
                existingSlugs={products.map((p) => p.slug)}
                onAdd={(p) => {
                  setProducts([...products, p]);
                  setTab('products');
                  toast({ message: `${p.name} added to your list. Press Publish to put it on the website.` });
                  requestAnimationFrame(() => document.getElementById(`product-${p.slug}`)?.scrollIntoView({ behavior: 'smooth' }));
                }}
              />
            ) : (
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
            )}
          </>
        )}
      </main>

      {/* Publish bar */}
      {loaded && (dirty || publishing) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl pb-safe shadow-[0_-12px_32px_-12px_rgb(23_74_50/0.25)] animate-slide-up">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
            <div className="flex-1">
              <p className="font-semibold text-forest-800">You have unpublished changes</p>
              <p className={`text-sm ${showProblems && problemCount ? 'font-medium text-danger' : 'text-muted'}`}>
                {showProblems && problemCount
                  ? `Fix ${problemCount} ${problemCount === 1 ? 'problem' : 'problems'} marked in red, then publish.`
                  : 'Publish to GitHub, then deploy your backend host to update the shop.'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={discard} disabled={publishing}>
                Discard
              </Button>
              <Button size="lg" onClick={publish} loading={publishing} icon={!publishing ? <Rocket className="h-5 w-5" /> : undefined} className="flex-1 sm:flex-none">
                Publish changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DeployBanner: React.FC<{ deploy: { state: DeployState; url?: string }; repo: string; onClose: () => void }> = ({ deploy, repo, onClose }) => {
  const actionsUrl = deploy.url ?? `https://github.com/${repo}/actions`;
  const view = {
    building: {
      icon: <Loader2 className="h-5 w-5 animate-spin text-gold-600" />,
      title: 'Checking your changes…',
      body: 'Your changes are saved. GitHub is validating the app.',
      tone: 'bg-gold-50 ring-gold-300',
    },
    live: {
      icon: <CheckCircle2 className="h-5 w-5 text-forest-700" />,
      title: 'Live on the website',
      body: 'Visitors now see your changes (they may need to refresh the page).',
      tone: 'bg-forest-50 ring-forest-200',
    },
    failed: {
      icon: <AlertTriangle className="h-5 w-5 text-danger" />,
      title: 'The website could not be rebuilt',
      body: 'Your changes are saved, but the site update failed. Open the details on GitHub, or ask your developer.',
      tone: 'bg-danger-50 ring-danger/30',
    },
    unknown: {
      icon: <CheckCircle2 className="h-5 w-5 text-forest-700" />,
      title: 'Saved',
      body: 'Saved to GitHub. Check your backend host deployment to confirm the updated shop is live.',
      tone: 'bg-forest-50 ring-forest-200',
    },
  }[deploy.state];

  return (
    <div role="status" className={`mb-6 flex items-start gap-3 rounded-2xl p-4 ring-1 animate-pop-in ${view.tone}`}>
      <span className="mt-0.5">{view.icon}</span>
      <div className="flex-1">
        <p className="font-semibold text-forest-800">{view.title}</p>
        <p className="text-sm text-ink-soft">
          {view.body}{' '}
          <a href={actionsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
            Details on GitHub
          </a>
        </p>
      </div>
      {deploy.state !== 'building' && (
        <button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-white cursor-pointer">
          Dismiss
        </button>
      )}
    </div>
  );
};
