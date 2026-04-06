interface GoogleMapProps {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
  height?: string;
}

export default function GoogleMap({ lat, lng, label = "Dhanvantari Hospital", zoom = 16, height = "350px" }: GoogleMapProps) {
  const query = encodeURIComponent(label);
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed&hl=en`;

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
