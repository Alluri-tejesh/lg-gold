import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ObjectId } from "mongodb";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { resolve } from "node:path";
import {
  secret,
  digest,
  sign,
  equal,
  hashPassword,
  checkPassword,
  publicCustomer,
} from "./security.mjs";
import { createDelivery } from "./delivery.mjs";
import { priceOrder } from "./catalog.mjs";

const email = z.string().trim().toLowerCase().email().max(254);
const password = z
  .string()
  .min(10, "Use at least 10 characters for your password.")
  .max(128);
const phone = z
  .string()
  .transform((s) => s.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number."))
  .transform((s) => `+91${s}`);
const address = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1).max(30),
  name: z.string().trim().min(2).max(80),
  phone,
  house: z.string().trim().min(4).max(200),
  landmark: z.string().trim().max(120).default(""),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pin: z.string().regex(/^[1-9]\d{5}$/),
  isDefault: z.boolean().default(false),
});
const id = (s) => {
  if (!ObjectId.isValid(s) || !/^[a-f\d]{24}$/i.test(s))
    throw Object.assign(new Error("Not found."), { status: 404 });
  return new ObjectId(s);
};
const fail = (status, message) => {
  throw Object.assign(new Error(message), { status });
};
const transition = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["packing", "cancelled"],
  packing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
const publicOrder = (o) => {
  const { _id, customerId, requestId, audit, ...rest } = o;
  return { ...rest, id: _id.toString() };
};

export function createApp(db, config, injectedDelivery) {
  const app = express();
  const delivery = injectedDelivery || createDelivery(config);
  const customers = db.collection("customers"),
    sessions = db.collection("sessions"),
    tokens = db.collection("tokens"),
    orders = db.collection("orders"),
    challenges = db.collection("otp");
  app.disable("x-powered-by");
  // Proxy trust must match deployment topology; never trust arbitrary client-supplied forwarded IPs.
  if (config.trustProxy) app.set("trust proxy", config.trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://checkout.razorpay.com"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            "https://api.github.com",
            "https://api.postalpincode.in",
            "https://api.razorpay.com",
            "https://checkout.razorpay.com",
          ],
          frameSrc: [
            "https://api.razorpay.com",
            "https://checkout.razorpay.com",
          ],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: config.production ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      strictTransportSecurity: config.production ? undefined : false,
    }),
  );

  async function razorpay(path, init = {}) {
    if (!config.razorpayKey || !config.razorpaySecret)
      fail(503, "Online gateway payments are not connected yet.");
    const res = await fetch(`https://api.razorpay.com/v1/${path}`, {
      ...init,
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.razorpayKey}:${config.razorpaySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok)
      fail(
        502,
        "The payment provider is temporarily unavailable. Try again shortly.",
      );
    return res.json();
  }
  // Raw bytes are required for webhook signatures. Mount before the JSON body parser.
  app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json", limit: "128kb" }),
    async (req, res) => {
      if (
        !config.webhookSecret ||
        !Buffer.isBuffer(req.body) ||
        !equal(
          sign(req.body, config.webhookSecret),
          req.get("x-razorpay-signature"),
        )
      )
        return res.status(400).json({ error: "Invalid webhook signature." });
      const event = JSON.parse(req.body.toString());
      const p = event.payload?.payment?.entity;
      if (event.event === "payment.captured" && p?.order_id) {
        const o = await orders.findOne({
          "payment.gatewayOrderId": p.order_id,
        });
        if (
          o &&
          p.amount === Math.round(o.totals.total * 100) &&
          p.currency === "INR" &&
          p.status === "captured"
        ) {
          await orders.updateOne(
            { _id: o._id, "payment.status": { $ne: "verified" } },
            {
              $set: {
                "payment.status": "verified",
                "payment.reference": p.id,
                "payment.verifiedAt": new Date(),
                updatedAt: new Date(),
              },
              $inc: { version: 1 },
              $push: {
                history: {
                  status: o.status,
                  at: new Date(),
                  note:
                    o.status === "cancelled"
                      ? "Payment received after cancellation. Refund review required."
                      : "Payment verified by the payment gateway.",
                },
              },
            },
          );
        }
      }
      res.json({ received: true });
    },
  );
  app.use(express.json({ limit: "32kb" }), cookieParser());
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    const allowedOrigins = [config.origin];
    if (!config.production && new URL(config.origin).hostname === "localhost")
      allowedOrigins.push(config.origin.replace("localhost", "127.0.0.1"));
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      (req.get("x-lg-client") !== "web" ||
        (req.get("origin") && !allowedOrigins.includes(req.get("origin"))))
    )
      return res.status(403).json({ error: "Request origin is not allowed." });
    next();
  });
  function limit(label, max, duration = 15 * 60_000, key = (req) => req.ip) {
    return async (req, res, next) => {
      const bucket = Math.floor(Date.now() / duration);
      const record = await db
        .collection("limits")
        .findOneAndUpdate(
          { _id: `${label}:${digest(String(key(req)))}:${bucket}` },
          {
            $inc: { count: 1 },
            $setOnInsert: { expiresAt: new Date((bucket + 2) * duration) },
          },
          { upsert: true, returnDocument: "after" },
        );
      if (record.count > max)
        return res
          .status(429)
          .set("Retry-After", String(Math.ceil(duration / 1000)))
          .json({ error: "Too many attempts. Please try again later." });
      next();
    };
  }
  app.use("/api", limit("api", 500));
  app.use("/api", async (req, res, next) => {
    if (req.cookies.lg_session) {
      req.session = await sessions.findOne({
        tokenHash: digest(req.cookies.lg_session),
        expiresAt: { $gt: new Date() },
      });
      if (req.session)
        req.user = await customers.findOne({ _id: req.session.customerId });
    }
    next();
  });
  const auth = (req, res, next) =>
    req.user ? next() : res.status(401).json({ error: "Sign in to continue." });
  const admin = (req, res, next) =>
    req.user?.role === "admin"
      ? next()
      : res.status(403).json({ error: "Administrator access is required." });
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: config.production,
    path: "/",
  };
  async function issueSession(user, res) {
    const raw = secret();
    await sessions.insertOne({
      tokenHash: digest(raw),
      customerId: user._id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 86400_000),
    });
    res.cookie("lg_session", raw, { ...cookieOptions, maxAge: 14 * 86400_000 });
  }
  async function sendToken(user, purpose) {
    const raw = secret();
    await tokens.deleteMany({ customerId: user._id, purpose });
    await tokens.insertOne({
      hash: digest(raw),
      customerId: user._id,
      email: user.email,
      purpose,
      expiresAt: new Date(
        Date.now() + (purpose === "reset" ? 30 : 60) * 60_000,
      ),
    });
    const route = purpose === "reset" ? "reset-password" : "verify-email";
    await delivery.email(
      user.email,
      purpose === "reset"
        ? "Reset your LG Gold password"
        : "Verify your LG Gold email",
      `Hello ${user.name},\n\n${config.origin}/#${route}/${raw}\n\nThis link expires in ${purpose === "reset" ? 30 : 60} minutes and works once. If you did not request this, ignore this message.`,
    );
  }
  app.get("/api/health", async (req, res) => {
    await db.command({ ping: 1 });
    res.json({ ok: true });
  });
  app.get("/api/auth/config", (req, res) =>
    res.json({
      sms: delivery.smsAvailable,
      localSms: !!delivery.localSms,
      email: delivery.emailAvailable,
      gateway: !!(config.razorpayKey && config.razorpaySecret),
      razorpayKey: config.razorpayKey || "",
    }),
  );
  app.get("/api/auth/me", (req, res) =>
    res.json({ user: req.user ? publicCustomer(req.user) : null }),
  );
  app.post("/api/auth/register", limit("register", 8), async (req, res) => {
    const input = z
      .object({ name: z.string().trim().min(2).max(80), email, password })
      .parse(req.body);
    if (await customers.findOne({ email: input.email }))
      fail(
        409,
        "An account already uses this email. Sign in or reset your password.",
      );
    const user = {
      _id: new ObjectId(),
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      emailVerified: false,
      phoneVerified: false,
      role: "customer",
      addresses: [],
      createdAt: new Date(),
    };
    await customers.insertOne(user);
    await issueSession(user, res);
    res.status(201).json({ user: publicCustomer(user) });
  });
  app.post("/api/auth/login", limit("login", 15), async (req, res) => {
    const input = z
      .object({ email, password: z.string().min(1).max(128) })
      .parse(req.body);
    const user = await customers.findOne({ email: input.email });
    // A constant-cost dummy hash prevents timing-based account discovery.
    const hash = user?.passwordHash || config.dummyHash;
    const valid = await checkPassword(input.password, hash);
    if (!valid || !user?.passwordHash)
      fail(401, "Email or password is incorrect.");
    await issueSession(user, res);
    res.json({ user: publicCustomer(user) });
  });
  app.post("/api/auth/logout", async (req, res) => {
    if (req.session) await sessions.deleteOne({ _id: req.session._id });
    res.clearCookie("lg_session", cookieOptions).json({ ok: true });
  });
  app.post("/api/auth/otp/request", limit("otp-send", 6), async (req, res) => {
    const input = z
      .object({
        phone,
        name: z.string().trim().min(2).max(80).optional(),
        purpose: z.enum(["login", "link"]).default("login"),
      })
      .parse(req.body);
    if (input.purpose === "link" && !req.user) fail(401, "Sign in first.");
    if (!delivery.smsAvailable)
      fail(
        503,
        "SMS sign-in is not connected yet. Please use email and password.",
      );
    // Scope resend limit by number as well as IP; a different browser cannot bypass the cooldown.
    const locks = db.collection("otpCooldown");
    try {
      await locks.insertOne({ _id: input.phone, nextAllowedAt: new Date(0) });
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
    const lock = await locks.findOneAndUpdate(
      { _id: input.phone, nextAllowedAt: { $lte: new Date() } },
      {
        $set: {
          nextAllowedAt: new Date(Date.now() + 60_000),
          expiresAt: new Date(Date.now() + 86400_000),
        },
      },
      { returnDocument: "after" },
    );
    if (!lock) fail(429, "Wait a minute before requesting another code.");
    const challengeId = randomUUID();
    await challenges.insertOne({
      _id: challengeId,
      phone: input.phone,
      name: input.name,
      purpose: input.purpose,
      customerId: input.purpose === "link" ? req.user._id : null,
      attempts: 0,
      used: false,
      ready: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60_000),
    });
    try {
      const provider = await delivery.sendOtp(input.phone, challengeId);
      await challenges.updateMany(
        { phone: input.phone, _id: { $ne: challengeId } },
        { $set: { used: true } },
      );
      await challenges.updateOne(
        { _id: challengeId },
        { $set: { ...provider, ready: true } },
      );
    } catch (err) {
      await challenges.deleteOne({ _id: challengeId });
      throw err;
    }
    res.json({ challengeId, expiresIn: 300, resendAfter: 60 });
  });
  app.post("/api/auth/otp/verify", limit("otp-check", 25), async (req, res) => {
    const input = z
      .object({
        challengeId: z.string().uuid(),
        code: z.string().regex(/^\d{6}$/),
      })
      .parse(req.body);
    const c = await challenges.findOneAndUpdate(
      {
        _id: input.challengeId,
        ready: true,
        used: false,
        attempts: { $lt: 5 },
        expiresAt: { $gt: new Date() },
      },
      { $inc: { attempts: 1 } },
      { returnDocument: "after" },
    );
    if (!c)
      fail(
        400,
        "This code has expired or reached its attempt limit. Request a new code.",
      );
    if (
      c.purpose === "link" &&
      (!req.user || !c.customerId.equals(req.user._id))
    )
      fail(403, "Sign in with the account that requested this code.");
    if (!(await delivery.checkOtp(c, input.code)))
      fail(400, "That code is incorrect. Please check the SMS and try again.");
    const consumed = await challenges.updateOne(
      { _id: c._id, used: false },
      { $set: { used: true } },
    );
    if (!consumed.modifiedCount) fail(400, "This code has already been used.");
    let user = await customers.findOne({ phone: c.phone, phoneVerified: true });
    if (c.purpose === "link") {
      if (user && !user._id.equals(req.user._id))
        fail(409, "This mobile number belongs to another account.");
      await customers.updateOne(
        { _id: req.user._id },
        { $set: { phone: c.phone, phoneVerified: true } },
      );
      user = await customers.findOne({ _id: req.user._id });
    } else if (!user) {
      user = {
        _id: new ObjectId(),
        name: c.name || "Customer",
        phone: c.phone,
        phoneVerified: true,
        emailVerified: false,
        role: "customer",
        addresses: [],
        createdAt: new Date(),
      };
      try {
        await customers.insertOne(user);
      } catch (err) {
        if (err.code !== 11000) throw err;
        user = await customers.findOne({ phone: c.phone, phoneVerified: true });
      }
    }
    await issueSession(user, res);
    res.json({ user: publicCustomer(user) });
  });
  app.post(
    "/api/auth/forgot-password",
    limit("reset-send", 5),
    async (req, res) => {
      if (!delivery.emailAvailable) fail(503, 'Email recovery is currently unavailable. Sign in with SMS or contact the mill.');
      const input = z.object({ email }).parse(req.body);
      const user = await customers.findOne({ email: input.email });
      if (user) await sendToken(user, "reset");
      res.json({
        message:
          "If that email has an account, a reset link will arrive shortly.",
      });
    },
  );
  app.post(
    "/api/auth/reset-password",
    limit("reset-check", 10),
    async (req, res) => {
      const input = z
        .object({ token: z.string().regex(/^[a-f\d]{64}$/), password })
        .parse(req.body);
      const token = await tokens.findOneAndDelete({
        hash: digest(input.token),
        purpose: "reset",
        expiresAt: { $gt: new Date() },
      });
      if (!token)
        fail(400, "The reset link is invalid or expired. Request a new one.");
      const updated = await customers.updateOne(
        { _id: token.customerId, email: token.email },
        {
          $set: {
            passwordHash: await hashPassword(input.password),
            emailVerified: true,
          },
        },
      );
      if (!updated.matchedCount)
        fail(400, "Your recovery email changed. Request a new reset link.");
      await sessions.deleteMany({ customerId: token.customerId });
      res.clearCookie("lg_session", cookieOptions).json({ ok: true });
    },
  );
  app.post(
    "/api/auth/send-verification",
    auth,
    limit("verify-send", 4),
    async (req, res) => {
      if (!req.user.email)
        fail(400, "Add your email in profile settings first.");
      await sendToken(req.user, "verify");
      res.json({ ok: true });
    },
  );
  app.post(
    "/api/auth/verify-email",
    limit("verify-check", 10),
    async (req, res) => {
      const { token: raw } = z
        .object({ token: z.string().regex(/^[a-f\d]{64}$/) })
        .parse(req.body);
      const token = await tokens.findOneAndDelete({
        hash: digest(raw),
        purpose: "verify",
        expiresAt: { $gt: new Date() },
      });
      if (!token) fail(400, "The verification link is invalid or expired.");
      const updated = await customers.updateOne(
        { _id: token.customerId, email: token.email },
        { $set: { emailVerified: true } },
      );
      if (!updated.matchedCount)
        fail(400, "Your email changed. Request a new verification link.");
      res.json({ ok: true });
    },
  );
  app.patch("/api/account/profile", auth, async (req, res) => {
    const input = z
      .object({
        name: z.string().trim().min(2).max(80),
        email: email.optional(),
      })
      .parse(req.body);
    const changedEmail = input.email && input.email !== req.user.email;
    if (changedEmail && req.user.emailVerified)
      fail(400, "Contact the mill to change a verified email address.");
    await customers.updateOne(
      { _id: req.user._id },
      {
        $set: {
          name: input.name,
          ...(input.email ? { email: input.email } : {}),
          ...(changedEmail ? { emailVerified: false } : {}),
        },
      },
    );
    // Bind pending verification links to the old address by invalidating them on an email change.
    if (changedEmail) await tokens.deleteMany({ customerId: req.user._id });
    res.json({
      user: publicCustomer(await customers.findOne({ _id: req.user._id })),
    });
  });
  app.post(
    "/api/account/password",
    auth,
    limit("password", 8),
    async (req, res) => {
      const input = z
        .object({ currentPassword: z.string().max(128).optional(), password })
        .parse(req.body);
      if (
        req.user.passwordHash
          ? !(await checkPassword(
              input.currentPassword || "",
              req.user.passwordHash,
            ))
          : Date.now() - req.session.createdAt.getTime() > 10 * 60_000
      )
        fail(
          400,
          req.user.passwordHash
            ? "Current password is incorrect."
            : "Sign in again with SMS to set a password.",
        );
      await customers.updateOne(
        { _id: req.user._id },
        { $set: { passwordHash: await hashPassword(input.password) } },
      );
      await sessions.deleteMany({ customerId: req.user._id });
      await issueSession(req.user, res);
      res.json({ ok: true });
    },
  );
  app.post("/api/account/logout-all", auth, async (req, res) => {
    await sessions.deleteMany({ customerId: req.user._id });
    res.clearCookie("lg_session", cookieOptions).json({ ok: true });
  });
  app.put("/api/account/addresses", auth, async (req, res) => {
    const list = z
      .array(address)
      .max(10)
      .parse(req.body.addresses)
      .map((a) => ({ ...a, id: a.id || randomUUID() }));
    if (new Set(list.map((a) => a.id)).size !== list.length)
      fail(400, "Address IDs must be unique.");
    const defaultIndex = Math.max(
      0,
      list.findIndex((a) => a.isDefault),
    );
    const addresses = list.map((a, i) => ({
      ...a,
      isDefault: i === defaultIndex,
    }));
    await customers.updateOne({ _id: req.user._id }, { $set: { addresses } });
    res.json({
      user: publicCustomer(await customers.findOne({ _id: req.user._id })),
    });
  });
  app.post("/api/orders", auth, limit("place-order", 30), async (req, res) => {
    const input = z
      .object({
        requestId: z.string().uuid(),
        paymentNoteReference: z
          .string()
          .regex(/^LG-[A-Z0-9-]{8,30}$/)
          .optional(),
        items: z
          .array(
            z.object({
              productSlug: z.string().min(1).max(100),
              packSize: z.string().min(1).max(80),
              quantity: z.number().int().min(1).max(100),
            }),
          )
          .min(1)
          .max(30),
        expectedTotal: z.number().positive(),
        address,
        method: z.enum(["upi", "card", "cod", "later"]),
      })
      .parse(req.body);
    const previous = await orders.findOne({
      customerId: req.user._id,
      requestId: input.requestId,
    });
    if (previous) return res.json({ order: publicOrder(previous) });
    const priced = await priceOrder(
      input.items,
      input.expectedTotal,
      config.dataDir,
    );
    if (input.method === "cod" && !priced.rules.cashOnDelivery)
      fail(400, "Cash on delivery is unavailable.");
    if (input.method === "upi" && !priced.rules.upiEnabled)
      fail(400, "Direct UPI is unavailable.");
    if (
      input.method === "card" &&
      !(config.razorpayKey && config.razorpaySecret)
    )
      fail(400, "Online gateway payments are not connected yet.");
    const now = new Date();
    const order = {
      _id: new ObjectId(),
      orderId: `LG-${new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "2-digit", month: "2-digit", day: "2-digit" }).format(now).replaceAll("-", "")}-${secret().slice(0, 8).toUpperCase()}`,
      requestId: input.requestId,
      customerId: req.user._id,
      customer: {
        name: req.user.name,
        email: req.user.email || "",
        phone: req.user.phone || input.address.phone,
      },
      items: priced.items,
      totals: priced.totals,
      address: input.address,
      status: "placed",
      payment: {
        method: input.method,
        status:
          input.method === "cod" || input.method === "later"
            ? "unpaid"
            : "pending",
      },
      history: [
        {
          status: "placed",
          at: now,
          note: "Order saved. The mill will confirm availability and dispatch.",
        },
      ],
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    if (input.paymentNoteReference && input.method === "upi")
      order.payment.noteReference = input.paymentNoteReference;
    try {
      await orders.insertOne(order);
    } catch (err) {
      if (err.code !== 11000) throw err;
      const existing = await orders.findOne({
        customerId: req.user._id,
        requestId: input.requestId,
      });
      if (!existing) throw err;
      return res.json({ order: publicOrder(existing) });
    }
    res.status(201).json({ order: publicOrder(order) });
  });
  app.get("/api/orders", auth, async (req, res) => {
    const page = Math.max(1, Math.min(10000, Number(req.query.page) || 1));
    const query = { customerId: req.user._id };
    if (
      typeof req.query.status === "string" &&
      Object.hasOwn(transition, req.query.status)
    )
      query.status = req.query.status;
    const [list, count, grouped] = await Promise.all([
      orders
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * 12)
        .limit(12)
        .toArray(),
      orders.countDocuments(query),
      orders
        .aggregate([
          { $match: { customerId: req.user._id } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);
    res.json({
      orders: list.map(publicOrder),
      total: count,
      page,
      summary: {
        active: grouped
          .filter((s) => !["delivered", "cancelled"].includes(s._id))
          .reduce((n, s) => n + s.count, 0),
        delivered: grouped.find((s) => s._id === "delivered")?.count || 0,
      },
    });
  });
  app.get("/api/orders/:id", auth, async (req, res) => {
    const order = await orders.findOne({
      _id: id(req.params.id),
      customerId: req.user._id,
    });
    if (!order) fail(404, "Order not found.");
    res.json({ order: publicOrder(order) });
  });
  app.post("/api/orders/:id/cancel", auth, async (req, res) => {
    const now = new Date();
    const order = await orders.findOneAndUpdate(
      {
        _id: id(req.params.id),
        customerId: req.user._id,
        status: { $in: ["placed", "confirmed"] },
        "payment.status": { $ne: "verified" },
      },
      {
        $set: { status: "cancelled", updatedAt: now },
        $inc: { version: 1 },
        $push: {
          history: {
            status: "cancelled",
            at: now,
            note: "Cancelled by the customer.",
          },
        },
      },
      { returnDocument: "after" },
    );
    if (!order)
      fail(
        409,
        "This order cannot be cancelled online. Contact the mill for help or a refund.",
      );
    res.json({ order: publicOrder(order) });
  });
  app.post("/api/orders/:id/payment", auth, async (req, res) => {
    const o = await orders.findOne({
      _id: id(req.params.id),
      customerId: req.user._id,
    });
    if (
      !o ||
      o.payment.method !== "card" ||
      o.status === "cancelled" ||
      o.payment.status === "verified"
    )
      fail(409, "This order cannot start a new payment.");
    let gatewayId = o.payment.gatewayOrderId;
    if (!gatewayId) {
      const remote = await razorpay("orders", {
        method: "POST",
        body: JSON.stringify({
          amount: Math.round(o.totals.total * 100),
          currency: "INR",
          receipt: o.orderId,
          notes: { lg_order_id: o._id.toString() },
        }),
      });
      const assigned = await orders.findOneAndUpdate(
        {
          _id: o._id,
          "payment.gatewayOrderId": { $exists: false },
          status: { $ne: "cancelled" },
        },
        { $set: { "payment.gatewayOrderId": remote.id } },
        { returnDocument: "after" },
      );
      if (!assigned) {
        const current = await orders.findOne({ _id: o._id });
        if (current.status === "cancelled") fail(409, "Order was cancelled.");
        gatewayId = current.payment.gatewayOrderId;
      } else gatewayId = remote.id;
    }
    res.json({
      key: config.razorpayKey,
      gatewayOrderId: gatewayId,
      amount: Math.round(o.totals.total * 100),
      currency: "INR",
    });
  });
  app.post("/api/orders/:id/payment/verify", auth, async (req, res) => {
    const p = z
      .object({
        razorpay_order_id: z.string().max(100),
        razorpay_payment_id: z.string().max(100),
        razorpay_signature: z.string().regex(/^[a-f\d]{64}$/),
      })
      .parse(req.body);
    const o = await orders.findOne({
      _id: id(req.params.id),
      customerId: req.user._id,
    });
    if (
      !config.razorpaySecret ||
      !o ||
      o.payment.gatewayOrderId !== p.razorpay_order_id ||
      !equal(
        sign(
          `${o.payment.gatewayOrderId}|${p.razorpay_payment_id}`,
          config.razorpaySecret,
        ),
        p.razorpay_signature,
      )
    )
      fail(400, "Payment could not be verified.");
    const remote = await razorpay(
      `payments/${encodeURIComponent(p.razorpay_payment_id)}`,
    );
    if (
      remote.order_id !== o.payment.gatewayOrderId ||
      remote.amount !== Math.round(o.totals.total * 100) ||
      remote.currency !== "INR"
    )
      fail(400, "Payment details do not match this order.");
    if (remote.status !== "captured")
      fail(
        409,
        "The payment is still processing. It will update after gateway confirmation.",
      );
    await orders.updateOne(
      { _id: o._id, "payment.status": { $ne: "verified" } },
      {
        $set: {
          "payment.status": "verified",
          "payment.reference": remote.id,
          "payment.verifiedAt": new Date(),
          updatedAt: new Date(),
        },
        $inc: { version: 1 },
        $push: {
          history: {
            status: o.status,
            at: new Date(),
            note: "Payment verified by the payment gateway.",
          },
        },
      },
    );
    res.json({ order: publicOrder(await orders.findOne({ _id: o._id })) });
  });
  app.get("/api/admin/orders", auth, admin, async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const status =
      typeof req.query.status === "string" &&
      Object.hasOwn(transition, req.query.status)
        ? req.query.status
        : undefined;
    const query = status ? { status } : {};
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      const safe = req.query.search
        .trim()
        .slice(0, 80)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { orderId: { $regex: safe, $options: "i" } },
        { "customer.name": { $regex: safe, $options: "i" } },
        { "customer.phone": { $regex: safe } },
      ];
    }
    const [list, count, stats] = await Promise.all([
      orders
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * 20)
        .limit(20)
        .toArray(),
      orders.countDocuments(query),
      orders
        .aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              value: { $sum: "$totals.total" },
            },
          },
        ])
        .toArray(),
    ]);
    res.json({ orders: list.map(publicOrder), total: count, stats, page });
  });
  app.patch("/api/admin/orders/:id", auth, admin, async (req, res) => {
    const input = z
      .object({
        version: z.number().int(),
        status: z
          .enum([
            "placed",
            "confirmed",
            "packing",
            "shipped",
            "delivered",
            "cancelled",
          ])
          .optional(),
        note: z.string().trim().max(300).default(""),
        tracking: z.string().trim().max(150).optional(),
        verifyPayment: z.boolean().optional(),
        reference: z.string().trim().max(100).optional(),
      })
      .parse(req.body);
    const o = await orders.findOne({ _id: id(req.params.id) });
    if (!o) fail(404, "Order not found.");
    if (
      input.status &&
      input.status !== o.status &&
      !transition[o.status].includes(input.status)
    )
      fail(409, "That order-status transition is not allowed.");
    if (
      input.verifyPayment &&
      (!["upi", "cod", "later"].includes(o.payment.method) ||
        o.status === "cancelled" ||
        o.payment.status === "verified")
    )
      fail(400, "This payment cannot be verified manually.");
    if (input.verifyPayment && (input.reference?.length || 0) < 6)
      fail(
        400,
        "Add a bank reference or cash receipt number for the payment audit.",
      );
    if (
      (input.status === "shipped" || input.status === "delivered") &&
      !["cod", "later"].includes(o.payment.method) &&
      o.payment.status !== "verified" &&
      !input.verifyPayment
    )
      fail(409, "Verify the prepaid payment before dispatch.");
    if (input.status === "cancelled" && o.payment.status === "verified")
      fail(
        409,
        "A paid order needs a refund review. Arrange the refund with the customer before updating its status.",
      );
    const now = new Date();
    const updated = await orders.findOneAndUpdate(
      { _id: o._id, version: input.version },
      {
        $set: {
          status: input.status || o.status,
          updatedAt: now,
          ...(input.tracking !== undefined ? { tracking: input.tracking } : {}),
          ...(input.verifyPayment
            ? {
                "payment.status": "verified",
                "payment.reference": input.reference,
                "payment.verifiedAt": now,
              }
            : {}),
        },
        $inc: { version: 1 },
        $push: {
          history: {
            status: input.status || o.status,
            at: now,
            note:
              input.note ||
              (input.verifyPayment
                ? "Payment verified by the mill."
                : "Order updated by the mill."),
          },
          audit: {
            actorId: req.user._id,
            at: now,
            action: input.verifyPayment ? "payment_verified" : "order_updated",
          },
        },
      },
      { returnDocument: "after" },
    );
    if (!updated)
      fail(409, "This order changed on another device. Refresh and try again.");
    res.json({ order: publicOrder(updated) });
  });
  app.use("/api", (req, res) =>
    res.status(404).json({ error: "Endpoint not found." }),
  );
  if (config.serveFrontend)
    app.use(
      express.static(resolve("dist"), { index: "index.html", maxAge: "1h" }),
    );
  app.use((err, req, res, next) => {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .json({
          error:
            err.issues[0]?.message || "Please check the submitted details.",
        });
    if (err.code === 11000)
      return res
        .status(409)
        .json({ error: "Those account details are already in use." });
    const status = err.status || 500;
    if (status >= 500) console.error("API failure:", err.name); // Never log credentials, tokens, bodies or connection strings.
    res
      .status(status)
      .json({
        error:
          status === 500
            ? "Something went wrong. Please try again."
            : err.message,
      });
  });
  return app;
}
