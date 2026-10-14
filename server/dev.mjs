import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { config as loadEnv } from "dotenv";
loadEnv({ path: "server/.env", quiet: true });

const port = Number(process.env.PORT || 4000);

// Already running (another terminal, or an earlier `npm run dev` still open)? Use it instead of fighting over the
// port and the database files. Stay alive so `npm run dev` keeps the website running.
const existing = await fetch(`http://127.0.0.1:${port}/api/health`, {
  signal: AbortSignal.timeout(1500),
})
  .then((r) => r.ok)
  .catch(() => false);
if (existing) {
  console.log(
    `The LG Gold API is already running on port ${port}; using that one.`,
  );
  setInterval(() => {}, 1 << 30);
} else {
  let mongo;
  if (!process.env.MONGODB_URI) {
    const dbPath = resolve(".local/mongodb");
    await mkdir(dbPath, { recursive: true });
    // This starts a real mongod process with durable WiredTiger storage; it is not a mock database.
    try {
      mongo = await MongoMemoryServer.create({
        instance: { port: 27018, dbPath, storageEngine: "wiredTiger" },
      });
    } catch (err) {
      if (/DBPathInUse|mongod\.lock/.test(String(err))) {
        console.error(
          "\nThe local database is already open in another program (usually an older `npm run dev` or `npm run dev:api`).\n" +
            "Close that terminal, or run this once and try again:\n\n" +
            "    taskkill /IM mongod.exe /F      (Windows)\n" +
            "    pkill mongod                    (Mac / Linux)\n",
        );
        process.exit(1);
      }
      throw err;
    }
    process.env.MONGODB_URI = mongo.getUri();
    console.log(
      "Local MongoDB ready. Data persists in .local/mongodb; development email inbox: .local/mail.",
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
}
