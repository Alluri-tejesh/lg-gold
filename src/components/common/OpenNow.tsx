import React, { useEffect, useState } from 'react';

// Mill hours in India time: Monday to Saturday, 8 AM to 8 PM (matches BRAND_CONFIG.contact.operatingHours).
const OPEN_HOUR = 8;
const CLOSE_HOUR = 20;

/** Whether the mill desk is open right now, worked out in India time wherever the visitor is. */
export const millStatus = (now = new Date()): { open: boolean; text: string } => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(now);
  const day = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const workday = day !== 'Sun';
  if (workday && hour >= OPEN_HOUR && hour < CLOSE_HOUR) return { open: true, text: `Open now · until 8 PM` };
  if (workday && hour < OPEN_HOUR) return { open: false, text: 'Closed · opens 8 AM today' };
  return { open: false, text: `Closed · opens 8 AM ${day === 'Sat' ? 'Monday' : 'tomorrow'}` };
};

/** A small live badge: green dot when the desk is open, grey when it is closed. WhatsApp messages are answered next morning. */
export const OpenNowBadge: React.FC<{ dark?: boolean; className?: string }> = ({ dark, className = '' }) => {
  const [status, setStatus] = useState(() => millStatus());
  useEffect(() => {
    const iv = setInterval(() => setStatus(millStatus()), 60_000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold ${
        dark ? 'bg-white/10 text-cream ring-1 ring-white/15' : 'bg-white text-forest-800 ring-1 ring-line'
      } ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {status.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-60" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.open ? 'bg-whatsapp' : 'bg-muted/60'}`} />
      </span>
      {status.text}
    </span>
  );
};
