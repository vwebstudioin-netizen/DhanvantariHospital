"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/providers/AuthProvider";
import { CalendarDays, User, Clock, MapPin, Stethoscope, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

const departments = ["General Medicine", "General Surgery", "Gynecology", "Pulmonology", "Urology", "Nephrology", "Orthopedics", "Neurology", "Cardiology", "Critical Care"];
const locations = ["Main Campus — 123 Health Blvd", "Downtown Clinic — 456 Central Ave", "West Side Center — 789 Wellness Dr"];
const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"];

const steps = ["Department", "Doctor", "Location", "Date & Time", "Details", "Confirm"];

export default function PortalBookPage() {
  const { user } = useAuthContext();
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    department: "",
    doctor: "",
    location: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  function update(field: string, value: string) {
    setBooking((prev) => ({ ...prev, [field]: value }));
  }

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function handleSubmit() {
    alert("Demo: Booking would be created in Firestore with appointment details and slot marked as unavailable.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Book an Appointment</h1>
        <p className="text-sm text-muted-foreground">Schedule your visit in just a few steps.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              i <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-xs sm:inline ${i <= step ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`mx-1 h-px w-6 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-border bg-card p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Select Department</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => { update("department", dept); next(); }}
                  className={`rounded-xl border p-4 text-left transition hover:shadow ${
                    booking.department === dept ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <Stethoscope className="mb-2 h-5 w-5 text-primary" />
                  <p className="font-medium text-foreground">{dept}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Select Doctor</h2>
            <p className="text-sm text-muted-foreground">Available doctors in {booking.department}:</p>
            {["Dr. Priya Sharma", "Dr. Arjun Patel", "Dr. Neha Gupta"].map((doc) => (
              <button
                key={doc}
                onClick={() => { update("doctor", doc); next(); }}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:shadow ${
                  booking.doctor === doc ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{doc}</p>
                  <p className="text-xs text-muted-foreground">{booking.department}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Select Location</h2>
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => { update("location", loc); next(); }}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:shadow ${
                  booking.location === loc ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <MapPin className="h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">{loc}</p>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Select Date & Time</h2>
            <div>
              <Label>Preferred Date</Label>
              <Input type="date" value={booking.date} onChange={(e) => update("date", e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>
            {booking.date && (
              <div>
                <Label>Available Time Slots</Label>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => update("time", slot)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        booking.time === slot ? "border-primary bg-primary text-white" : "border-border hover:bg-muted"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Visit Details</h2>
            <div>
              <Label>Reason for Visit</Label>
              <Input value={booking.reason} onChange={(e) => update("reason", e.target.value)} placeholder="e.g. Annual checkup, follow-up" />
            </div>
            <div>
              <Label>Additional Notes (optional)</Label>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                rows={3}
                value={booking.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Any allergies, medications, or special requests"
              />
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <p className="font-medium text-foreground">Patient Information (auto-populated)</p>
              <p className="text-muted-foreground">Name: {user?.displayName || "Demo Patient"}</p>
              <p className="text-muted-foreground">Email: {user?.email || "patient@demo.com"}</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Confirm Your Appointment</h2>
            <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-5">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                <span className="text-sm"><strong>Department:</strong> {booking.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm"><strong>Doctor:</strong> {booking.doctor}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm"><strong>Location:</strong> {booking.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="text-sm"><strong>Date:</strong> {booking.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm"><strong>Time:</strong> {booking.time}</span>
              </div>
              {booking.reason && (
                <p className="text-sm"><strong>Reason:</strong> {booking.reason}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={back} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={next} disabled={
            (step === 3 && (!booking.date || !booking.time))
          }>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <CheckCircle className="mr-2 h-4 w-4" /> Confirm Booking
          </Button>
        )}
      </div>
    </div>
  );
}
