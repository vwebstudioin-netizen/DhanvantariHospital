"use client";

import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { BOOKING_STEPS } from "@/lib/constants";
import { locations } from "@/data/locations";
import { departments } from "@/data/departments";
import { services, getServicesByDepartment } from "@/data/services";
import { doctors, getDoctorsByDepartment } from "@/data/doctors";
import { CheckCircle, ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";

interface BookingState {
  locationSlug: string;
  departmentSlug: string;
  serviceSlug: string;
  doctorSlug: string;
  date: string;
  time: string;
  patientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    reason: string;
  };
  insurance: {
    provider: string;
    memberId: string;
    groupNumber: string;
  };
}

const initialState: BookingState = {
  locationSlug: locations[0]?.slug || "", // Auto-select single location
  departmentSlug: "",
  serviceSlug: "",
  doctorSlug: "",
  date: "",
  time: "",
  patientInfo: { firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", reason: "" },
  insurance: { provider: "", memberId: "", groupNumber: "" },
};

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BookingState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const filteredServices = state.departmentSlug
    ? getServicesByDepartment(state.departmentSlug)
    : services;

  const filteredDoctors = state.departmentSlug
    ? getDoctorsByDepartment(state.departmentSlug).filter(
        (d) => !state.locationSlug || d.locationSlugs.includes(state.locationSlug)
      )
    : doctors;

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return true; // Single location auto-selected, always proceed
      case 1: return !!state.departmentSlug;
      case 2: return !!state.serviceSlug;
      case 3: return !!state.doctorSlug;
      case 4: return !!state.date && !!state.time;
      case 5: return !!(state.patientInfo.firstName && state.patientInfo.lastName && state.patientInfo.email && state.patientInfo.phone);
      case 6: return true;
      case 7: return true;
      default: return false;
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleNext = async () => {
    if (step === 7) {
      // Final step — save to Firestore via API
      setSubmitting(true);
      try {
        const res = await fetch("/api/appointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationSlug: state.locationSlug,
            departmentSlug: state.departmentSlug,
            serviceSlug: state.serviceSlug || null,
            doctorSlug: state.doctorSlug || null,
            date: state.date,
            time: state.time,
            type: "in-person",
            patientName: `${state.patientInfo.firstName} ${state.patientInfo.lastName}`.trim(),
            patientEmail: state.patientInfo.email,
            patientPhone: state.patientInfo.phone,
            patientDOB: state.patientInfo.dateOfBirth || null,
            isNewPatient: true,
            notes: state.patientInfo.reason || "",
            insurancePlan: state.insurance.provider || null,
            memberId: state.insurance.memberId || null,
            groupNumber: state.insurance.groupNumber || null,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Booking failed");
        }
        setSubmitted(true);
      } catch (err: any) {
        alert(err.message || "Failed to save booking. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (canProceed()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  if (submitted) {
    return (
      <>
        <PageHero
          title="Booking Confirmed!"
          subtitle="Your appointment has been scheduled."
          breadcrumbs={[{ label: "Book", href: "/book" }, { label: "Confirmation" }]}
        />
        <section className="px-4 py-16">
          <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-xl font-bold text-foreground">Appointment Scheduled</h2>
            <p className="mb-4 text-muted-foreground">A confirmation email will be sent to {state.patientInfo.email}.</p>
            <div className="mb-6 rounded-lg bg-muted/50 p-4 text-left text-sm">
              <p><strong>Location:</strong> {locations.find((l) => l.slug === state.locationSlug)?.name}</p>
              <p><strong>Date:</strong> {state.date} at {state.time}</p>
              <p><strong>Doctor:</strong> {doctors.find((d) => d.slug === state.doctorSlug)?.firstName} {doctors.find((d) => d.slug === state.doctorSlug)?.lastName}</p>
            </div>
            <Button onClick={() => { setSubmitted(false); setStep(0); setState(initialState); }}>
              Book Another Appointment
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Book an Appointment"
        subtitle="Schedule your visit in a few simple steps."
        breadcrumbs={[{ label: "Book Appointment" }]}
      />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {BOOKING_STEPS.map((s, i) => (
                <div key={s.id} className="flex flex-1 items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                      i <= step
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < BOOKING_STEPS.length - 1 && (
                    <div
                      className={`mx-1 h-0.5 flex-1 transition ${
                        i < step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-sm font-medium text-foreground">
              Step {step + 1}: {BOOKING_STEPS[step].label}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-75 rounded-xl border border-border bg-card p-6">
            {/* Step 0: Location */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Select a Location</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {locations.map((loc) => (
                    <button
                      key={loc.slug}
                      onClick={() => setState({ ...state, locationSlug: loc.slug })}
                      className={`rounded-lg border p-4 text-left transition ${
                        state.locationSlug === loc.slug
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <MapPin className="mb-2 h-5 w-5 text-primary" />
                      <p className="font-semibold text-foreground text-sm">{loc.name.replace("Dhanvantari Hospital — ", "")}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{loc.address}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Department */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Select a Department</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {departments.map((dept) => (
                    <button
                      key={dept.slug}
                      onClick={() => setState({ ...state, departmentSlug: dept.slug, serviceSlug: "", doctorSlug: "" })}
                      className={`rounded-lg border p-4 text-left transition ${
                        state.departmentSlug === dept.slug
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">{dept.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Service */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Select a Service</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredServices.map((svc) => (
                    <button
                      key={svc.slug}
                      onClick={() => setState({ ...state, serviceSlug: svc.slug })}
                      className={`rounded-lg border p-4 text-left transition ${
                        state.serviceSlug === svc.slug
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">{svc.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{svc.duration} min</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Doctor */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Select a Physician</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredDoctors.map((doc) => (
                    <button
                      key={doc.slug}
                      onClick={() => setState({ ...state, doctorSlug: doc.slug })}
                      className={`rounded-lg border p-4 text-left transition ${
                        state.doctorSlug === doc.slug
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">
                        {doc.title} {doc.firstName} {doc.lastName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{doc.specialty}</p>
                    </button>
                  ))}
                  {filteredDoctors.length === 0 && (
                    <p className="col-span-2 text-sm text-muted-foreground">
                      No physicians available for the selected department and location.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Date & Time */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-foreground">Select Date & Time</h2>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Date</label>
                  <input
                    type="date"
                    value={state.date}
                    onChange={(e) => setState({ ...state, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                {state.date && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Available Times</label>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setState({ ...state, time: t })}
                          className={`rounded-lg border px-3 py-2 text-xs transition ${
                            state.time === t
                              ? "border-primary bg-primary text-white"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Patient Info */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Patient Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">First Name *</label>
                    <input
                      value={state.patientInfo.firstName}
                      onChange={(e) => setState({ ...state, patientInfo: { ...state.patientInfo, firstName: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Last Name *</label>
                    <input
                      value={state.patientInfo.lastName}
                      onChange={(e) => setState({ ...state, patientInfo: { ...state.patientInfo, lastName: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Email *</label>
                    <input
                      type="email"
                      value={state.patientInfo.email}
                      onChange={(e) => setState({ ...state, patientInfo: { ...state.patientInfo, email: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Phone *</label>
                    <input
                      type="tel"
                      value={state.patientInfo.phone}
                      onChange={(e) => setState({ ...state, patientInfo: { ...state.patientInfo, phone: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Date of Birth</label>
                    <input
                      type="date"
                      value={state.patientInfo.dateOfBirth}
                      onChange={(e) => setState({ ...state, patientInfo: { ...state.patientInfo, dateOfBirth: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Reason for Visit</label>
                    <textarea
                      value={state.patientInfo.reason}
                      onChange={(e) => setState({ ...state, patientInfo: { ...state.patientInfo, reason: e.target.value } })}
                      rows={3}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Insurance */}
            {step === 6 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Insurance Information (Optional)</h2>
                <p className="text-sm text-muted-foreground">Skip this step if you&apos;ll be self-paying.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Insurance Provider</label>
                    <input
                      value={state.insurance.provider}
                      onChange={(e) => setState({ ...state, insurance: { ...state.insurance, provider: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="e.g., Blue Cross Blue Shield"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Member ID</label>
                    <input
                      value={state.insurance.memberId}
                      onChange={(e) => setState({ ...state, insurance: { ...state.insurance, memberId: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Group Number</label>
                    <input
                      value={state.insurance.groupNumber}
                      onChange={(e) => setState({ ...state, insurance: { ...state.insurance, groupNumber: e.target.value } })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Review */}
            {step === 7 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Review Your Appointment</h2>
                <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
                  <p><strong>Location:</strong> {locations.find((l) => l.slug === state.locationSlug)?.name.replace("Dhanvantari Hospital — ", "")}</p>
                  <p><strong>Department:</strong> {departments.find((d) => d.slug === state.departmentSlug)?.name}</p>
                  <p><strong>Service:</strong> {services.find((s) => s.slug === state.serviceSlug)?.title}</p>
                  <p><strong>Doctor:</strong> {(() => { const d = doctors.find((d) => d.slug === state.doctorSlug); return d ? `${d.title} ${d.firstName} ${d.lastName}` : ""; })()}</p>
                  <p><strong>Date & Time:</strong> {state.date} at {state.time}</p>
                  <p><strong>Patient:</strong> {state.patientInfo.firstName} {state.patientInfo.lastName}</p>
                  <p><strong>Email:</strong> {state.patientInfo.email}</p>
                  {state.insurance.provider && <p><strong>Insurance:</strong> {state.insurance.provider}</p>}
                </div>
                <p className="text-xs text-muted-foreground">
                  By confirming, you agree to our cancellation policy and terms of service.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed() || submitting} className="gap-2">
              {step === 7 ? (
                submitting ? "Submitting..." : <><Calendar className="h-4 w-4" /> Confirm Booking</>
              ) : (
                <>Next <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
