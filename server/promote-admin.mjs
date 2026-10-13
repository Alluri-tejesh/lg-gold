import { connectDatabase } from "./db.mjs";
import { readConfig } from "./config.mjs";
const identifier = process.argv[2];
if (!identifier)
  throw new Error(
    "Usage: npm run admin:promote -- email@example.com OR +919876543210. Register and verify the account first.",
  );
const cfg = await readConfig();
const { db, client } = await connectDatabase(
  cfg.uri || "mongodb://127.0.0.1:27018",
  cfg.dbName,
);
try {
  const query = identifier.includes("@")
    ? { email: identifier.toLowerCase(), emailVerified: true }
    : { phone: identifier, phoneVerified: true };
  const result = await db
    .collection("customers")
    .updateOne(query, { $set: { role: "admin" } });
  if (!result.matchedCount)
    throw new Error(
      "No verified customer matches that identifier. Sign up and verify it first.",
    );
  console.log("Verified customer promoted to order administrator.");
} finally {
  await client.close();
}
