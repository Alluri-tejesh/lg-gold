# LG Gold Rice

Rice shop and order system for Sri Lakshmi Ganapathi Trading Company. React 19, Vite 6, Tailwind CSS 4, an Express API and MongoDB.

## Run it on your computer

Use Node.js 22.12 or newer.

```
npm install
npm run dev
```

Open http://localhost:3000. One command starts the website, the API and a local MongoDB database (stored in `.local/mongodb`, kept between runs). With a MongoDB Atlas address in `server/.env`, Atlas is used instead.

## Pages

| Who | Page | Address |
| --- | --- | --- |
| Customers | Sign in: SMS code to the mobile, or mobile/email + password | `#login` |
| | Create an account (by SMS code, or with a password) | `#register` |
| | Checkout (account required) | `#checkout` |
| | My account, orders, addresses, profile, password | `#account`, `#orders`, `#addresses`, `#profile`, `#security` |
| The mill | Admin: orders, products & prices, add a product, customers, settings | `#admin` |

## The admin page

Sign in at `#admin` with the username and password in `server/.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`). Everything saved there (prices, stock, pack sizes, new products, photos, delivery charges, UPI ID, cash on delivery) is stored in the database and shows on the website straight away. No GitHub, no tokens, no redeploy. See [docs/admin-page.md](docs/admin-page.md).

## Orders and payments

Customers need an account to order; the order is saved to it before the cart is emptied, and they follow it in My orders. Prices, delivery charges and payment status are decided by the server, never by the browser.

- **UPI**: after placing the order the customer gets a QR code (computer) or a one-tap link to GPay / PhonePe / Paytm with the amount filled in, paying the UPI ID set in Admin › Settings. The mill marks it paid in Admin › Orders once the money is in the bank.
- **Cash on delivery** and **pay after the mill confirms**: switchable in Settings.
- **Cards, net banking, wallets**: needs a Razorpay merchant account; add its keys to `server/.env`. See [docs/customer-platform.md](docs/customer-platform.md).
- **SMS sign-in codes**: work on your computer straight away (codes are printed in the `npm run dev` terminal). Switched on or off in Admin › Settings (off by default). Real SMS also needs a Twilio Verify account in `server/.env`.
- **WhatsApp**: optional. The confirmation screen offers to send the order to the mill on WhatsApp for a quicker reply.

## Going live

The shop needs a Node.js host (GitHub Pages cannot run the API or database). The `Dockerfile` builds the website and serves it together with the API on one HTTPS address. Setup for MongoDB Atlas, email, Razorpay and hosting: [docs/customer-platform.md](docs/customer-platform.md). Secrets go in the server environment only, never in `VITE_` variables.

## Checks

```
npm run lint
npm run check:data
npm run test:server
npm run build
```

The API tests run against an isolated MongoDB process with simulated email and payment-provider responses.

## Where things live

- Business details (name, phone, address, hours): `src/config/brandConfig.ts`
- Built-in products (HMT, JSR), their descriptions and specs: `src/data/products.ts`
- Starting data for a new database and the offline fallback: `public/catalog.json`, `public/prices.json`
- Theme and shared controls: `src/index.css`, `src/components/ui`
