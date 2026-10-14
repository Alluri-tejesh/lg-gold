import React from 'react';
import { Banknote, MessageSquareLock, QrCode, Truck } from 'lucide-react';
import type { StoreSettings } from '../data/storefront';
import { TextField } from '../components/ui/Field';
import { Switch } from './ProductEditor';

const UPI = /^[\w.-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,64}$/;

export const settingsProblems = (s: StoreSettings): Partial<Record<'free' | 'charge' | 'upi' | 'payee', string>> => {
  const e: Partial<Record<'free' | 'charge' | 'upi' | 'payee', string>> = {};
  if (!(s.delivery.freeFromOrderValue >= 0)) e.free = 'Enter an amount in rupees (0 makes every delivery free).';
  if (!(s.delivery.charge >= 0)) e.charge = 'Enter the delivery charge in rupees (0 for free).';
  if (s.upiId && !UPI.test(s.upiId.trim())) e.upi = 'A UPI ID looks like name@bank, for example 9876543210@ybl.';
  if (!s.upiPayeeName.trim()) e.payee = 'Enter the name customers see in their UPI app.';
  return e;
};

const rupees = (v: string) => (v.trim() === '' ? NaN : Number(v.replace(/[^0-9.]/g, '')));

/** Delivery and payment settings. Saved with the same Save button as products. */
export const SettingsPanel: React.FC<{
  value: StoreSettings;
  onChange: (s: StoreSettings) => void;
  errors: ReturnType<typeof settingsProblems>;
  /** Whether this server can send SMS codes at all. */
  sms: 'live' | 'test' | 'none';
}> = ({ value: s, onChange, errors, sms }) => {
  const set = (patch: Partial<StoreSettings>) => onChange({ ...s, ...patch });
  const delivery = (patch: Partial<StoreSettings['delivery']>) => set({ delivery: { ...s.delivery, ...patch } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-forest-800 sm:text-4xl">Settings</h1>
        <p className="mt-1 text-muted">Delivery charges and how customers can pay. Changes apply to new orders as soon as you save.</p>
      </div>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-forest-800">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-700">
            <Truck className="h-5 w-5" />
          </span>
          Delivery
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <TextField
            label="Free delivery from (₹)"
            inputMode="numeric"
            value={Number.isFinite(s.delivery.freeFromOrderValue) ? String(s.delivery.freeFromOrderValue) : ''}
            onChange={(e) => delivery({ freeFromOrderValue: rupees(e.target.value) })}
            error={errors.free}
            hint="Orders of this much rice or more get free doorstep delivery."
          />
          <TextField
            label="Delivery charge below that (₹)"
            inputMode="numeric"
            value={Number.isFinite(s.delivery.charge) ? String(s.delivery.charge) : ''}
            onChange={(e) => delivery({ charge: rupees(e.target.value) })}
            error={errors.charge}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-forest-800">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-700">
            <QrCode className="h-5 w-5" />
          </span>
          UPI payments
        </h2>
        <p className="mt-2 text-sm text-muted">
          Customers pay straight into this UPI ID with GPay, PhonePe, Paytm or any bank app. No fees. Leave it empty to turn UPI off.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <TextField
            label="UPI ID that receives the money"
            placeholder="9876543210@ybl"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={s.upiId}
            onChange={(e) => set({ upiId: e.target.value.trim() })}
            error={errors.upi}
          />
          <TextField
            label="Name shown in the UPI app"
            value={s.upiPayeeName}
            onChange={(e) => set({ upiPayeeName: e.target.value })}
            error={errors.payee}
            maxLength={60}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-forest-800">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-700">
            <Banknote className="h-5 w-5" />
          </span>
          Cash on delivery
        </h2>
        <div className="mt-4">
          <Switch
            checked={s.cashOnDelivery}
            onChange={(v) => set({ cashOnDelivery: v })}
            label="Offer cash on delivery at checkout"
            onText="Offered"
            offText="Not offered"
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-forest-800">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-700">
            <MessageSquareLock className="h-5 w-5" />
          </span>
          SMS code sign-in
        </h2>
        <p className="mt-2 text-sm text-muted">
          Lets customers sign in with a 6-digit code sent to their mobile, next to the usual password sign-in. Each code is a paid SMS.
          Off: customers sign in with their password only.
        </p>
        <div className="mt-4">
          <Switch
            checked={!!s.smsLogin}
            onChange={(v) => set({ smsLogin: v })}
            label="Offer sign-in with an SMS code"
            onText="On"
            offText="Off"
          />
        </div>
        <p
          className={`mt-4 rounded-2xl p-4 text-sm ring-1 ${
            sms === 'live' ? 'bg-forest-50 text-forest-800 ring-forest-200' : 'bg-gold-50 text-gold-700 ring-gold-300'
          }`}
        >
          {sms === 'live'
            ? 'SMS provider connected (Twilio). Codes are sent as real SMS when this is on.'
            : sms === 'test'
              ? 'Test mode on this computer: no SMS is sent; codes are printed in the terminal running npm run dev.'
              : 'No SMS provider is connected on this server, so customers will not see the SMS option even when this is on. Add the Twilio keys in the server settings first.'}
        </p>
      </section>

      <p className="rounded-2xl bg-forest-50 p-4 text-sm text-forest-800 ring-1 ring-forest-200">
        Card, net banking and wallet payments need a Razorpay merchant account. Once Razorpay approves it, its keys go in the server settings
        (<code>server/.env</code>) and the option appears at checkout.
      </p>
    </div>
  );
};
