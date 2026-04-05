import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  locationId: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const bookingPatientSchema = z.object({
  patientName: z.string().min(2, "Name is required"),
  patientEmail: z.string().email("Valid email is required"),
  patientPhone: z
    .string()
    .min(10, "Valid phone number is required")
    .regex(/^[\d\s\-()+ ]+$/, "Invalid phone number"),
  patientDOB: z.string().min(1, "Date of birth is required"),
  isNewPatient: z.boolean(),
  notes: z.string().optional(),
});

export type BookingPatientValues = z.infer<typeof bookingPatientSchema>;

export const bookingInsuranceSchema = z.object({
  hasInsurance: z.boolean(),
  insurancePlan: z.string().optional(),
  memberId: z.string().optional(),
  groupNumber: z.string().optional(),
});

export type BookingInsuranceValues = z.infer<typeof bookingInsuranceSchema>;

export const reviewFormSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  text: z.string().min(10, "Review must be at least 10 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const jobApplicationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  coverLetter: z.string().optional(),
});

export type JobApplicationValues = z.infer<typeof jobApplicationSchema>;

export const patientProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

export type PatientProfileValues = z.infer<typeof patientProfileSchema>;

export const patientMessageSchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  text: z.string().min(5, "Message is required"),
});

export type PatientMessageValues = z.infer<typeof patientMessageSchema>;
