import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {loadPrices} from './data/prices';
import {loadCatalog} from './data/catalog';

// Fetch the product catalog and today's prices before the first render so nobody sees yesterday's price flash by.
// loadPrices never throws and gives up after a couple of seconds.
// The catalog adds products first, then prices and stock are applied to everything.
loadCatalog().then(loadPrices).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
