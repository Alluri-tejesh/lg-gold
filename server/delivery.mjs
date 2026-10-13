import nodemailer from "nodemailer";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID, randomInt } from "node:crypto";
import { sign, equal } from "./security.mjs";

export function createDelivery(config) {
  const smtp = config.smtpHost
    ? nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort || 587,
        secure: config.smtpPort === 465,
        auth: { user: config.smtpUser, pass: config.smtpPassword },
      })
    : null;
  const twilio = !!(
    config.twilioSid &&
    config.twilioToken &&
    config.twilioService
  );
  const local = async (message) => {
    if (config.production)
      throw Object.assign(
        new Error(
          "Message delivery is not configured. Please contact the mill.",
        ),
        { status: 503 },
      );
    const dir = resolve(".local/mail");
    await mkdir(dir, { recursive: true });
    await writeFile(
      resolve(dir, `${Date.now()}-${randomUUID()}.json`),
      JSON.stringify({ ...message, developmentOnly: true }, null, 2),
    );
  };
  async function verifyApi(path, data) {
    const res = await fetch(
      `https://verify.twilio.com/v2/Services/${config.twilioService}/${path}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(12000),
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.twilioSid}:${config.twilioToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      },
    );
    const result = await res.json();
    if (!res.ok)
      throw Object.assign(
        new Error(
          "Could not deliver or check your code. Please try again shortly.",
        ),
        { status: 503 },
      );
    return result;
  }
  return {
    smsAvailable: twilio || !config.production,
    localSms: !twilio && !config.production,
    emailAvailable: !!smtp || !config.production,
    async email(to, subject, text) {
      if (smtp)
        await smtp.sendMail({ from: config.mailFrom, to, subject, text });
      else await local({ channel: "email", to, subject, text });
    },
    async sendOtp(phone, challengeId) {
      if (twilio) {
        await verifyApi("Verifications", { To: phone, Channel: "sms" });
        return { provider: "twilio" };
      }
      const code = String(randomInt(100000, 1000000));
      await local({
        channel: "sms",
        to: phone,
        text: `Your LG Gold login code is ${code}. It expires in 5 minutes. Do not share it.`,
        challengeId,
      });
      return {
        provider: "local",
        codeHash: sign(`${challengeId}:${code}`, config.otpSecret),
      };
    },
    async checkOtp(challenge, code) {
      if (challenge.provider === "twilio")
        return (
          (
            await verifyApi("VerificationCheck", {
              To: challenge.phone,
              Code: code,
            })
          ).status === "approved"
        );
      return equal(
        challenge.codeHash,
        sign(`${challenge._id}:${code}`, config.otpSecret),
      );
    },
  };
}
