interface GoogleMapProps {
  lat?: number;
  lng?: number;
  embedUrl?: string;
  label?: string;
  zoom?: number;
  height?: string;
}

export default function GoogleMap({ lat, lng, embedUrl, label = "Dhanvantari Hospital", zoom = 16, height = "350px" }: GoogleMapProps) {
  // Use direct embed URL if provided (most accurate), else fall back to lat/lng
  const envEmbed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  const src = embedUrl || envEmbed || (lat && lng ? `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed&hl=en` : "");

  return (
    <div className="overflow-hidden rounded-xl border border-border" style={{ height }}>
      <iframe
        src={src}
        title={label}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
