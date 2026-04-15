"use client";

import { useState, useMemo } from "react";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { BOOKING_STEPS } from "@/lib/constants";
import { locations } from "@/data/locations";
import { departments } from "@/data/departments";
import { services, getServicesByDepartment } from "@/data/services";
import { doctors, getDoctorsByDepartment } from "@/data/doctors";
import { useDoctors } from "@/hooks/useDoctors";
import { getSlotsForDate, formatTime12, getDaySchedule, formatDayScheduleSummary } from "@/lib/scheduleUtils";
import { WEEK_DAYS } from "@/types/doctor";
import { CheckCircle, ArrowLeft, ArrowRight, Calendar, MapPin, Clock, Phone, AlertCircle } from "lucide-react";

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

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BookingState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  // Fetch live doctors from Firestore (includes weeklySchedule)
  const { doctors: liveDoctors, isLoading: doctorsLoading } = useDoctors();

  const filteredServices = state.departmentSlug
    ? getServicesByDepartment(state.departmentSlug)
    : services;

  // Use live Firestore doctors (with weeklySchedule), fall back to static while loading
  const allDoctors = liveDoctors.length > 0 ? liveDoctors : doctors;

  const filteredDoctors = state.departmentSlug
    ? allDoctors.filter(
        (d) =>
          d.departmentSlugs.includes(state.departmentSlug) &&
          (!state.locationSlug || d.locationSlugs.includes(state.locationSlug))
      )
    : allDoctors;

  // Selected doctor object (from live data so weeklySchedule is available)
  const selectedDoctor = state.doctorSlug
    ? allDoctors.find((d) => d.slug === state.doctorSlug)
    : null;

  // Time slots derived from doctor's weeklySchedule for the chosen date
  const availableTimeSlots = useMemo(() => {
    if (!state.date || !selectedDoctor?.weeklySchedule) return [];
    const dateObj = new Date(state.date + "T00:00:00");
    return getSlotsForDate(selectedDoctor.weeklySchedule, dateObj);
  }, [state.date, selectedDoctor]);

  // Day schedule summary for selected doctor + date
  const selectedDaySchedule = useMemo(() => {
    if (!state.date || !selectedDoctor?.weeklySchedule) return null;
    const dateObj = new Date(state.date + "T00:00:00");
    return getDaySchedule(selectedDoctor.weeklySchedule, dateObj);
  }, [state.date, selectedDoctor]);

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return true; // Single location auto-selected, always proceed
      case 1: return !!state.departmentSlug;
      case 2: return !!state.serviceSlug;
      case 3: return !!state.doctorSlug;
      case 4: return !!state.date && !!state.time && selectedDaySchedule !== null;
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
              <p><strong>Date:</strong> {state.date} at {formatTime12(state.time)}</p>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  {locations.map((loc) => (
                    <button
                      key={loc.slug}
                      onClick={() => setState({ ...state, locationSlug: loc.slug })}
                      className={`rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                        state.locationSlug === loc.slug
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-bold text-foreground text-sm">{loc.name}</p>
                          <span className="inline-block mt-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            🚨 24/7 Emergency
                          </span>
                        </div>
                        {state.locationSlug === loc.slug && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                          {loc.address}
                        </p>
                        {loc.phone && (
                          <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                            {loc.phone}
                          </p>
                        )}
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                          Open 24 Hours — Emergency Always Available
                        </p>
                      </div>
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
                {doctorsLoading && (
                  <p className="text-sm text-muted-foreground">Loading doctors…</p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredDoctors.map((doc) => {
                    // Summarise availability: show which days are available
                    const availDays = doc.weeklySchedule
                      ? WEEK_DAYS
                          .filter((d) => doc.weeklySchedule?.[d]?.available)
                          .map((d) => d.slice(0, 3).charAt(0).toUpperCase() + d.slice(1, 3))
                          .join(", ")
                      : null;
                    return (
                      <button
                        key={doc.slug}
                        onClick={() => setState({ ...state, doctorSlug: doc.slug, date: "", time: "" })}
                        className={`rounded-lg border p-4 text-left transition ${
                          state.doctorSlug === doc.slug
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <p className="font-semibold text-foreground text-sm">
                          {doc.title} {doc.firstName} {doc.lastName}
                        </p>
                        <p className="mt-0.5 text-xs text-primary">{doc.specialty}</p>
                        {availDays && (
                          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            Available: {availDays}
                          </p>
                        )}
                      </button>
                    );
                  })}
                  {filteredDoctors.length === 0 && !doctorsLoading && (
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

                {/* Doctor schedule hint */}
                {selectedDoctor && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {selectedDoctor.title} {selectedDoctor.firstName} {selectedDoctor.lastName} — Weekly Hours
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                      {WEEK_DAYS.map((day) => {
                        const ds = selectedDoctor.weeklySchedule?.[day] ?? null;
                        return (
                          <div key={day} className={`rounded-md border p-1.5 text-xs ${
                            ds?.available ? "border-primary/30 bg-primary/5 text-foreground" : "border-border text-muted-foreground"
                          }`}>
                            <span className="font-semibold capitalize block">{day.slice(0, 3)}</span>
                            {ds?.available
                              ? <span>{ds.from}–{ds.to}</span>
                              : <span>Closed</span>
                            }
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Date picker */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Select Date</label>
                  <input
                    type="date"
                    value={state.date}
                    onChange={(e) => setState({ ...state, date: e.target.value, time: "" })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>

                {/* Time slots */}
                {state.date && (
                  <div>
                    {/* No schedule / not available day */}
                    {!selectedDoctor?.weeklySchedule ? (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          Schedule information not available for this doctor. Please call{" "}
                          <a href="tel:+918886611116" className="font-semibold underline">+91 88866 11116</a>{" "}
                          to confirm availability.
                        </p>
                      </div>
                    ) : selectedDaySchedule === null ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-200">
                          <strong>{selectedDoctor?.title} {selectedDoctor?.firstName} {selectedDoctor?.lastName}</strong> is{" "}
                          <strong>not available</strong> on{" "}
                          {new Date(state.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}.
                          Please choose a different date.
                        </p>
                      </div>
                    ) : availableTimeSlots.length === 0 ? (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          No slots available on this date. Please select another date or call{" "}
                          <a href="tel:+918886611116" className="font-semibold underline">+91 88866 11116</a>.
                        </p>
                      </div>
                    ) : (
                      <>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Available Times —{" "}
                          <span className="font-normal text-muted-foreground">
                            {formatDayScheduleSummary(selectedDaySchedule)}
                          </span>
                        </label>
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                          {availableTimeSlots.map((t) => (
                            <button
                              key={t}
                              onClick={() => setState({ ...state, time: t })}
                              className={`rounded-lg border px-2 py-2 text-xs transition ${
                                state.time === t
                                  ? "border-primary bg-primary text-white"
                                  : "border-border hover:border-primary/50 hover:bg-primary/5"
                              }`}
                            >
                              {formatTime12(t)}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {availableTimeSlots.length} slot{availableTimeSlots.length !== 1 ? "s" : ""} available
                          {selectedDaySchedule.slotDuration
                            ? ` · ${selectedDaySchedule.slotDuration} min each`
                            : ""}
                        </p>
                      </>
                    )}
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
