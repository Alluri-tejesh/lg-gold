import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Smartphone } from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig";
import { upiLink } from "../checkout/payments";
import { money } from "./api";
import { buttonClass } from "../components/ui/Button";
import { toast } from "../components/ui/Toast";
export function DirectUpiPayment({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) {
  const [qr, setQr] = useState(""),
    [failed, setFailed] = useState(false);
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  useEffect(() => {
    let live = true;
    setQr("");
    setFailed(false);
    QRCode.toDataURL(upiLink(amount, orderId), {
      margin: 1,
      width: 440,
      color: { dark: "#0f3322", light: "#ffffff" },
    })
      .then((value) => {
        if (live) setQr(value);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [amount, orderId]);
  return (
    <div className="rounded-3xl bg-forest-50 p-5 ring-1 ring-forest-200">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        {!mobile && (
          <div className="shrink-0 rounded-2xl bg-white p-3 ring-1 ring-line">
            {qr ? (
              <img
                src={qr}
                alt={`Scan to pay ${money(amount)} for order ${orderId}`}
                className="h-40 w-40"
              />
            ) : failed ? (
              <p className="max-w-40 text-sm text-muted">
                Use the UPI ID shown here to pay in your bank app.
              </p>
            ) : (
              <div
                className="h-40 w-40 skeleton"
                aria-label="Preparing payment QR code"
              />
            )}
          </div>
        )}
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-3xl font-bold tracking-tight text-forest-800 tabular">
            {money(amount)}
          </p>
          <p className="mt-2 text-sm text-muted">
            {mobile
              ? "Open your UPI app. The amount and order reference are filled in."
              : "Scan with GPay, PhonePe, Paytm or any UPI app. The amount and order reference are filled in."}
          </p>
          {mobile && (
            <a
              href={upiLink(amount, orderId)}
              className={`mt-4 ${buttonClass("primary", "lg")}`}
            >
              <Smartphone className="h-5 w-5" />
              Pay in your UPI app
            </a>
          )}
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  BRAND_CONFIG.payments.upiId,
                );
                toast({ message: "UPI ID copied." });
              } catch {
                toast({
                  message: "Copy the UPI ID shown here.",
                  tone: "error",
                });
              }
            }}
            className="mt-4 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-forest-800 ring-1 ring-line cursor-pointer"
          >
            <span className="break-all">{BRAND_CONFIG.payments.upiId}</span>
            <Copy className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
      <p className="mt-5 border-t border-forest-200 pt-4 text-sm text-forest-800">
        Pay once, then follow the payment status in My orders. The mill verifies
        receipt. If your bank app reports success, wait for verification before
        paying again.
      </p>
    </div>
  );
}
