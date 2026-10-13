# LG Gold Rice

Rice storefront and customer platform for Sri Lakshmi Ganapathi Trading Company. React 19, Vite 6, Tailwind CSS 4, an Express API and MongoDB.

## Development

Use Node.js 22.12 or newer.

```
npm install
npm run dev:all
```

Open http://localhost:3000. This starts the shop, API and a real local MongoDB database with persistent storage in `.local/mongodb`. When a MongoDB Atlas URI is configured in `server/.env`, it uses Atlas instead.

If the frontend is already running, start just the API with `npm run dev:api`.

## Customer pages

- Sign-up / SMS OTP / password sign-in: `#register` / `#login`
- Account dashboard: `#account`
- Orders and tracking: `#orders` / `#order-detail/<id>`
- Saved addresses: `#addresses`
- Profile, email verification, mobile verification and passwords: `#profile` / `#security`
- Help: `#support`
- Order management: `#admin-orders` (administrator account required)
- Existing GitHub product and price administration: `#admin`

Orders are saved in MongoDB before the cart is cleared. Prices, shipping, account permissions and payment status are controlled by the server. Customers can track orders across devices, reorder current available packs and print an order summary. WhatsApp is optional for sharing and support.

Direct UPI QR/app links appear after an order is saved. Direct UPI remains pending until the mill verifies receipt; customers do not tick a paid checkbox or enter a UTR. Gateway payments use server-created orders, signature/amount checks and verified capture webhooks.

## Connect services and deploy

Read [Customer platform setup](docs/customer-platform.md) for **MongoDB Atlas, SMS OTP, email recovery, admin accounts, Razorpay and production hosting**. Copy `server/.env.example` to `server/.env` and fill in credentials locally; keep secrets off the frontend.

Development SMS/email messages are simulated in `.local/mail` when their providers are blank. Production requires real SMS/email credentials to deliver messages. No OTP is exposed by an API response.

This full-stack app needs a Node.js host. The Dockerfile builds the frontend and serves it with the API on the same HTTPS origin. GitHub Pages alone cannot host customer accounts or MongoDB orders. The GitHub workflow runs validation; configure your Node host separately for deployment.

## Checks

```
npm run lint
npm run check:data
npm run test:server
npm run build
```

The API tests run against an isolated MongoDB process and use simulated SMS and payment-provider responses.

## Store content

- Prices and stock: [Updating prices](docs/updating-prices.md)
- Product and pack sizes: [Products and photos](docs/products-and-photos.md)
- GitHub product admin: [Admin page](docs/admin-page.md)
- Business details and delivery rules: `src/config/brandConfig.ts`
- Theme, shared controls and customer motion: `src/index.css`, `src/components/ui`, `src/customer`

Build/development synchronizes the trusted server catalog and delivery rules from the existing product and brand configuration. GitHub product edits require the backend host to redeploy; order status updates are immediate database writes.
