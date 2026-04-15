export const SITE_NAME =
  process.env.NEXT_PUBLIC_HOSPITAL_NAME || "Dhanvantari Hospital";
export const SITE_TAGLINE = "Emergency Treatment for Accident Cases Available";
export const SITE_DESCRIPTION =
  `${SITE_NAME} — Multi-specialty hospital offering General Medicine, Surgery, Gynecology, Pulmonology, Urology, Nephrology, Orthopedics, Neurology, Cardiology, Critical Care, and Emergency Treatment for Accident Cases. Book your appointment online.`;

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || "info@dhanvantarihospital.com";
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_HOSPITAL_PHONE || "08819293445";
export const CONTACT_PHONE2 =
  process.env.NEXT_PUBLIC_HOSPITAL_PHONE2 || "7799381456";
export const CONTACT_PHONE3 =
  process.env.NEXT_PUBLIC_HOSPITAL_PHONE3 || "7799791456";
// Formatted display string e.g. used in headers/footers
export const CONTACT_PHONES_DISPLAY = `${CONTACT_PHONE} / ${CONTACT_PHONE2} / ${CONTACT_PHONE3}`;
export const EMERGENCY_PHONE =
  process.env.NEXT_PUBLIC_HOSPITAL_PHONE || "08819293445";
export const HOSPITAL_ADDRESS =
  process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || "D.No.34-1-5, Dodipeta Vari Thota Vedhi, Beside CPI Office, Tanuku, West Godavari, Andhra Pradesh 534211";
export const HOSPITAL_WHATSAPP =
  process.env.NEXT_PUBLIC_HOSPITAL_WHATSAPP || "917799381456";
export const HOSPITAL_WHATSAPP2 =
  process.env.NEXT_PUBLIC_HOSPITAL_WHATSAPP2 || "917799791456";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Doctors", href: "/doctors" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services" },
      { label: "Departments", href: "/departments" },
    ],
  },
  {
    label: "Patients",
    href: "/portal",
    children: [
      { label: "Patient Portal", href: "/portal" },
      { label: "Book Appointment", href: "/book" },
      { label: "Queue Status", href: "/queue" },
      { label: "FAQs", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Our Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Book Appointment", href: "/book" },
    { label: "Patient Portal", href: "/portal" },
  ],
  patientResources: [
    { label: "Queue Status", href: "/queue" },
    { label: "FAQs", href: "/faq" },
    { label: "Reviews", href: "/reviews" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  company: [
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
};

export const DEVELOPER_CREDIT = "Vwebstudio";
export const DEVELOPER_URL    = "https://vwebstudio.in";

export const SOCIAL_LINKS = {
  facebook:  process.env.NEXT_PUBLIC_FACEBOOK_URL  || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  twitter:   process.env.NEXT_PUBLIC_TWITTER_URL   || "",
  youtube:   process.env.NEXT_PUBLIC_YOUTUBE_URL   || "",
  linkedin:  process.env.NEXT_PUBLIC_LINKEDIN_URL  || "",
};

export const APPOINTMENT_STATUSES = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  "no-show": { label: "No Show", color: "bg-gray-100 text-gray-800" },
} as const;

export const BLOG_CATEGORIES = [
  "Health Tips",
  "Patient Care",
  "Emergency Care",
  "General Medicine",
  "Surgery",
  "Pulmonology",
  "Urology",
  "Nephrology",
  "Women's Health",
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Wellness",
];

export const GALLERY_CATEGORIES = [
  "Facility",
  "Equipment",
  "Staff",
  "Events",
];

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const BOOKING_STEPS = [
  { id: 1, label: "Location" },
  { id: 2, label: "Department" },
  { id: 3, label: "Service" },
  { id: 4, label: "Doctor" },
  { id: 5, label: "Date & Time" },
  { id: 6, label: "Your Details" },
  { id: 7, label: "Insurance" },
  { id: 8, label: "Review" },
] as const;

export const INPATIENT_WARDS = [
  "General Ward",
  "ICU",
  "Private Room",
  "Semi-Private Room",
  "Nephrology Ward",
  "Maternity Ward",
] as const;

export const INVOICE_PAYMENT_METHODS = [
  "cash",
  "upi",
  "card",
  "insurance",
  "pending",
] as const;

export const FESTIVE_OCCASIONS = [
  "Diwali",
  "Eid",
  "Christmas",
  "New Year",
  "Pongal",
  "Holi",
  "Onam",
  "Navratri",
  "Independence Day",
  "Republic Day",
  "Doctor's Day",
] as const;

export const PER_PAGE = 12;
export const DOCTORS_PER_PAGE = 12;
export const BLOG_PER_PAGE = 9;
export const REVIEWS_PER_PAGE = 10;
