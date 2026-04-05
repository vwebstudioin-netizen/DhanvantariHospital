import type { FAQItem } from "@/types";

export const faqs: FAQItem[] = [
  // General
  {
    question: "Is Dhanvantari Hospital open 24 hours?",
    answer: "Yes, our Emergency & Critical Care Unit is open 24 hours a day, 7 days a week, 365 days a year. OPD timings may vary — please call us to confirm.",
    category: "General",
  },
  {
    question: "Do you treat road accident victims?",
    answer: "Yes, Emergency Treatment for Accident Cases is one of our core specialties. Our emergency team is available round-the-clock to provide immediate trauma care for all accident victims.",
    category: "General",
  },
  {
    question: "What should I bring to my appointment?",
    answer: "Please bring your photo ID, any previous medical reports, test results, and a list of current medications. For emergencies, come immediately — we will handle documentation later.",
    category: "General",
  },
  {
    question: "Do I need an appointment or can I walk in?",
    answer: "Walk-ins are always welcome. You will receive a token number and be attended to in order. Booking an appointment in advance ensures a specific time slot and reduces waiting time.",
    category: "General",
  },
  {
    question: "What specialties are available at Dhanvantari Hospital?",
    answer: "We offer General Medicine, General Surgery, Gynecology, Pediatrics, Orthopedics, Neurology, Cardiology, and Critical Care with a dedicated Emergency Critical Care Unit.",
    category: "General",
  },

  // Appointments
  {
    question: "How do I book an appointment?",
    answer: "You can book online through our website, call us directly, or walk into the hospital. For emergencies, please come directly to our Emergency department — no appointment needed.",
    category: "Appointments",
  },
  {
    question: "How does the token system work?",
    answer: "When you arrive, our receptionist issues you a token number. You can check your queue position on your phone or watch the display screen in the waiting area. You will be called when it is your turn.",
    category: "Appointments",
  },
  {
    question: "Can I check my queue position from my phone?",
    answer: "Yes! Visit our website and go to 'Queue Status'. Enter your token number or phone number to see your current position and estimated wait time.",
    category: "Appointments",
  },
  {
    question: "Can I cancel or reschedule an appointment?",
    answer: "Yes, you can cancel or reschedule through your patient portal online or by calling us. We request at least 2 hours' notice for cancellations.",
    category: "Appointments",
  },

  // Emergency
  {
    question: "What is the Emergency Critical Care Unit (ECCU)?",
    answer: "Our Emergency Critical Care Unit is a specialized unit equipped with ventilators, cardiac monitors, and advanced life support equipment. It provides intensive care for critically ill patients from accident trauma, cardiac emergencies, strokes, and other life-threatening conditions.",
    category: "Emergency",
  },
  {
    question: "What should I do in case of a medical emergency?",
    answer: "Come directly to our Emergency department or call us immediately. Do not wait for an online appointment in case of emergency. Our team is available 24/7 to provide immediate care.",
    category: "Emergency",
  },
  {
    question: "Do you handle cardiac emergencies (heart attack)?",
    answer: "Yes, we provide immediate cardiac emergency care including ECG, thrombolysis (clot-busting therapy), and ICU monitoring for heart attack patients. Time is critical — come immediately if you suspect a heart attack.",
    category: "Emergency",
  },

  // Services
  {
    question: "Do you perform surgeries?",
    answer: "Yes, our surgical department performs both elective and emergency surgeries including laparoscopic procedures, trauma surgery, appendix removal, gallbladder surgery, hernia repair, and more.",
    category: "Services",
  },
  {
    question: "Do you have a maternity ward and delivery services?",
    answer: "Yes, our Gynecology department provides complete maternity care including antenatal check-ups, normal delivery, caesarean section, and postnatal care in a dedicated maternity ward.",
    category: "Services",
  },
  {
    question: "Is pediatric care available for newborns?",
    answer: "Yes, we have a neonatal care unit for newborns requiring special attention. Our pediatricians provide complete care for children from birth through adolescence.",
    category: "Services",
  },

  // Billing
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash and UPI payments. Insurance cashless treatment is subject to TPA empanelment — please check with our billing department before admission.",
    category: "Billing",
  },
  {
    question: "Are government health scheme benefits available?",
    answer: "Please enquire at our billing desk regarding Ayushman Bharat (PMJAY) and state government health scheme coverage. We are working on expanding insurance tie-ups.",
    category: "Billing",
  },

  // Patient Portal
  {
    question: "How do I access my patient records online?",
    answer: "Register on our patient portal to access your appointment history, test reports, and medical records. You can also use the portal to book appointments and send messages to your doctor.",
    category: "Patient Portal",
  },
];

export function getFaqsByCategory(category: string): FAQItem[] {
  return faqs.filter((f) => f.category === category);
}

export const faqCategories = [...new Set(faqs.map((f) => f.category))];
