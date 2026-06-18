export type PaymentMode = "off" | "remind" | "on";

const DEFAULT_REMINDER_MESSAGE =
  "PAYMENT DUE: Please clear pending bill to avoid website suspension.";

const DEFAULT_MAINTENANCE_MESSAGE =
  "Website is in maintenance due to pending bill.";

const DEFAULT_CONTACT_NAME = "Vwebstudio";
const DEFAULT_CONTACT_PHONE = "8985221344";

export function getPaymentMode(): PaymentMode {
  const raw = (process.env.NEXT_PUBLIC_PAYMENT || "off").toLowerCase();
  if (raw === "remind" || raw === "on") {
    return raw;
  }
  return "off";
}

export function getReminderMessage(): string {
  return process.env.NEXT_PUBLIC_PAYMENT_REMINDER_MESSAGE || DEFAULT_REMINDER_MESSAGE;
}

export function getMaintenanceMessage(): string {
  return process.env.NEXT_PUBLIC_PAYMENT_MAINTENANCE_MESSAGE || DEFAULT_MAINTENANCE_MESSAGE;
}

export function getSupportName(): string {
  return process.env.NEXT_PUBLIC_PAYMENT_SUPPORT_NAME || DEFAULT_CONTACT_NAME;
}

export function getSupportPhone(): string {
  return process.env.NEXT_PUBLIC_PAYMENT_SUPPORT_PHONE || DEFAULT_CONTACT_PHONE;
}
