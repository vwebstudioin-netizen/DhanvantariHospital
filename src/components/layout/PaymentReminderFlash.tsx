"use client";

import { getPaymentMode, getReminderMessage, getMaintenanceMessage, getSupportName, getSupportPhone } from "@/lib/payment-mode";

function Banner({ isDown }: { isDown: boolean }) {
  const bg = isDown ? "bg-gray-900 border-gray-700" : "bg-red-600 border-red-400";
  const message = isDown ? getMaintenanceMessage() : getReminderMessage();
  const label = isDown ? "Website Down" : "⚠ Payment Due";

  return (
    <div className={`${bg} animate-pulse border-b px-4 py-4 text-center text-white shadow-xl`}>
      <p className="text-lg font-black uppercase tracking-widest">{label}</p>
      <p className="mt-1 text-sm font-semibold">{message}</p>
      <p className="mt-1 text-base font-bold">
        Contact {getSupportName()}: {getSupportPhone()}
      </p>
    </div>
  );
}

export default function PaymentReminderFlash() {
  const mode = getPaymentMode();

  if (mode !== "remind" && mode !== "on") {
    return null;
  }

  const isDown = mode === "on";

  return (
    <>
      {/* Top banner */}
      <div className="fixed inset-x-0 top-0 z-[9999]">
        <Banner isDown={isDown} />
      </div>
      {/* Bottom banner */}
      <div className="fixed inset-x-0 bottom-0 z-[9999]">
        <Banner isDown={isDown} />
      </div>
      {/* Spacer so content isn't hidden behind top banner */}
      <div className="h-[88px]" />
    </>
  );
}
