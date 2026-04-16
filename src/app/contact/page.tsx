import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import GoogleMap from "@/components/shared/GoogleMap";
import { locations } from "@/data/locations";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Dhanvantari Hospital. Contact any of our 1 location by phone, email, or through our online form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have a question or need to get in touch? We're here to help."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="mb-6 text-xl font-bold text-foreground">Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Locations sidebar */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-xl font-bold text-foreground">Our Locations</h2>
              <div className="space-y-6">
                {locations.map((loc) => (
                  <div
                    key={loc.slug}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <h3 className="mb-3 font-semibold text-foreground">
                      {loc.name.replace("Dhanvantari Hospital — ", "")}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {loc.address}, {loc.city}, {loc.state} {loc.zipCode}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-primary" />
                        {loc.phone}
                      </p>
                      {loc.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 shrink-0 text-primary" />
                          {loc.email}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-primary" />
                        Mon: {loc.hours.monday}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {locations[0]?.coordinates && (
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-4 text-xl font-bold text-foreground">Find Us</h2>
            <GoogleMap
              lat={locations[0].coordinates.lat}
              lng={locations[0].coordinates.lng}
              embedUrl={locations[0].mapEmbedUrl}
              label={locations[0].name}
              height="420px"
            />
            <p className="mt-3 text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {locations[0].address}, {locations[0].city}, {locations[0].state}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
