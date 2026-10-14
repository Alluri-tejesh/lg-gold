import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {loadStorefront} from './data/storefront';
import {reloadOnceForUpdate} from './components/common/ErrorBoundary';

// Vite reports a page file that failed to preload (usually: a new version was published while this tab was open).
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  reloadOnceForUpdate();
});

// Fetch products, today's prices and shop settings (all edited on the admin page) before the first render,
// so nobody sees yesterday's price flash by. index.html shows a branded loading screen meanwhile.
loadStorefront().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
