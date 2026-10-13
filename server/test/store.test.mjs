import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { connectDatabase } from "../db.mjs";
import { createApp } from "../app.mjs";
import { digest, hashPassword, sign } from "../security.mjs";

let mongo, client, db, app, alice, bob, administrator;
const messages = [],
  codes = new Map();
const config = {
  production: false,
  origin: "http://localhost:3000",
  otpSecret: "test-only-secret",
  razorpayKey: "rzp_test_fixture",
  razorpaySecret: "fixture-secret",
  webhookSecret: "fixture-webhook",
};
const provider = {
  smsAvailable: true,
  emailAvailable: true,
  async email(to, subject, text) {
    messages.push({ to, subject, text });
  },
  async sendOtp(phone, challengeId) {
    codes.set(challengeId, "123456");
    return { provider: "fixture" };
  },
  async checkOtp(c, code) {
    return codes.get(c._id) === code;
  },
};
const address = {
  label: "Home",
  name: "Test Customer",
  phone: "9876543210",
  house: "12 Test Street",
  landmark: "",
  city: "Nalgonda",
  state: "Telangana",
  pin: "508207",
  isDefault: true,
};
const payload = (extra = {}) => ({
  requestId: randomUUID(),
  items: [{ productSlug: "hmt-rice", packSize: "26kg Bag", quantity: 1 }],
  expectedTotal: 1700,
  address,
  method: "upi",
  ...extra,
});
const post = (agent, path, body = {}) =>
  agent
    .post(`/api${path}`)
    .set("X-LG-Client", "web")
    .set("Origin", config.origin)
    .send(body);
const patch = (agent, path, body) =>
  agent
    .patch(`/api${path}`)
    .set("X-LG-Client", "web")
    .set("Origin", config.origin)
    .send(body);
before(async () => {
  mongo = await MongoMemoryServer.create();
  ({ db, client } = await connectDatabase(mongo.getUri(), "lg_gold_test"));
  config.dummyHash = await hashPassword("fixture-not-a-user-password");
  app = createApp(db, config, provider);
  alice = request.agent(app);
  bob = request.agent(app);
  administrator = request.agent(app);
});
after(async () => {
  await client?.close();
  await mongo?.stop();
});
test("register, hashing, cookie security, login and origin checks", async () => {
  const r = await post(alice, "/auth/register", {
    name: "Alice Test",
    email: "ALICE@example.test",
    password: "correct horse battery staple",
    role: "admin",
  });
  assert.equal(r.status, 201);
  assert.equal(r.body.user.role, "customer");
  assert.equal(r.body.user.email, "alice@example.test");
  assert.ok(!r.body.user.passwordHash);
  assert.match(r.headers["set-cookie"][0], /HttpOnly/);
  assert.match(r.headers["set-cookie"][0], /SameSite=Lax/);
  const stored = await db
    .collection("customers")
    .findOne({ email: "alice@example.test" });
  assert.match(stored.passwordHash, /^scrypt:/);
  assert.notEqual(stored.passwordHash, "correct horse battery staple");
  assert.equal(
    (await request(app).post("/api/auth/logout").send({})).status,
    403,
  );
  assert.equal(
    (
      await request(app)
        .post("/api/auth/login")
        .set("X-LG-Client", "web")
        .set("Origin", "https://evil.test")
        .send({})
    ).status,
    403,
  );
  assert.equal(
    (
      await post(bob, "/auth/login", {
        email: "alice@example.test",
        password: "wrong password",
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await post(bob, "/auth/register", {
        name: "Bob Test",
        email: "bob@example.test",
        password: "a second strong password",
      })
    ).status,
    201,
  );
  await post(administrator, "/auth/register", {
    name: "Mill Admin",
    email: "admin@example.test",
    password: "admin fixture strong phrase",
  });
  await db
    .collection("customers")
    .updateOne({ email: "admin@example.test" }, { $set: { role: "admin" } });
});
test("SMS login creates a verified phone account; code is single use and attempt limited", async () => {
  const sms = request.agent(app);
  const start = await post(sms, "/auth/otp/request", {
    phone: "9876543211",
    name: "SMS Customer",
  });
  assert.equal(start.status, 200);
  const challengeId = start.body.challengeId;
  assert.equal(
    (await post(sms, "/auth/otp/request", { phone: "9876543211" })).status,
    429,
  );
  assert.equal(
    (await post(sms, "/auth/otp/verify", { challengeId, code: "111111" }))
      .status,
    400,
  );
  const verified = await post(sms, "/auth/otp/verify", {
    challengeId,
    code: "123456",
  });
  assert.equal(verified.status, 200);
  assert.equal(verified.body.user.phoneVerified, true);
  assert.equal(verified.body.user.phone, "+919876543211");
  assert.equal(
    (await post(sms, "/auth/otp/verify", { challengeId, code: "123456" }))
      .status,
    400,
  );
  const expired = await post(sms, "/auth/otp/request", { phone: "9876543212" });
  await db
    .collection("otp")
    .updateOne(
      { _id: expired.body.challengeId },
      { $set: { expiresAt: new Date(0) } },
    );
  assert.equal(
    (
      await post(sms, "/auth/otp/verify", {
        challengeId: expired.body.challengeId,
        code: "123456",
      })
    ).status,
    400,
  );
  const limited = await post(sms, "/auth/otp/request", { phone: "9876543213" });
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await post(sms, "/auth/otp/verify", {
          challengeId: limited.body.challengeId,
          code: "111111",
        })
      ).status,
      400,
    );
  assert.equal(
    (
      await post(sms, "/auth/otp/verify", {
        challengeId: limited.body.challengeId,
        code: "123456",
      })
    ).status,
    400,
  );
});
test("phone linking requires the session that requested the code", async () => {
  const start = await post(alice, "/auth/otp/request", {
    phone: "9876543214",
    purpose: "link",
  });
  assert.equal(
    (
      await post(bob, "/auth/otp/verify", {
        challengeId: start.body.challengeId,
        code: "123456",
      })
    ).status,
    403,
  );
  const done = await post(alice, "/auth/otp/verify", {
    challengeId: start.body.challengeId,
    code: "123456",
  });
  assert.equal(done.status, 200);
  assert.equal(done.body.user.phoneVerified, true);
});
test("addresses stay in the owner account and exactly one is default", async () => {
  const r = await alice
    .put("/api/account/addresses")
    .set("X-LG-Client", "web")
    .set("Origin", config.origin)
    .send({ addresses: [address, { ...address, label: "Work" }] });
  assert.equal(r.status, 200);
  assert.equal(r.body.user.addresses.length, 2);
  assert.equal(r.body.user.addresses.filter((a) => a.isDefault).length, 1);
  assert.equal((await bob.get("/api/auth/me")).body.user.addresses.length, 0);
});
test("orders persist, prices are authoritative, payment flags are ignored and retries are idempotent", async () => {
  assert.equal((await post(request(app), "/orders", payload())).status, 401);
  assert.equal(
    (await post(alice, "/orders", payload({ expectedTotal: 1 }))).status,
    409,
  );
  const input = payload({
    payment: { paid: true, status: "verified" },
    customerId: "forged",
  });
  const saved = await post(alice, "/orders", input);
  assert.equal(saved.status, 201);
  assert.equal(saved.body.order.payment.status, "pending");
  assert.equal(saved.body.order.totals.total, 1700);
  assert.equal(
    (await post(alice, "/orders", input)).body.order.id,
    saved.body.order.id,
  );
  assert.equal(
    await db
      .collection("orders")
      .countDocuments({ requestId: input.requestId }),
    1,
  );
  assert.equal(
    (await bob.get(`/api/orders/${saved.body.order.id}`)).status,
    404,
  );
  assert.equal((await bob.get("/api/admin/orders")).status, 403);
  const mine = await alice.get("/api/orders");
  assert.ok(mine.body.orders.some((o) => o.id === saved.body.order.id));
  assert.ok(mine.body.summary.active >= 1);
  const bulk = await post(
    alice,
    "/orders",
    payload({
      items: [{ productSlug: "hmt-rice", packSize: "26kg Bag", quantity: 2 }],
      expectedTotal: 3300,
    }),
  );
  assert.equal(bulk.body.order.totals.delivery, 0);
  const concurrentInput = payload();
  const concurrent = await Promise.all([
    post(alice, "/orders", concurrentInput),
    post(alice, "/orders", concurrentInput),
  ]);
  assert.equal(concurrent[0].body.order.id, concurrent[1].body.order.id);
});
test("admin transitions, stale writes, manual payment audit and cancellation rules", async () => {
  const o = (await post(alice, "/orders", payload())).body.order;
  assert.equal(
    (
      await patch(administrator, `/admin/orders/${o.id}`, {
        version: o.version,
        status: "delivered",
      })
    ).status,
    409,
  );
  const confirmed = await patch(administrator, `/admin/orders/${o.id}`, {
    version: o.version,
    status: "confirmed",
  });
  assert.equal(confirmed.status, 200);
  assert.equal(
    (
      await patch(administrator, `/admin/orders/${o.id}`, {
        version: o.version,
        status: "packing",
      })
    ).status,
    409,
  );
  const packing = (
    await patch(administrator, `/admin/orders/${o.id}`, {
      version: confirmed.body.order.version,
      status: "packing",
    })
  ).body.order;
  assert.equal(
    (
      await patch(administrator, `/admin/orders/${o.id}`, {
        version: packing.version,
        status: "shipped",
      })
    ).status,
    409,
  );
  const shipped = await patch(administrator, `/admin/orders/${o.id}`, {
    version: packing.version,
    status: "shipped",
    verifyPayment: true,
    reference: "123456789012",
    tracking: "TRUCK-TEST",
  });
  assert.equal(shipped.status, 200);
  assert.equal(shipped.body.order.payment.status, "verified");
  const customerView = await alice.get(`/api/orders/${o.id}`);
  assert.equal(customerView.body.order.status, "shipped");
  assert.ok(!customerView.body.order.audit);
  assert.equal((await post(alice, `/orders/${o.id}/cancel`)).status, 409);
  const unpaid = (await post(alice, "/orders", payload({ method: "cod" }))).body
    .order;
  assert.equal((await post(bob, `/orders/${unpaid.id}/cancel`)).status, 409);
  assert.equal(
    (await post(alice, `/orders/${unpaid.id}/cancel`)).body.order.status,
    "cancelled",
  );
});
test("gateway binds server orders, signatures, amounts and captured status; webhooks are idempotent", async () => {
  const originalFetch = global.fetch;
  let gatewayId = "order_gateway_fixture",
    amount = 170000;
  global.fetch = async (url, options) => {
    if (String(url).endsWith("/orders")) {
      const sent = JSON.parse(options.body);
      assert.equal(sent.amount, amount);
      return {
        ok: true,
        async json() {
          return { id: gatewayId };
        },
      };
    }
    return {
      ok: true,
      async json() {
        return {
          id: "pay_fixture",
          order_id: gatewayId,
          amount,
          currency: "INR",
          status: "captured",
        };
      },
    };
  };
  try {
    const o = (await post(alice, "/orders", payload({ method: "card" }))).body
      .order;
    const setup = await post(alice, `/orders/${o.id}/payment`);
    assert.equal(setup.body.amount, amount);
    assert.equal(setup.body.gatewayOrderId, gatewayId);
    const payment = {
      razorpay_order_id: gatewayId,
      razorpay_payment_id: "pay_fixture",
      razorpay_signature: "a".repeat(64),
    };
    assert.equal(
      (await post(alice, `/orders/${o.id}/payment/verify`, payment)).status,
      400,
    );
    payment.razorpay_signature = sign(
      `${gatewayId}|pay_fixture`,
      config.razorpaySecret,
    );
    amount = 1;
    assert.equal(
      (await post(alice, `/orders/${o.id}/payment/verify`, payment)).status,
      400,
    );
    amount = 170000;
    const paid = await post(alice, `/orders/${o.id}/payment/verify`, payment);
    assert.equal(paid.body.order.payment.status, "verified");
    const event = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_fixture",
            order_id: gatewayId,
            amount,
            currency: "INR",
            status: "captured",
          },
        },
      },
    };
    const bytes = JSON.stringify(event);
    const signature = sign(bytes, config.webhookSecret);
    assert.equal(
      (
        await request(app)
          .post("/api/payments/webhook")
          .set("Content-Type", "application/json")
          .set("x-razorpay-signature", "invalid")
          .send(bytes)
      ).status,
      400,
    );
    assert.equal(
      (
        await request(app)
          .post("/api/payments/webhook")
          .set("Content-Type", "application/json")
          .set("x-razorpay-signature", signature)
          .send(bytes)
      ).status,
      200,
    );
    assert.equal(
      (await alice.get(`/api/orders/${o.id}`)).body.order.version,
      paid.body.order.version,
    );
  } finally {
    global.fetch = originalFetch;
  }
});
test("email verification is bound to the requested address; reset links expire, revoke sessions and cannot replay", async () => {
  assert.equal((await post(alice, "/auth/send-verification")).status, 200);
  const verification = messages
    .at(-1)
    .text.match(/verify-email\/([a-f\d]{64})/)[1];
  const verified = await post(alice, "/auth/verify-email", {
    token: verification,
  });
  assert.equal(verified.status, 200);
  assert.equal(
    (await post(alice, "/auth/verify-email", { token: verification })).status,
    400,
  );
  const unknown = await post(request(app), "/auth/forgot-password", {
    email: "unknown@example.test",
  });
  const known = await post(request(app), "/auth/forgot-password", {
    email: "alice@example.test",
  });
  assert.deepEqual(known.body, unknown.body);
  const reset = messages.at(-1).text.match(/reset-password\/([a-f\d]{64})/)[1];
  const stored = await db.collection("tokens").findOne({ purpose: "reset" });
  assert.equal(stored.hash, digest(reset));
  assert.ok(!stored.token);
  assert.equal(
    (
      await post(request(app), "/auth/reset-password", {
        token: reset,
        password: "a newly replaced strong phrase",
      })
    ).status,
    200,
  );
  assert.equal((await alice.get("/api/auth/me")).body.user, null);
  assert.equal(
    (
      await post(request(app), "/auth/reset-password", {
        token: reset,
        password: "another new strong phrase",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await post(alice, "/auth/login", {
        email: "alice@example.test",
        password: "correct horse battery staple",
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await post(alice, "/auth/login", {
        email: "alice@example.test",
        password: "a newly replaced strong phrase",
      })
    ).status,
    200,
  );
  assert.equal((await post(alice, "/account/logout-all")).status, 200);
  assert.equal((await alice.get("/api/auth/me")).body.user, null);
});
