"use client";

import { getPaymentMode, getReminderMessage, getSupportPhone } from "@/lib/payment-mode";

export default function PaymentReminderFlash() {
  const mode = getPaymentMode();

  if (mode !== "remind") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[9999] border-b border-red-300 bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg animate-pulse">
      {getReminderMessage()} Contact: {getSupportPhone()}
    </div>
  );
}
