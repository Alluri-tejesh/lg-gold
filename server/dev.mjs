import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { config as loadEnv } from "dotenv";
loadEnv({ path: "server/.env", quiet: true });
let mongo;
if (!process.env.MONGODB_URI) {
  const dbPath = resolve(".local/mongodb");
  await mkdir(dbPath, { recursive: true });
  // This starts a real mongod process with durable WiredTiger storage; it is not a mock database.
  mongo = await MongoMemoryServer.create({
    instance: { port: 27018, dbPath, storageEngine: "wiredTiger" },
  });
  process.env.MONGODB_URI = mongo.getUri();
  console.log(
    "Local MongoDB ready. Data persists in .local/mongodb; SMS/email development inbox: .local/mail.",
  );
}
const child = spawn(process.execPath, ["--watch", "server/index.mjs"], {
  stdio: "inherit",
  env: process.env,
  windowsHide: true,
});
const stop = async () => {
  child.kill();
  if (mongo) await mongo.stop({ doCleanup: false });
  process.exit(0);
};
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
child.once("exit", async (code) => {
  if (mongo) await mongo.stop({ doCleanup: false });
  process.exit(code || 0);
});
