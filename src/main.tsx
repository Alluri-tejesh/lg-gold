import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {loadPrices} from './data/prices';

// Fetch today's prices before the first render so nobody sees yesterday's price flash by.
// loadPrices never throws and gives up after a couple of seconds.
loadPrices().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
