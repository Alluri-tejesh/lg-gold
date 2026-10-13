import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {loadPrices} from './data/prices';
import {loadCatalog} from './data/catalog';
import {reloadOnceForUpdate} from './components/common/ErrorBoundary';

// Vite reports a page file that failed to preload (usually: a new version was published while this tab was open).
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  reloadOnceForUpdate();
});

// Fetch the product catalog and today's prices before the first render so nobody sees yesterday's price flash by.
// Both give up quickly on a slow connection (the built-in prices are used then), and index.html shows a branded
// loading screen meanwhile. The catalog adds products first, then prices and stock are applied to everything.
loadCatalog().then(loadPrices).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
