import React from 'react';
import { RefreshCw, MessageCircle, Phone } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl, phoneTelHref } from '../../config/brandConfig';

const RELOAD_KEY = 'lg_gold_reloaded_for_update';

/** True for the error a browser gives when a page file from an older version of the site no longer exists. */
export const isStaleBuildError = (e: unknown) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i.test(
    String((e as Error)?.message ?? e),
  );

/**
 * After a new version is published, an open tab may ask for files that are gone. Reload to get the new version,
 * but at most once a minute: if the file is missing for another reason (offline, a blocked request), reloading
 * again would loop forever, so the error message is shown instead.
 */
export const reloadOnceForUpdate = (): boolean => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < 60_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
};

interface State {
  error: unknown;
}

/**
 * Catches anything that breaks while showing a page, so visitors get a friendly message with a way to order
 * instead of a blank screen. `resetKey` (the page address) clears the error when the visitor goes elsewhere.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode; resetKey?: string }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    if (isStaleBuildError(error) && reloadOnceForUpdate()) return;
    console.error('Page error', error, info.componentStack);
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="bg-grain">
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center" role="alert">
          <h1 className="font-display text-4xl text-forest-800">Something went wrong on this page</h1>
          <p className="mt-4 text-lg text-muted">
            Please reload. If it keeps happening, message or call us and we will take your order directly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest-800 px-6 font-semibold text-white hover:bg-forest-700 cursor-pointer"
            >
              <RefreshCw className="h-5 w-5" /> Reload
            </button>
            <a
              href={createWhatsAppUrl('Hi LG Gold Team, your website showed an error. I would like to place an order.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-white"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
            <a href={phoneTelHref()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold text-forest-800 ring-1 ring-forest-800/30">
              <Phone className="h-5 w-5" /> {BRAND_CONFIG.contact.primaryPhone}
            </a>
          </div>
        </div>
      </section>
    );
  }
}
