"use client";

import { HOSPITAL_WHATSAPP, CONTACT_PHONE } from "@/lib/constants";

export default function WhatsAppFloat() {
  // Use HOSPITAL_WHATSAPP, fall back to CONTACT_PHONE digits only
  const raw = HOSPITAL_WHATSAPP || CONTACT_PHONE;
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  // Ensure country code — add 91 if 10-digit Indian number
  const waNumber = digits.startsWith("91") ? digits : `91${digits}`;
  const message  = encodeURIComponent("Hello, I'd like to know more about Dhanvantari Hospital services.");
  const href     = `https://wa.me/${waNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-2xl transition-transform hover:scale-105 hover:shadow-green-400/40"
    >
      {/* WhatsApp icon SVG */}
      <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0" fill="currentColor">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.746 3.046 9.38L1.052 31l5.794-1.858A15.942 15.942 0 0 0 16.004 32C24.828 32 32 24.822 32 16S24.828 0 16.004 0zm9.28 22.606c-.386 1.088-1.922 1.99-3.14 2.254-.838.178-1.932.32-5.614-1.207-4.716-1.932-7.754-6.724-7.988-7.032-.226-.308-1.902-2.53-1.902-4.826 0-2.296 1.196-3.412 1.62-3.846.384-.404.836-.506 1.116-.506.278 0 .558.002.802.014.26.014.608-.1.954.728.358.852 1.216 2.97 1.322 3.186.108.218.18.474.034.764-.14.29-.21.47-.418.724-.21.254-.44.568-.628.762-.21.216-.428.45-.184.88.244.43 1.086 1.794 2.332 2.908 1.604 1.43 2.956 1.872 3.384 2.09.426.218.674.182.922-.11.254-.296 1.088-1.268 1.378-1.706.286-.44.574-.366.97-.22.394.146 2.502 1.18 2.928 1.396.428.218.714.326.82.508.104.18.104 1.05-.282 2.14z"/>
      </svg>
      <span className="text-sm font-semibold">WhatsApp Us</span>
    </a>
  );
}
