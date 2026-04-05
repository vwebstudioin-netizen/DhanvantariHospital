import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DepartmentsSection from "@/components/sections/DepartmentsSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import LocationsSection from "@/components/sections/LocationsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <DepartmentsSection />
      <DoctorsSection />
      <WhyChooseUsSection />
      <LocationsSection />
      <TestimonialsSection />
      <CTASection />
      <NewsletterSection />
    </>
  );
}
