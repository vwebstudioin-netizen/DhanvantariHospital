import { SITE_NAME, CONTACT_PHONE, SITE_TAGLINE } from "@/lib/constants";

interface TokenSlipProps {
  tokenNumber: string;
  patientName: string;
  date?: string;
  time?: string;
}

export default function TokenSlip({ tokenNumber, patientName, date, time }: TokenSlipProps) {
  const now = new Date();
  const displayDate = date || now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const displayTime = time || now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div style={{ width: "80mm", fontFamily: "Arial, sans-serif", padding: "12px", textAlign: "center", border: "1px dashed #ccc" }}>
      {/* Logo + Hospital Name */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px" }}>
        <img src="/images/logo.jpg" alt="Logo" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: "900", color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "1px" }}>{SITE_NAME}</div>
          <div style={{ fontSize: "9px", color: "#666" }}>{SITE_TAGLINE}</div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px dashed #ccc", margin: "8px 0" }} />

      <p style={{ margin: "0", fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "#999" }}>
        Token Number
      </p>
      <p style={{ margin: "4px 0", fontSize: "48px", fontWeight: "bold", lineHeight: "1", color: "#1e3a5f" }}>
        #{tokenNumber}
      </p>

      <hr style={{ border: "none", borderTop: "1px dashed #ccc", margin: "8px 0" }} />

      <p style={{ margin: "4px 0", fontSize: "14px", fontWeight: "600" }}>{patientName}</p>
      <p style={{ margin: "4px 0", fontSize: "11px", color: "#666" }}>{displayDate} &bull; {displayTime}</p>

      <hr style={{ border: "none", borderTop: "1px dashed #ccc", margin: "8px 0" }} />

      <p style={{ margin: "4px 0", fontSize: "10px", color: "#888" }}>Please wait for your number to be called</p>
      <p style={{ margin: "4px 0", fontSize: "10px", color: "#888" }}>Ph: {CONTACT_PHONE}</p>
    </div>
  );
}
