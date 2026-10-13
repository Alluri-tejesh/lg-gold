# Customer accounts, orders and MongoDB

## Run locally

Use Node.js 22.12 or newer. Run `npm install`, then `npm run dev:all` from the project root. The shop opens at http://localhost:3000 and the API listens on loopback port 4000. Vite proxies `/api` to the server.

When `MONGODB_URI` is absent, development starts a real local MongoDB process on port 27018. Its WiredTiger database persists in `.local/mongodb`. Do not delete that folder if you want to keep your local customers and orders. The local database is not exposed to your network. The first run downloads the MongoDB binary.

Routes:

| Page                                                 | Address suffix             |
| ---------------------------------------------------- | -------------------------- |
| SMS / password sign-in                               | `#login`                   |
| Sign-up                                              | `#register`                |
| Dashboard                                            | `#account`                 |
| Orders                                               | `#orders`                  |
| Order tracking and payment                           | `#order-detail/<order-id>` |
| Delivery addresses                                   | `#addresses`               |
| Profile / email verification                         | `#profile`                 |
| Password / mobile verification / sign out everywhere | `#security`                |
| Customer help                                        | `#support`                 |
| Order administration                                 | `#admin-orders`            |
| Existing product administration                      | `#admin`                   |

## Connect MongoDB Atlas

1. Create an Atlas project and cluster in your MongoDB account.
2. Create a database user for this app with read/write access to the `lg_gold` database. Use a strong password.
3. Allow the IP address of your backend host in Atlas Network Access. For local development, allow your current public IP. Prefer a restricted allowlist or private networking in production.
4. Open **Connect → Drivers → Node.js**, and copy the connection URI. Replace the database-user password placeholder; percent-encode special characters in the password.
5. Copy `server/.env.example` to `server/.env`. Put the URI in `MONGODB_URI` and use `MONGODB_DB=lg_gold`.
6. Generate `OTP_SECRET` with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and put the output in the server environment.
7. Restart the API. It creates the collections and indexes automatically. `GET /api/health` confirms database connectivity.

Keep the URI in the server environment. Never use a `VITE_` prefix: Vite variables are public. Environment files and `.local` are ignored by git and Docker.

Existing local data is not automatically copied into Atlas. Export/import it deliberately if it is real data; development fixtures should stay local. Enable the backup option appropriate to your Atlas cluster before taking real orders.

## SMS OTP

Live SMS uses **Twilio Verify**. Create a Twilio account and a Verify service, configure the service to use 6-digit SMS codes, and complete the provider's requirements for SMS delivery to Indian numbers. Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` and `TWILIO_VERIFY_SERVICE_SID` to the server environment.

Codes are checked with the provider. The app additionally enforces a 5-minute expiry, one-time use, a 60-second resend cooldown and five code attempts, with database-backed request limits. A verified mobile number is required for SMS login. Linking a mobile number to an existing email account requires that account's session and verification of the number.

**Development:** when Twilio is not configured, simulated SMS is written to `.local/mail/*.json`. Open the newest file for the test mobile number to read its code. Nothing is actually sent. Codes are never returned by the API. The production server disables SMS sign-in when the provider is unconfigured; it never uses the local inbox in production.

## Email recovery

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `MAIL_FROM` for real verification and password-reset emails. Use a verified sending address. Without SMTP, development emails also go to `.local/mail`; production does not use this fallback.

Reset and verification tokens are random, stored only as hashes, expire, and work once. Password reset revokes existing sessions. A verified email cannot be changed silently through the profile form. SMS sign-in remains an alternative when email recovery is unavailable.

## Administrator account

There is no default admin password and no public API that grants admin access. Register and verify your own account, then run this command with access to the server environment:

```
npm run admin:promote -- +919876543210
```

Replace the example with your verified number. Alternatively pass a verified email address. Then sign in and open `#admin-orders`. Database roles are checked on every administrator API request.

Administrators can search orders, confirm them, mark packing and dispatch, add a tracking reference, and mark delivery. Direct UPI/cash payment verification requires a bank reference or cash receipt. Updates are recorded in an audit trail and customer-visible status history. Optimistic version checks stop one device overwriting another device's update. Prepaid orders cannot be dispatched before payment verification.

## Order and payment behaviour

Checkout requires sign-in. The server calculates prices and delivery charges from the catalog; client prices and paid flags are not trusted. Each checkout request has an idempotency key, so retrying the same submission does not create duplicate orders. Cart contents are only cleared after the order is saved.

Direct UPI QR/app links appear **after saving the order**, contain the saved order reference, and remain pending until the mill verifies receipt. WhatsApp is an optional share/support action. It is not the database and not required to save an order.

For gateway payments, add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` to the server environment. Point the gateway's `payment.captured` webhook to `https://YOUR_HOST/api/payments/webhook`. Configure payment capture in the merchant dashboard. The server creates gateway orders, verifies checkout signatures, checks the amount, currency and captured status, and verifies raw-body webhook signatures. Repeated capture events are idempotent. The public key is returned to the checkout; secrets remain on the server.

Unpaid orders can be cancelled before packing. Paid cancellations/refunds are handled with the mill; this implementation does not automatically issue refunds. If a delayed payment arrives after cancellation, the history flags a refund review. Printed order summaries are not tax invoices.

## Production hosting

The customer platform needs a Node.js backend. **GitHub Pages alone cannot run accounts or MongoDB orders.** Deploy the provided Dockerfile or run `npm ci`, `npm run build`, then `NODE_ENV=production npm start` on a Node host.

Serve the frontend and `/api` together on the same HTTPS origin. Set `APP_ORIGIN` to that exact origin, `HOST=0.0.0.0`, and configure MongoDB, SMS/email, and payment environments on the host. If the host is behind exactly one trusted reverse proxy, set `TRUST_PROXY=1`; otherwise match your actual topology. Keep HTTPS enabled for secure session cookies. No cross-origin API access is enabled.

The GitHub workflow validates the app; it no longer publishes a static-only version. Configure the Node host to redeploy from your repository if you want GitHub product edits to go live automatically. The existing product admin saves catalog changes to GitHub; the order admin updates MongoDB immediately.

Before launch, test a real SMS, SMTP message, Atlas connection and payment in provider test mode, then a controlled live payment. No real SMS or gateway payment was performed during local automated testing.

## Validation

`npm run test:server` uses an isolated real MongoDB process and tests auth, sessions, SMS-code expiry/replay/attempt limits, address ownership, order ownership, server pricing, duplicate submissions, admin transitions, manual payment audit, gateway signatures/amount checks/webhook replay, and recovery-token invalidation. Provider responses are fixtures, not live financial transactions. `npm run lint`, `npm run check:data`, and `npm run build` validate the source, catalog and production frontend.
