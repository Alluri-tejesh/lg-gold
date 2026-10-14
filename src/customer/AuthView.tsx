import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, MessageCircle, ShieldCheck, Smartphone, Sparkles, Wheat } from 'lucide-react';
import { useCustomer } from './CustomerContext';
import { api, Customer } from './api';
import { ErrorNotice, RiceOrbit } from './AccountUI';
import { Button, buttonClass } from '../components/ui/Button';
import { TextField } from '../components/ui/Field';
import { AppLink } from '../components/ui/AppLink';
import { createWhatsAppUrl } from '../config/brandConfig';
import { navigate } from '../router';
import { toast } from '../components/ui/Toast';

const NEXT_ROUTES = ['checkout', 'account', 'orders', 'addresses', 'profile', 'security', 'support'];

/**
 * Sign in, create an account, and password recovery.
 * Two ways in: a 6-digit SMS code to the mobile number, or a password. The SMS option only shows when the
 * server can send codes (Twilio set up, or test mode on your computer).
 */
export function AuthView({ route = 'login', param }: { route?: string; param?: string }) {
  const { user, setUser, config, error: connectionError, refresh } = useCustomer();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [method, setMethod] = useState<'code' | 'password'>('code');
  const [challenge, setChallenge] = useState('');
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const registering = route === 'register';
  const recovery = ['forgot-password', 'reset-password', 'verify-email'].includes(route);
  const next = NEXT_ROUTES.includes(param || '') ? param! : 'account';
  const newPassword = registering || route === 'reset-password';
  const useCode = config.sms && method === 'code' && !recovery;

  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const switchMethod = (m: 'code' | 'password') => {
    setMethod(m);
    setError('');
    setChallenge('');
    setCode('');
  };

  async function sendCode() {
    if (registering && name.trim().length < 2) return setError('Please enter your name.');
    if (phone.replace(/\D/g, '').length < 10) return setError('Enter your 10-digit mobile number.');
    setError('');
    setBusy(true);
    try {
      const r = await api<{ challengeId: string; resendAfter: number }>('/auth/otp/request', 'POST', {
        phone,
        ...(registering ? { name } : {}),
      });
      setChallenge(r.challengeId);
      setCooldown(r.resendAfter);
      setCode('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (useCode && !challenge) return sendCode();
    setError('');
    setBusy(true);
    try {
      if (useCode) {
        const r = await api<{ user: Customer; notice?: string }>('/auth/otp/verify', 'POST', { challengeId: challenge, code });
        setUser(r.user);
        if (r.notice) toast({ message: r.notice, tone: 'info', duration: 9000 });
        navigate(next);
      } else if (route === 'forgot-password') {
        const result = await api<{ message: string }>('/auth/forgot-password', 'POST', { email });
        setSuccess(result.message);
      } else if (route === 'reset-password') {
        await api('/auth/reset-password', 'POST', { token: param, password });
        setUser(null);
        setSuccess('Your password has been changed. Sign in with your new password.');
      } else if (route === 'verify-email') {
        await api('/auth/verify-email', 'POST', { token: param });
        await refresh();
        setSuccess('Your email is verified. You’re all set.');
      } else {
        if (route === 'login' && !identifier.includes('@') && identifier.replace(/\D/g, '').length < 10) {
          setError('Enter your 10-digit mobile number, or the email on your account.');
          return;
        }
        const result = await api<{ user: Customer }>(
          registering ? '/auth/register' : '/auth/login',
          'POST',
          registering ? { name, phone, email, password } : { identifier, password },
        );
        setUser(result.user);
        navigate(next);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const title =
    route === 'forgot-password'
      ? 'Let’s get you back in.'
      : route === 'reset-password'
        ? 'Choose a new password.'
        : route === 'verify-email'
          ? 'One last little step.'
          : challenge
            ? 'Check your phone.'
            : registering
            ? 'Make yourself at home.'
            : 'Good to have you back.';
  const subtitle = recovery
    ? 'Keep your account yours.'
    : challenge
      ? `We sent a 6-digit code by SMS to +91 ${phone.replace(/\D/g, '').slice(-10)}. It works for 5 minutes.`
      : registering
        ? 'Save your address once, then reorder in two taps and follow every delivery.'
        : useCode
          ? 'Sign in with a code sent to your mobile. No password needed.'
          : 'Sign in with your mobile number and password.';

  const passwordField = (
    <div className="relative">
      <TextField
        label={newPassword ? 'Create a password' : 'Password'}
        type={showPassword ? 'text' : 'password'}
        autoComplete={newPassword ? 'new-password' : 'current-password'}
        minLength={newPassword ? 10 : 1}
        maxLength={128}
        hint={newPassword ? 'At least 10 characters. A short phrase is easy to remember, like “rice for sunday lunch”.' : undefined}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="pr-14"
      />
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-7 grid h-11 w-11 place-items-center text-muted cursor-pointer"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );

  // Without email set up on the server, the mill resets passwords: one WhatsApp message.
  const whatsappReset = route === 'forgot-password' && !config.email;

  return (
    <section className="auth-section bg-cream py-8 sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-0 px-4 lg:grid-cols-[.95fr_1.05fr]">
        <aside className="auth-story relative hidden overflow-hidden rounded-l-[40px] bg-forest-950 p-12 text-white lg:flex lg:flex-col">
          <p className="text-xs uppercase tracking-[.24em] text-gold-300">LG GOLD · FROM OUR MILL</p>
          <h2 className="relative z-10 mt-10 max-w-sm font-display text-5xl leading-[1.15]">
            A grain of care.
            <br />
            <span className="italic text-gold-300">A home full of good.</span>
          </h2>
          <RiceOrbit />
          <div className="relative z-10 mt-auto">
            <p className="max-w-sm text-lg text-cream/80">From the first bag to the everyday favourite. Your rice story lives here.</p>
            <div className="mt-8 grid gap-4 border-t border-white/15 pt-6 text-sm text-cream/80">
              <span className="flex items-center gap-3">
                <TruckIcon />
                Follow every order from mill to door
              </span>
              <span className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold-300" />
                Your details stay with the mill, never shared
              </span>
              <span className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gold-300" />
                Reorder your usual in two taps
              </span>
            </div>
          </div>
        </aside>

        <div className="auth-form-panel rounded-[32px] bg-white px-6 py-9 ring-1 ring-line sm:px-12 sm:py-12 lg:rounded-l-none lg:rounded-r-[40px]">
          <AppLink to={next === 'checkout' ? 'checkout' : 'products'} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
            <ArrowLeft className="h-4 w-4" />
            {next === 'checkout' ? 'Back to checkout' : 'Back to the shop'}
          </AppLink>
          <div className="mt-5">
            <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700">{challenge ? <Smartphone /> : recovery ? <KeyRound /> : <Wheat />}</span>
            <h1 className="mt-5 font-display text-4xl leading-tight text-forest-800">{title}</h1>
            <p className="mt-3 text-muted">{subtitle}</p>
          </div>

          {user && !recovery ? (
            <div className="mt-8">
              <p className="text-forest-800">You’re signed in as {user.name}.</p>
              <AppLink to={next} className={`mt-5 ${buttonClass('primary', 'lg')}`}>
                Continue <ArrowRight className="h-4 w-4" />
              </AppLink>
            </div>
          ) : success ? (
            <div className="mt-8 rounded-3xl bg-forest-50 p-6 text-forest-800 animate-pop-in" role="status">
              <CheckCircle2 className="h-8 w-8" />
              <p className="mt-4">{success}</p>
              <AppLink to={route === 'verify-email' ? 'account' : 'login'} className={`mt-6 ${buttonClass('primary')}`}>
                {route === 'verify-email' ? 'My account' : 'Sign in'}
              </AppLink>
            </div>
          ) : whatsappReset ? (
            <div className="mt-8 space-y-5">
              {config.sms && (
                <div className="rounded-3xl bg-forest-50 p-6 ring-1 ring-forest-200">
                  <p className="font-semibold text-forest-800">Fastest: sign in with an SMS code</p>
                  <p className="mt-2 text-ink-soft">We text a 6-digit code to your mobile number. Then set a new password under Account › Security.</p>
                  <AppLink to="login" className={`mt-5 ${buttonClass('primary', 'lg', true)}`}>
                    <Smartphone className="h-5 w-5" /> Get a sign-in code
                  </AppLink>
                </div>
              )}
              <div className="rounded-3xl bg-cream p-6">
                <p className="font-semibold text-forest-800">{config.sms ? 'Or message the mill on WhatsApp' : 'Message the mill on WhatsApp'}</p>
                <p className="mt-2 text-ink-soft">
                  Send us your name and mobile number. We reply with a temporary password, usually within the hour (Mon–Sat, 8 AM–8 PM).
                </p>
                <a
                  href={createWhatsAppUrl('Hello LG Gold, I forgot my website password. Please help me reset it.\n\nName: \nMobile: ')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 w-full ${buttonClass('whatsapp', 'lg', true)}`}
                >
                  <MessageCircle className="h-5 w-5" /> Ask for a new password
                </a>
              </div>
              <p className="text-center text-sm text-muted">
                Remembered it?{' '}
                <AppLink to="login" className="inline-flex min-h-11 items-center font-semibold text-forest-800 underline">
                  Sign in
                </AppLink>
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              {config.sms && !recovery && !challenge && (
                <div role="group" aria-label="How to sign in" className="grid grid-cols-2 rounded-full bg-cream p-1.5">
                  {(['code', 'password'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={method === m}
                      onClick={() => switchMethod(m)}
                      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        method === m ? 'bg-forest-800 text-white shadow-soft' : 'text-muted hover:text-forest-800'
                      }`}
                    >
                      {m === 'code' ? <Smartphone className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
                      {m === 'code' ? 'SMS code' : 'Password'}
                    </button>
                  ))}
                </div>
              )}
              {useCode && challenge ? (
                <>
                  <TextField
                    label="6-digit code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    required
                    autoFocus
                    className="text-center text-2xl font-semibold tracking-[0.5em] tabular"
                  />
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setChallenge('');
                        setCode('');
                        setError('');
                      }}
                      className="min-h-11 font-semibold text-forest-800 underline cursor-pointer"
                    >
                      Change number
                    </button>
                    <button
                      type="button"
                      disabled={cooldown > 0 || busy}
                      onClick={sendCode}
                      className="min-h-11 font-semibold text-forest-800 disabled:font-normal disabled:text-muted cursor-pointer disabled:cursor-default"
                    >
                      {cooldown ? `Send again in ${cooldown}s` : 'Send the code again'}
                    </button>
                  </div>
                </>
              ) : useCode ? (
                <>
                  {registering && (
                    <TextField label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} />
                  )}
                  <TextField
                    label="Mobile number"
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="tel"
                    placeholder="98765 43210"
                    hint={registering ? 'We text you a code to confirm it. You sign in with this number.' : 'New number? We create your account when you confirm the code.'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoFocus
                  />
                </>
              ) : null}
              {!useCode && registering && (
                <TextField label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} />
              )}
              {!useCode && route === 'login' && (
                <TextField
                  label="Mobile number or email"
                  autoComplete="username"
                  inputMode={/[a-z@]/i.test(identifier) ? 'email' : 'tel'}
                  placeholder="98765 43210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoFocus
                />
              )}
              {!useCode && registering && (
                <>
                  <TextField
                    label="Mobile number"
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="tel"
                    placeholder="98765 43210"
                    hint="You sign in with this number. The mill also uses it for delivery updates."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <TextField
                    label="Email (optional)"
                    type="email"
                    autoComplete="email"
                    hint="For order receipts and password reset links."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              )}
              {route === 'forgot-password' && (
                <TextField label="Email address on your account" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              )}
              {!useCode && (route === 'login' || newPassword) && passwordField}
              {useCode && config.localSms && (
                <p className="rounded-2xl bg-gold-50 p-4 text-sm text-gold-700 ring-1 ring-gold-300">
                  Test mode (only on your computer): no SMS is sent. The code is printed in the terminal running <code>npm run dev</code>.
                </p>
              )}

              <ErrorNotice error={error || connectionError} />
              {connectionError && (
                <Button variant="outline" block onClick={refresh}>
                  Try again
                </Button>
              )}
              <Button type="submit" size="lg" block loading={busy} iconRight={<ArrowRight className="h-4 w-4" />}>
                {useCode
                  ? challenge
                    ? 'Verify & continue'
                    : 'Send me a code'
                  : route === 'forgot-password'
                  ? 'Send reset link'
                  : route === 'reset-password'
                    ? 'Save new password'
                    : route === 'verify-email'
                      ? 'Verify my email'
                      : registering
                        ? 'Create account'
                        : 'Sign in'}
              </Button>
              {route === 'login' && !useCode && (
                <AppLink to="forgot-password" className="block min-h-11 text-center text-sm font-semibold text-forest-800 underline">
                  Forgot your password?
                </AppLink>
              )}
              {!recovery && (
                <p className="text-center text-sm text-muted">
                  {registering ? 'Already have an account?' : 'New here?'}{' '}
                  <AppLink to={registering ? 'login' : 'register'} param={param} className="inline-flex min-h-11 items-center font-semibold text-forest-800 underline">
                    {registering ? 'Sign in' : 'Create an account'}
                  </AppLink>
                </p>
              )}
              {!recovery && next === 'checkout' && (
                <p className="rounded-2xl bg-cream p-4 text-center text-sm text-ink-soft">
                  Your cart is saved. You go straight back to checkout after this step.
                </p>
              )}
              <p className="flex items-center justify-center gap-2 border-t border-line pt-5 text-xs text-muted">
                <LockKeyhole className="h-3.5 w-3.5" />
                Codes and passwords stay private. The mill never asks for them.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function TruckIcon() {
  return (
    <svg className="h-5 w-5 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 6h11v11H3zM14 10h4l3 4v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}
