import { MongoClient } from "mongodb";

export async function connectDatabase(uri, name = "lg_gold") {
  if (!uri)
    throw new Error(
      "Set MONGODB_URI in server/.env. For local development run npm run dev:all.",
    );
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db(name);
  await Promise.all([
    db
      .collection("customers")
      .createIndex(
        { email: 1 },
        {
          unique: true,
          partialFilterExpression: { email: { $type: "string" } },
        },
      ),
    db
      .collection("customers")
      .createIndex(
        { phone: 1 },
        { unique: true, partialFilterExpression: { phoneVerified: true } },
      ),
    db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true }),
    db
      .collection("sessions")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db
      .collection("tokens")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db
      .collection("otp")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db
      .collection("otpCooldown")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("orders").createIndex({ orderId: 1 }, { unique: true }),
    db
      .collection("orders")
      .createIndex({ customerId: 1, requestId: 1 }, { unique: true }),
    db.collection("orders").createIndex({ customerId: 1, createdAt: -1 }),
    db
      .collection("limits")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
  return { db, client };
}
