import type { ServiceData } from "@/types";

export const services: ServiceData[] = [
  // General Medicine
  {
    slug: "general-consultation",
    title: "General Consultation",
    shortDescription: "Expert diagnosis and treatment for all adult medical conditions by experienced physicians.",
    description: "Our general medicine department provides comprehensive outpatient and inpatient care for all adult illnesses. From routine health checks to complex chronic disease management, our physicians are equipped to handle a wide range of conditions with the latest diagnostic and treatment protocols.",
    icon: "Stethoscope",
    image: "/images/services/general-consultation.jpg",
    departmentSlug: "general-medicine",
    duration: 20,
    features: ["Full physical examination", "Blood & urine tests", "Diabetes management", "Hypertension control", "Chronic disease care", "Prescription & follow-up"],
    faq: [
      { question: "Do I need an appointment for general consultation?", answer: "Walk-ins are welcome. You will receive a token number and be attended in order. Appointments ensure a fixed time slot." },
      { question: "What should I bring?", answer: "Carry your previous prescriptions, test reports, and any regular medications you are taking." },
    ],
  },
  {
    slug: "diabetes-hypertension",
    title: "Diabetes & Hypertension Care",
    shortDescription: "Specialized management of diabetes and blood pressure with regular monitoring and counselling.",
    description: "We offer structured diabetes and hypertension care programs including regular HbA1c monitoring, blood sugar control, medication management, diet counselling, and complication screening to help patients live a healthy life.",
    icon: "Activity",
    image: "/images/services/diabetes-care.jpg",
    departmentSlug: "general-medicine",
    duration: 30,
    features: ["Blood sugar monitoring", "HbA1c testing", "BP monitoring", "Medication management", "Diet & lifestyle advice", "Complication screening"],
    faq: [
      { question: "How often should a diabetic visit the doctor?", answer: "Most stable diabetic patients should visit every 3 months. Newly diagnosed or uncontrolled patients may need more frequent visits." },
    ],
  },

  // General Surgery
  {
    slug: "laparoscopic-surgery",
    title: "Laparoscopic Surgery",
    shortDescription: "Minimally invasive keyhole surgery for appendix, gallbladder, hernia, and more.",
    description: "Our surgeons perform advanced laparoscopic (keyhole) surgeries that result in less pain, smaller scars, faster recovery, and shorter hospital stays compared to open surgery. Available for appendix removal, gallbladder surgery, hernia repair, and other abdominal conditions.",
    icon: "Scissors",
    image: "/images/services/laparoscopic.jpg",
    departmentSlug: "general-surgery",
    duration: 90,
    features: ["Appendix removal", "Cholecystectomy (gallbladder)", "Hernia repair", "Small incisions", "Faster recovery", "Less post-op pain"],
    faq: [
      { question: "How long is the hospital stay after laparoscopic surgery?", answer: "Most patients are discharged within 1-3 days, compared to 5-7 days for open surgery." },
      { question: "When can I return to normal activities?", answer: "Most patients return to light activity within 1 week and full activity within 2-3 weeks." },
    ],
  },
  {
    slug: "trauma-wound-care",
    title: "Trauma & Wound Care",
    shortDescription: "Emergency and elective wound management, trauma surgery, and injury care.",
    description: "Our surgical team is trained and available 24/7 to handle traumatic injuries from accidents, wounds, fractures requiring surgical intervention, and soft tissue injuries. We provide rapid assessment, stabilization, and definitive surgical treatment.",
    icon: "Scissors",
    image: "/images/services/wound-care.jpg",
    departmentSlug: "general-surgery",
    duration: 60,
    features: ["24/7 emergency availability", "Wound debridement", "Suturing & closure", "Abscess drainage", "Skin grafting", "Post-trauma care"],
    faq: [
      { question: "Is emergency surgery available at night?", answer: "Yes, our surgical team is available 24 hours a day, 7 days a week for all emergency cases." },
    ],
  },

  // Gynecology
  {
    slug: "antenatal-care",
    title: "Antenatal & Maternity Care",
    shortDescription: "Complete pregnancy care from first trimester to delivery — normal and caesarean.",
    description: "We provide comprehensive antenatal care including regular check-ups, ultrasound scans, blood tests, and counselling throughout pregnancy. Our gynecologists are experienced in both normal deliveries and caesarean sections with full fetal monitoring.",
    icon: "Heart",
    image: "/images/services/antenatal.jpg",
    departmentSlug: "gynecology",
    duration: 30,
    features: ["Antenatal check-ups", "Obstetric ultrasound", "Blood & urine testing", "Normal delivery", "Caesarean section (LSCS)", "Postnatal care"],
    faq: [
      { question: "When should I start antenatal visits?", answer: "Ideally your first visit should be within 8-10 weeks of pregnancy. Regular monthly visits thereafter, increasing to weekly after 36 weeks." },
      { question: "Do you have a maternity ward?", answer: "Yes, we have a dedicated maternity ward with round-the-clock nursing and doctor support." },
    ],
  },
  {
    slug: "gynecology-consultation",
    title: "Gynecology Consultation",
    shortDescription: "Expert care for PCOD, menstrual disorders, uterine fibroids, and all women's health issues.",
    description: "Our gynecologists provide diagnosis and management of all women's health conditions including PCOD/PCOS, menstrual irregularities, uterine fibroids, ovarian cysts, and menopausal symptoms with a compassionate and confidential approach.",
    icon: "Heart",
    image: "/images/services/gynecology.jpg",
    departmentSlug: "gynecology",
    duration: 30,
    features: ["PCOD/PCOS management", "Menstrual disorder treatment", "Fibroid management", "Cervical screening (Pap smear)", "Fertility counselling", "Menopausal care"],
    faq: [
      { question: "Is the consultation confidential?", answer: "Absolutely. All consultations are completely confidential and conducted in a private setting." },
    ],
  },

  // Pediatrics
  {
    slug: "child-health-vaccination",
    title: "Child Health & Vaccination",
    shortDescription: "Complete pediatric care, immunization, and growth monitoring for infants and children.",
    description: "Our pediatric department provides comprehensive child health services including newborn care, vaccination as per national immunization schedule, growth and development monitoring, nutritional guidance, and treatment of all childhood illnesses.",
    icon: "Baby",
    image: "/images/services/pediatrics.jpg",
    departmentSlug: "pediatrics",
    duration: 20,
    features: ["Newborn care & screening", "Vaccination (NIS schedule)", "Growth & development tracking", "Childhood illness treatment", "Nutritional counselling", "School health assessment"],
    faq: [
      { question: "What vaccines does your hospital provide?", answer: "We follow the National Immunization Schedule including BCG, OPV, DPT, Hepatitis B, MMR, and all recommended vaccines." },
      { question: "Do you have a neonatal care unit?", answer: "Yes, we have a neonatal unit for care of newborns requiring special attention after birth." },
    ],
  },

  // Orthopedics
  {
    slug: "fracture-treatment",
    title: "Fracture & Accident Injury Treatment",
    shortDescription: "Expert management of fractures, dislocations, and musculoskeletal injuries from accidents.",
    description: "Our orthopedic team provides immediate and definitive management of all types of fractures and trauma injuries. We offer both conservative treatment (casting) and surgical fixation (plates, nails, screws) based on injury severity. Emergency orthopedic care is available 24/7.",
    icon: "Bone",
    image: "/images/services/fracture.jpg",
    departmentSlug: "orthopedics",
    duration: 60,
    features: ["Emergency fracture care", "Plaster/splint application", "Surgical fixation (ORIF)", "Dislocation reduction", "Physiotherapy coordination", "Follow-up X-rays"],
    faq: [
      { question: "How quickly can fracture surgery be done?", answer: "Emergency fracture surgery is performed as soon as the patient is stabilized, often within 6-24 hours of admission." },
      { question: "Is physiotherapy available?", answer: "Yes, we coordinate rehabilitation and physiotherapy as part of the fracture recovery plan." },
    ],
  },
  {
    slug: "joint-pain-arthritis",
    title: "Joint Pain & Arthritis",
    shortDescription: "Diagnosis and treatment of joint pain, arthritis, and musculoskeletal conditions.",
    description: "We treat all forms of joint pain including osteoarthritis, rheumatoid arthritis, gout, and sports-related joint injuries. Treatment options range from medications and injections to joint replacement surgery when needed.",
    icon: "Bone",
    image: "/images/services/joint-pain.jpg",
    departmentSlug: "orthopedics",
    duration: 30,
    features: ["Joint examination & X-ray", "Arthritis management", "Joint injections", "Pain management", "Knee & hip care", "Joint replacement (if needed)"],
    faq: [
      { question: "When is joint replacement surgery recommended?", answer: "Joint replacement is recommended when conservative treatment fails to control pain and the patient's quality of life is significantly affected." },
    ],
  },

  // Neurology
  {
    slug: "stroke-care",
    title: "Stroke & Neurological Emergency",
    shortDescription: "Rapid diagnosis and treatment of stroke and acute neurological emergencies.",
    description: "Time is critical in stroke care. Our neurology team provides rapid assessment, CT scan coordination, thrombolysis when indicated, and intensive monitoring for stroke patients. Early intervention saves brain and reduces disability.",
    icon: "Brain",
    image: "/images/services/stroke.jpg",
    departmentSlug: "neurology",
    duration: 60,
    features: ["Rapid stroke assessment", "CT/MRI coordination", "Thrombolysis therapy", "ICU monitoring", "Rehabilitation planning", "Secondary prevention"],
    faq: [
      { question: "What are the signs of a stroke?", answer: "FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency. Get to hospital immediately if any of these signs appear." },
    ],
  },
  {
    slug: "epilepsy-headache",
    title: "Epilepsy & Headache Management",
    shortDescription: "Specialist care for epilepsy, seizures, migraine, and chronic headache disorders.",
    description: "We provide expert diagnosis and long-term management of epilepsy, seizure disorders, migraine, and chronic headaches with EEG, medication management, and lifestyle modification counselling.",
    icon: "Brain",
    image: "/images/services/epilepsy.jpg",
    departmentSlug: "neurology",
    duration: 30,
    features: ["EEG testing", "Seizure management", "Anti-epileptic therapy", "Migraine treatment", "Headache classification", "Long-term monitoring"],
    faq: [
      { question: "Can epilepsy be controlled?", answer: "Yes, about 70% of people with epilepsy become seizure-free with appropriate medication. Regular follow-up is essential." },
    ],
  },

  // Cardiology
  {
    slug: "heart-consultation",
    title: "Cardiac Consultation & ECG",
    shortDescription: "Expert heart evaluation, ECG, echocardiography, and cardiac risk assessment.",
    description: "Our cardiologists provide comprehensive cardiac evaluation including ECG, echocardiography, and risk assessment for heart disease. Early detection and management of heart conditions helps prevent serious cardiac events.",
    icon: "Heart",
    image: "/images/services/cardiology.jpg",
    departmentSlug: "cardiology",
    duration: 30,
    features: ["12-lead ECG", "Echocardiography", "Cardiac risk assessment", "Hypertension management", "Cholesterol management", "Heart disease prevention"],
    faq: [
      { question: "When should I see a cardiologist?", answer: "See a cardiologist if you have chest pain, palpitations, breathlessness on exertion, high blood pressure, or a family history of heart disease." },
    ],
  },
  {
    slug: "cardiac-emergency",
    title: "Cardiac Emergency Care",
    shortDescription: "24/7 emergency treatment for heart attacks, chest pain, and acute cardiac events.",
    description: "Our emergency team provides immediate cardiac care for heart attacks (MI), acute chest pain, severe hypertension, and cardiac arrhythmias. Rapid treatment of heart attacks is critical to save heart muscle and life.",
    icon: "Heart",
    image: "/images/services/cardiac-emergency.jpg",
    departmentSlug: "cardiology",
    duration: 60,
    features: ["24/7 cardiac emergency", "Immediate ECG", "Thrombolysis (clot busting)", "Cardiac monitoring", "ICU care", "Resuscitation (CPR)"],
    faq: [
      { question: "What should I do if I suspect a heart attack?", answer: "Call emergency immediately and get to the nearest hospital. Do NOT wait and watch. Every minute counts — heart muscle dies without blood supply." },
    ],
  },

  // Critical Care & Emergency
  {
    slug: "accident-emergency",
    title: "Accident & Emergency Treatment",
    shortDescription: "24/7 emergency treatment for accident victims, trauma, and critical injuries.",
    description: "Dhanvantari Hospital specializes in emergency treatment for accident cases. Our emergency department is staffed round-the-clock with experienced doctors, nurses, and support staff. We provide rapid triage, stabilization, and definitive treatment for all trauma cases.",
    icon: "AlertCircle",
    image: "/images/services/emergency.jpg",
    departmentSlug: "critical-care",
    duration: 60,
    features: ["24/7 emergency team", "Rapid triage & assessment", "Trauma resuscitation", "Airway management", "Blood transfusion", "Emergency surgery coordination"],
    faq: [
      { question: "Is your emergency department open 24 hours?", answer: "Yes, our Emergency & Critical Care Unit operates 24 hours a day, 7 days a week, 365 days a year." },
      { question: "Do you treat road accident cases?", answer: "Yes, emergency treatment for road accident cases is one of our core specialties. We provide immediate trauma care for all accident victims." },
    ],
  },
  {
    slug: "icu-critical-care",
    title: "ICU & Critical Care",
    shortDescription: "Advanced Intensive Care Unit for critically ill patients requiring round-the-clock monitoring.",
    description: "Our Emergency Critical Care Unit (ECCU) is equipped with ventilators, cardiac monitors, infusion pumps, and advanced life support equipment. Staffed by trained intensivists and ICU nurses who provide round-the-clock monitoring and care for the most critically ill patients.",
    icon: "AlertCircle",
    image: "/images/services/icu.jpg",
    departmentSlug: "critical-care",
    duration: 60,
    features: ["Mechanical ventilation", "Continuous cardiac monitoring", "Vasopressor support", "Renal replacement therapy", "Multi-organ management", "24/7 intensivist coverage"],
    faq: [
      { question: "Who needs ICU admission?", answer: "Patients requiring continuous monitoring, ventilator support, or intensive treatment for conditions like sepsis, respiratory failure, post-surgery complications, or multi-organ failure." },
      { question: "Can family members visit ICU patients?", answer: "Visiting hours are restricted to protect critically ill patients. Our staff will keep the family updated on the patient's condition regularly." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByDepartment(departmentSlug: string): ServiceData[] {
  return services.filter((s) => s.departmentSlug === departmentSlug);
}
