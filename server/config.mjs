import { config as loadEnv } from "dotenv";
import { secret, hashPassword } from "./security.mjs";
loadEnv({ path: "server/.env", quiet: true });
export async function readConfig() {
  const production = process.env.NODE_ENV === "production";
  const origin = process.env.APP_ORIGIN || "http://localhost:3000";
  const adminUsername = (process.env.ADMIN_USERNAME || "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (
    production &&
    (!process.env.MONGODB_URI || !origin.startsWith("https://"))
  )
    throw new Error(
      "Production requires MONGODB_URI and an HTTPS APP_ORIGIN in the server environment.",
    );
  if (production && (!adminUsername || adminPassword.length < 10))
    throw new Error(
      "Production requires ADMIN_USERNAME and an ADMIN_PASSWORD of at least 10 characters in the server environment.",
    );
  return {
    production,
    origin: new URL(origin).origin,
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB || "lg_gold",
    port: Number(process.env.PORT || 4000),
    trustProxy: Number(process.env.TRUST_PROXY || 0),
    adminUsername,
    adminPassword,
    // Signs development SMS codes; a fresh random value each start is fine.
    otpSecret: process.env.OTP_SECRET || secret(),
    dummyHash: await hashPassword(secret()),
    smtpHost: process.env.SMTP_HOST,
    smtpPort: Number(process.env.SMTP_PORT || 587),
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    mailFrom: process.env.MAIL_FROM,
    twilioSid: process.env.TWILIO_ACCOUNT_SID,
    twilioToken: process.env.TWILIO_AUTH_TOKEN,
    twilioService: process.env.TWILIO_VERIFY_SERVICE_SID,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
    razorpaySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    serveFrontend: production,
  };
}
