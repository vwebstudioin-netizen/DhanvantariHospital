import SectionHeader from "@/components/shared/SectionHeader";
import { Award, Users, Stethoscope, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Patients Served" },
  { icon: Award, value: "8+", label: "Specialists" },
  { icon: Stethoscope, value: "8", label: "Departments" },
  { icon: Clock, value: "24/7", label: "Emergency Care" },
];

export default function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
