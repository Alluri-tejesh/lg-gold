# Customer accounts, orders and MongoDB

## Run locally

Use Node.js 22.12 or newer. Run `npm install`, then `npm run dev` from the project root. The shop opens at http://localhost:3000 and the API listens on loopback port 4000. Vite proxies `/api` to the server.

When `MONGODB_URI` is absent, development starts a real local MongoDB process on port 27018. Its WiredTiger database persists in `.local/mongodb`. Do not delete that folder if you want to keep your local customers and orders. The local database is not exposed to your network. The first run downloads the MongoDB binary.

Routes:

| Page                                          | Address suffix             |
| --------------------------------------------- | -------------------------- |
| Sign in (mobile number or email + password)   | `#login`                   |
| Create an account                             | `#register`                |
| Checkout (account required)                   | `#checkout`                |
| Dashboard                                     | `#account`                 |
| Orders                                        | `#orders`                  |
| Order tracking and payment                    | `#order-detail/<order-id>` |
| Delivery addresses                            | `#addresses`               |
| Profile (name, mobile, email)                 | `#profile`                 |
| Password / sign out everywhere                | `#security`                |
| Customer help                                 | `#support`                 |
| Admin: orders, products, customers, settings  | `#admin`                   |

## Connect MongoDB Atlas

1. Create an Atlas project and cluster in your MongoDB account.
2. Create a database user for this app with read/write access to the `lg_gold` database. Use a strong password.
3. Allow the IP address of your backend host in Atlas Network Access. For local development, allow your current public IP. Prefer a restricted allowlist or private networking in production.
4. Open **Connect → Drivers → Node.js**, and copy the connection URI. Replace the database-user password placeholder; percent-encode special characters in the password.
5. Copy `server/.env.example` to `server/.env`. Put the URI in `MONGODB_URI` and use `MONGODB_DB=lg_gold`.
6. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` (10+ characters) for the admin page.
7. Restart the API. It creates the collections and indexes automatically. `GET /api/health` confirms database connectivity.

Keep the URI in the server environment. Never use a `VITE_` prefix: Vite variables are public. Environment files and `.local` are ignored by git and Docker.

Existing local data is not automatically copied into Atlas. Export/import it deliberately if it is real data; development fixtures should stay local. Enable the backup option appropriate to your Atlas cluster before taking real orders.

## Customer sign-in

Two ways in, side by side: a 6-digit **SMS code** sent to the mobile number, or the mobile number (or email) and a **password**.

**SMS codes** use Twilio Verify: create a Twilio account and a Verify service with 6-digit SMS codes, complete the requirements for SMS to Indian numbers (DLT registration), and set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` and `TWILIO_VERIFY_SERVICE_SID`. Each code is a paid SMS. Without these settings the live site hides the SMS option; on a development computer codes are printed in the `npm run dev` terminal (and saved in `.local/mail`) instead of being sent. Codes expire after 5 minutes, work once, allow 5 tries and can be resent after 60 seconds; the API never returns them. A new number that confirms a code gets an account automatically. The first code confirmation on an account whose number was never verified clears that account's password and ends its other sessions, so the phone's owner is in control.

**Passwords** need no provider. Each mobile number can have one account. Passwords are stored as scrypt hashes, sign-in attempts are rate limited, and sessions are HTTP-only cookies that last 14 days.

If a customer forgets their password: with email set up (below) they get a reset link; otherwise the sign-in page sends them to the mill on WhatsApp, and the mill creates a temporary password in Admin › Customers.

## Email recovery

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `MAIL_FROM` for real verification and password-reset emails. Use a verified sending address. Email is optional. Without SMTP, development emails go to `.local/mail`; in production the WhatsApp reset path is shown instead.

Reset and verification tokens are random, stored only as hashes, expire, and work once. Password reset revokes existing sessions. A verified email cannot be changed silently through the profile form.

## Admin page

The admin page (`#admin`) has its own sign-in, separate from customer accounts: the `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the server environment. Its session is an HTTP-only, strict same-site cookie that lasts 12 hours; sign-in attempts are rate limited. Production refuses to start without these settings.

Products, pack sizes, prices, stock, photos, delivery charges, the UPI ID and cash on delivery are stored in the `store` collection (photos in `images`) and served to the shop by `GET /api/storefront` on every visit, so a save is live immediately. On first start the store is created from `public/catalog.json`, `public/prices.json` and `public/store-rules.json`. Saves carry a version number, so two devices cannot overwrite each other.

Order management: search orders, confirm them, mark packing and dispatch, add a tracking reference, and mark delivery. Direct UPI/cash payment verification requires a bank reference or cash receipt. Updates are recorded in an audit trail and customer-visible status history. Prepaid orders cannot be dispatched before payment verification. See [admin-page.md](admin-page.md).

## Order and payment behaviour

Checkout requires a customer account. The server calculates prices and delivery charges from the admin-managed store; client prices and paid flags are not trusted. Each checkout request has an idempotency key, so retrying the same submission does not create duplicate orders. Cart contents are only cleared after the order is saved.

Direct UPI QR/app links appear **after saving the order**, contain the saved order reference, and remain pending until the mill verifies receipt. WhatsApp is an optional share/support action. It is not the database and not required to save an order.

For gateway payments, add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` to the server environment. Point the gateway's `payment.captured` webhook to `https://YOUR_HOST/api/payments/webhook`. Configure payment capture in the merchant dashboard. The server creates gateway orders, verifies checkout signatures, checks the amount, currency and captured status, and verifies raw-body webhook signatures. Repeated capture events are idempotent. The public key is returned to the checkout; secrets remain on the server.

Unpaid orders can be cancelled before packing. Paid cancellations/refunds are handled with the mill; this implementation does not automatically issue refunds. If a delayed payment arrives after cancellation, the history flags a refund review. Printed order summaries are not tax invoices.

## Production hosting

The customer platform needs a Node.js backend. **GitHub Pages alone cannot run accounts or MongoDB orders.** Deploy the provided Dockerfile or run `npm ci`, `npm run build`, then `NODE_ENV=production npm start` on a Node host.

Serve the frontend and `/api` together on the same HTTPS origin. Set `APP_ORIGIN` to that exact origin, `HOST=0.0.0.0`, and configure MongoDB, admin credentials, email (optional) and payment environments on the host. If the host is behind exactly one trusted reverse proxy, set `TRUST_PROXY=1`; otherwise match your actual topology. Keep HTTPS enabled for secure session cookies. No cross-origin API access is enabled.

The GitHub workflow only validates the code (lint, data check, build, server tests). Product, price and order changes made on the admin page go straight to MongoDB and need no redeploy.

Before launch, test an SMTP message (if used), the Atlas connection and payment in provider test mode, then a controlled live payment. No real gateway payment was performed during local automated testing.

## Validation

`npm run test:server` uses an isolated real MongoDB process and tests mobile/email sign-in, admin sign-in, admin store edits reaching order pricing, photo upload, temporary passwords, sessions, address ownership, order ownership, server pricing, duplicate submissions, admin transitions, manual payment audit, gateway signatures/amount checks/webhook replay, and recovery-token invalidation. Provider responses are fixtures, not live financial transactions. `npm run lint`, `npm run check:data`, and `npm run build` validate the source, catalog and production frontend.
