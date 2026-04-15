import type { DepartmentData } from "@/types";

export const departments: DepartmentData[] = [
  {
    slug: "general-medicine",
    name: "General Medicine",
    description: "Comprehensive diagnosis and treatment of a wide range of adult illnesses. Our general physicians provide expert care for fevers, infections, diabetes, hypertension, respiratory conditions, and all routine medical needs.",
    icon: "Stethoscope",
    image: "/images/departments/general-medicine.jpg",
    conditionsTreated: ["Fever & infections", "Diabetes", "Hypertension", "Respiratory illness", "Thyroid disorders", "Anemia", "Gastric problems", "Urinary infections"],
  },
  {
    slug: "general-surgery",
    name: "General Surgery",
    description: "Expert surgical care for a broad range of conditions. Our surgeons perform both elective and emergency procedures using modern surgical techniques to ensure patient safety and rapid recovery.",
    icon: "Scissors",
    image: "/images/departments/general-surgery.jpg",
    conditionsTreated: ["Appendicitis", "Hernias", "Gallstones", "Wound repair", "Abscess drainage", "Laparoscopic procedures", "Thyroid surgery", "Trauma surgery"],
  },
  {
    slug: "gynecology",
    name: "Gynecology",
    description: "Comprehensive women's health services including antenatal care, normal and caesarean deliveries, and treatment of all gynecological conditions. We ensure safe and comfortable care for every woman.",
    icon: "Heart",
    image: "/images/departments/gynecology.jpg",
    conditionsTreated: ["Antenatal care", "Normal delivery", "Caesarean section", "PCOD/PCOS", "Menstrual disorders", "Uterine fibroids", "Infertility", "Menopausal care"],
  },
  {
    slug: "pulmonology",
    name: "Pulmonology",
    description: "Expert diagnosis and treatment of respiratory and lung diseases. Our pulmonologists manage conditions affecting the lungs, airways, and chest, including asthma, COPD, pneumonia, and sleep-related breathing disorders.",
    icon: "Wind",
    image: "/images/departments/pulmonology.jpg",
    conditionsTreated: ["Asthma", "COPD & emphysema", "Pneumonia", "Tuberculosis (TB)", "Pleural effusion", "Lung fibrosis", "Sleep apnea", "Chest infections"],
  },
  {
    slug: "urology",
    name: "Urology",
    description: "Comprehensive urological care for diseases of the urinary tract and male reproductive system. Our urologists offer both medical and surgical treatment for kidney stones, urinary infections, prostate conditions, and more.",
    icon: "Droplets",
    image: "/images/departments/urology.jpg",
    conditionsTreated: ["Kidney stones", "Urinary tract infections", "Prostate disorders (BPH)", "Bladder conditions", "Urinary incontinence", "Kidney cysts", "Testicular disorders", "Urological cancers"],
  },
  {
    slug: "nephrology",
    name: "Nephrology",
    description: "Specialized care for kidney diseases and disorders of the renal system. Our nephrologists diagnose and manage chronic kidney disease, acute renal failure, hypertensive kidney disease, and provide dialysis support.",
    icon: "Activity",
    image: "/images/departments/nephrology.jpg",
    conditionsTreated: ["Chronic kidney disease (CKD)", "Acute kidney injury", "Diabetic nephropathy", "Hypertensive kidney disease", "Glomerulonephritis", "Nephrotic syndrome", "Kidney stones (medical)", "Electrolyte disorders"],
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    description: "Expert care for bones, joints, muscles, and the musculoskeletal system. We treat fractures, joint pain, sports injuries, and spinal conditions with advanced surgical and non-surgical approaches.",
    icon: "Bone",
    image: "/images/departments/orthopedics.jpg",
    conditionsTreated: ["Fractures & dislocations", "Joint replacement", "Arthritis", "Sports injuries", "Back pain", "Neck pain", "Ligament injuries", "Osteoporosis"],
  },
  {
    slug: "neurology",
    name: "Neurology",
    description: "Diagnosis and treatment of disorders affecting the brain, spinal cord, and nervous system. Our neurologists provide expert care for strokes, epilepsy, headaches, and other neurological conditions.",
    icon: "Brain",
    image: "/images/departments/neurology.jpg",
    conditionsTreated: ["Stroke & paralysis", "Epilepsy & seizures", "Migraine", "Parkinson's disease", "Dementia", "Neuropathy", "Multiple sclerosis", "Dizziness & vertigo"],
  },
  {
    slug: "cardiology",
    name: "Cardiology",
    description: "Comprehensive heart care including diagnosis and treatment of heart diseases, hypertension, and cardiovascular conditions. We offer ECG, echocardiography, and advanced cardiac monitoring.",
    icon: "Heart",
    image: "/images/departments/cardiology.jpg",
    conditionsTreated: ["Heart attack (MI)", "Chest pain (Angina)", "Heart failure", "Hypertension", "Arrhythmias", "Valve disorders", "Coronary artery disease", "Pericarditis"],
  },
  {
    slug: "critical-care",
    name: "Critical Care & Emergency",
    description: "Our Emergency Critical Care Unit provides round-the-clock intensive care for critically ill patients and emergency treatment for accident cases. Equipped with advanced life support systems and experienced ICU specialists.",
    icon: "AlertCircle",
    image: "/images/departments/critical-care.jpg",
    conditionsTreated: ["Road accident injuries", "Polytrauma", "Respiratory failure", "Sepsis & septic shock", "Multi-organ dysfunction", "Post-operative care", "Cardiac arrest", "Stroke emergency"],
  },
];

export function getDepartmentBySlug(slug: string): DepartmentData | undefined {
  return departments.find((d) => d.slug === slug);
}
