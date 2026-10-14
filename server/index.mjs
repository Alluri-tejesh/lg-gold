import { connectDatabase } from "./db.mjs";
import { readConfig } from "./config.mjs";
import { createApp } from "./app.mjs";
const config = await readConfig();
const { db, client } = await connectDatabase(config.uri, config.dbName);
const server = createApp(db, config).listen(
  config.port,
  process.env.HOST || "127.0.0.1",
  () =>
    console.log(`LG Gold API ready on port ${config.port}. MongoDB connected.`),
);
// Hosts/containers set HOST=0.0.0.0; local development stays bound to loopback.
async function stop() {
  server.close(async () => {
    await client.close();
    process.exit(0);
  });
}
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
