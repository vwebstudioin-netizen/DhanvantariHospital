export * from "./doctor";
export * from "./appointment";
export * from "./patient";

import { Timestamp } from "firebase/firestore";

// Department
export interface Department {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  featuredImage?: string;
  servicesOffered: string[];
  conditionsTreated: string[];
  order: number;
  isActive: boolean;
}

// Service
export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  featuredImage?: string;
  departmentId: string;
  duration: number;
  price?: string;
  faq: { question: string; answer: string }[];
  isActive: boolean;
  order: number;
}

// Location
export interface Location {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax?: string;
  email?: string;
  coordinates: { lat: number; lng: number };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  departmentIds: string[];
  photoUrl?: string;
  isActive: boolean;
  order: number;
}

// Contact Message
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  locationId?: string;
  isRead: boolean;
  createdAt: Timestamp;
}

// Blog Post
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  author: string;
  authorId?: string;
  readingTime: number;
  status: "draft" | "published" | "scheduled";
  publishedAt?: Timestamp;
  scheduledAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// News Article
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  isPublished: boolean;
  publishedAt: Timestamp;
  createdAt: Timestamp;
}

// Review
export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  serviceId?: string;
  serviceName?: string;
  appointmentId: string;
  rating: number;
  text: string;
  isApproved: boolean;
  isFlagged: boolean;
  adminResponse?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Site Settings
export interface SiteSettings {
  clinicName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  locations: string[];
  announcementBar?: {
    text: string;
    link?: string;
    isActive: boolean;
  };
  bookingSettings: {
    minAdvanceHours: number;
    maxAdvanceDays: number;
    cancellationPolicyHours: number;
    slotDurationMinutes: number;
  };
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
    linkedin?: string;
  };
  notificationEmail: string;
  aboutText: string;
  footerText: string;
  updatedAt: Timestamp;
}

// Job
export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  locationId: string;
  type: "full-time" | "part-time" | "contract" | "temporary";
  experienceLevel: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  isActive: boolean;
  postedAt: Timestamp;
  closingDate?: Timestamp;
  createdAt: Timestamp;
}

// Job Application
export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: "received" | "reviewing" | "interviewed" | "accepted" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Insurance Plan
export interface InsurancePlan {
  id: string;
  name: string;
  shortName: string;
  type: "HMO" | "PPO" | "EPO" | "POS" | "Medicare" | "Medicaid" | "Other";
  locationIds: string[];
  isActive: boolean;
}

// Gallery Image
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category: string;
  order: number;
  createdAt: Timestamp;
}

// Newsletter
export interface NewsletterSubscription {
  id: string;
  email: string;
  createdAt: Timestamp;
}

// FAQ Item
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// Static Data Types
export interface ServiceData {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  departmentSlug: string;
  duration: number;
  features: string[];
  faq: { question: string; answer: string }[];
}

export interface DepartmentData {
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  conditionsTreated: string[];
}

export interface LocationData {
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax?: string;
  email?: string;
  coordinates: { lat: number; lng: number };
  hours: Record<string, string>;
  departmentSlugs: string[];
  image: string;
}

export interface DoctorData {
  slug: string;
  firstName: string;
  lastName: string;
  title: string;
  credentials: string;
  specialty: string;
  subspecialties: string[];
  departmentSlugs: string[];
  locationSlugs: string[];
  bio: string;
  education: { degree: string; institution: string; year: number }[];
  certifications: string[];
  languages: string[];
  gender: "male" | "female" | "other";
  acceptingNewPatients: boolean;
  offersTelehealth: boolean;
  conditionsTreated: string[];
  proceduresPerformed: string[];
  image: string;
}

export interface InsuranceData {
  name: string;
  shortName: string;
  type: "HMO" | "PPO" | "EPO" | "POS" | "Medicare" | "Medicaid" | "Other";
  locationSlugs: string[];
}

export interface Payment {
  id?: string;
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  patientName: string;
  patientEmail: string;
  patientId?: string;
  description: string;
  createdAt: Date | unknown;
}
