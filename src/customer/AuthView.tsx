import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wheat,
} from "lucide-react";
import { useCustomer } from "./CustomerContext";
import { api, Customer } from "./api";
import { ErrorNotice, RiceOrbit } from "./AccountUI";
import { Button, buttonClass } from "../components/ui/Button";
import { TextField } from "../components/ui/Field";
import { AppLink } from "../components/ui/AppLink";
import { navigate } from "../router";

export function AuthView({
  route = "login",
  param,
}: {
  route?: string;
  param?: string;
}) {
  const {
    user,
    setUser,
    config,
    error: connectionError,
    refresh,
  } = useCustomer();
  const [mode, setMode] = useState<"sms" | "password">("sms");
  const [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const [challenge, setChallenge] = useState(""),
    [code, setCode] = useState(""),
    [cooldown, setCooldown] = useState(0);
  const registering = route === "register";
  const recovery = [
    "forgot-password",
    "reset-password",
    "verify-email",
  ].includes(route);
  const next = [
    "checkout",
    "account",
    "orders",
    "addresses",
    "profile",
    "security",
    "support",
    "admin-orders",
  ].includes(param || "")
    ? param!
    : "account";
  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);
  const authenticated = (u: Customer) => {
    setUser(u);
    navigate(next);
  };
  async function sendCode() {
    if (registering && name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await api<{ challengeId: string; resendAfter: number }>(
        "/auth/otp/request",
        "POST",
        { phone, ...(registering ? { name } : {}) },
      );
      setChallenge(response.challengeId);
      setCooldown(response.resendAfter);
      setCode("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (route === "forgot-password") {
        const result = await api<{ message: string }>(
          "/auth/forgot-password",
          "POST",
          { email },
        );
        setSuccess(result.message);
      } else if (route === "reset-password") {
        await api("/auth/reset-password", "POST", { token: param, password });
        setUser(null);
        setSuccess(
          "Your password has been reset. Sign in with your new password.",
        );
      } else if (route === "verify-email") {
        await api("/auth/verify-email", "POST", { token: param });
        await refresh();
        setSuccess("Your email is verified. You’re all set.");
      } else if (mode === "sms") {
        if (!challenge) {
          setBusy(false);
          await sendCode();
          return;
        }
        const result = await api<{ user: Customer }>(
          "/auth/otp/verify",
          "POST",
          { challengeId: challenge, code },
        );
        authenticated(result.user);
      } else {
        const result = await api<{ user: Customer }>(
          registering ? "/auth/register" : "/auth/login",
          "POST",
          { email, password, ...(registering ? { name } : {}) },
        );
        authenticated(result.user);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const title =
    route === "forgot-password"
      ? "Let’s get you back in."
      : route === "reset-password"
        ? "A fresh start."
        : route === "verify-email"
          ? "One last little step."
          : challenge
            ? "Check your phone."
            : registering
              ? "Make yourself at home."
              : "Good to have you back.";
  return (
    <section className="auth-section bg-cream py-8 sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-0 px-4 lg:grid-cols-[.95fr_1.05fr]">
        <aside className="auth-story relative hidden overflow-hidden rounded-l-[40px] bg-forest-950 p-12 text-white lg:flex lg:flex-col">
          <p className="text-xs uppercase tracking-[.24em] text-gold-300">
            LG GOLD · FROM OUR MILL
          </p>
          <h2 className="relative z-10 mt-10 max-w-sm font-display text-5xl leading-[1.15]">
            A grain of care.
            <br />
            <span className="italic text-gold-300">A home full of good.</span>
          </h2>
          <RiceOrbit />
          <div className="relative z-10 mt-auto">
            <p className="max-w-sm text-lg text-cream/80">
              From the first bag to the everyday favourite. Your rice story
              lives here.
            </p>
            <div className="mt-8 grid gap-4 border-t border-white/15 pt-6 text-sm text-cream/80">
              <span className="flex items-center gap-3">
                <TruckIcon />
                Follow every order from mill to door
              </span>
              <span className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold-300" />
                Your account, safely in your hands
              </span>
              <span className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gold-300" />
                Less typing. More time at the table.
              </span>
            </div>
          </div>
        </aside>
        <div className="auth-form-panel rounded-[32px] bg-white px-6 py-9 ring-1 ring-line sm:px-12 sm:py-12 lg:rounded-l-none lg:rounded-r-[40px]">
          <AppLink
            to="products"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the shop
          </AppLink>
          <div className="mt-5">
            <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700">
              {challenge ? <Smartphone /> : recovery ? <KeyRound /> : <Wheat />}
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight text-forest-800">
              {title}
            </h1>
            <p className="mt-3 text-muted">
              {challenge
                ? `We sent a 6-digit code to +91 ${phone.replace(/\D/g, "").slice(-10)}. It expires in 5 minutes.`
                : recovery
                  ? "Keep your account yours."
                  : "Your orders and delivery details, in one place."}
            </p>
          </div>
          {user && !recovery ? (
            <div className="mt-8">
              <p className="text-forest-800">
                You’re already signed in as {user.name}.
              </p>
              <AppLink
                to={next}
                className={`mt-5 ${buttonClass("primary", "lg")}`}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </AppLink>
            </div>
          ) : (
            <>
              {!recovery && !challenge && (
                <div
                  role="group"
                  aria-label="Sign-in method"
                  className="mt-7 grid grid-cols-2 rounded-full bg-cream p-1.5"
                >
                  <button
                    type="button"
                    aria-pressed={mode === "sms"}
                    onClick={() => {
                      setMode("sms");
                      setError("");
                    }}
                    className={`min-h-11 rounded-full text-sm font-semibold transition-all cursor-pointer ${mode === "sms" ? "bg-forest-800 text-white shadow-soft" : "text-muted"}`}
                  >
                    SMS code
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === "password"}
                    onClick={() => {
                      setMode("password");
                      setError("");
                    }}
                    className={`min-h-11 rounded-full text-sm font-semibold transition-all cursor-pointer ${mode === "password" ? "bg-forest-800 text-white shadow-soft" : "text-muted"}`}
                  >
                    Email & password
                  </button>
                </div>
              )}
              {success ? (
                <div
                  className="mt-8 rounded-3xl bg-forest-50 p-6 text-forest-800"
                  role="status"
                >
                  <CheckCircle2 className="h-8 w-8" />
                  <p className="mt-4">{success}</p>
                  <AppLink
                    to={route === "verify-email" ? "account" : "login"}
                    className={`mt-6 ${buttonClass("primary")}`}
                  >
                    {route === "verify-email"
                      ? "My account"
                      : "Back to sign in"}
                  </AppLink>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-7 space-y-5">
                  {!recovery && registering && !challenge && (
                    <TextField
                      label="Full name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={80}
                    />
                  )}
                  {!recovery && mode === "sms" ? (
                    challenge ? (
                      <>
                        <TextField
                          label="6-digit SMS code"
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          value={code}
                          onChange={(e) =>
                            setCode(e.target.value.replace(/\D/g, ""))
                          }
                          required
                          className="otp-input"
                          autoFocus
                        />
                        <div className="flex flex-wrap justify-between gap-2 text-sm">
                          <button
                            type="button"
                            onClick={() => {
                              setChallenge("");
                              setCode("");
                              setError("");
                            }}
                            className="min-h-11 text-forest-800 underline cursor-pointer"
                          >
                            Change mobile number
                          </button>
                          <button
                            type="button"
                            disabled={cooldown > 0 || busy}
                            onClick={sendCode}
                            className="min-h-11 text-forest-800 disabled:text-muted cursor-pointer"
                          >
                            {cooldown
                              ? `Resend in ${cooldown}s`
                              : "Resend code"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <TextField
                        label="Mobile number"
                        type="tel"
                        autoComplete="tel-national"
                        inputMode="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    )
                  ) : (
                    route !== "reset-password" &&
                    route !== "verify-email" && (
                      <TextField
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    )
                  )}
                  {((!recovery && mode === "password") ||
                    route === "reset-password") && (
                    <div className="relative">
                      <TextField
                        label={
                          registering || route === "reset-password"
                            ? "Create a password"
                            : "Password"
                        }
                        type={showPassword ? "text" : "password"}
                        autoComplete={
                          registering || route === "reset-password"
                            ? "new-password"
                            : "current-password"
                        }
                        minLength={
                          registering || route === "reset-password" ? 10 : 1
                        }
                        maxLength={128}
                        hint={
                          registering || route === "reset-password"
                            ? "At least 10 characters. A memorable phrase works well."
                            : undefined
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-14"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-2 top-7 grid h-11 w-11 place-items-center text-muted cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  )}
                  {!recovery && mode === "sms" && !config.sms && (
                    <p className="rounded-xl bg-gold-50 p-4 text-sm text-gold-700">
                      SMS sign-in is currently unavailable. Please use email and
                      password.
                    </p>
                  )}
                  <ErrorNotice error={error || connectionError} />
                  {import.meta.env.DEV && mode === 'sms' && !recovery && config.localSms && <p className="rounded-xl bg-gold-50 p-4 text-sm text-gold-700">Local SMS test mode: read the code in the newest message file under .local/mail. Real SMS starts after the provider is connected.</p>}
                  {connectionError && <Button variant="outline" block onClick={refresh}>Retry connection</Button>}
                  <Button
                    type="submit"
                    size="lg"
                    block
                    loading={busy}
                    disabled={!recovery && mode === "sms" && !config.sms}
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    {route === "forgot-password"
                      ? "Send reset link"
                      : route === "reset-password"
                        ? "Save new password"
                        : route === "verify-email"
                          ? "Verify my email"
                          : mode === "sms"
                            ? challenge
                              ? "Verify & continue"
                              : "Send SMS code"
                            : registering
                              ? "Create account"
                              : "Sign in"}
                  </Button>
                  {!recovery && mode === "password" && !registering && (
                    <AppLink
                      to="forgot-password"
                      className="block min-h-11 text-center text-sm font-semibold text-forest-800 underline"
                    >
                      Forgot your password?
                    </AppLink>
                  )}
                  {!recovery && (
                    <p className="text-center text-sm text-muted">
                      {registering
                        ? "Already at the table?"
                        : "Your first visit?"}{" "}
                      <AppLink
                        to={registering ? "login" : "register"}
                        param={param}
                        className="inline-flex min-h-11 items-center font-semibold text-forest-800 underline"
                      >
                        {registering ? "Sign in" : "Create an account"}
                      </AppLink>
                    </p>
                  )}
                  <p className="flex items-center justify-center gap-2 border-t border-line pt-5 text-xs text-muted">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    Your password and login codes are never shared.
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
function TruckIcon() {
  return (
    <svg
      className="h-5 w-5 text-gold-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3 6h11v11H3zM14 10h4l3 4v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}
