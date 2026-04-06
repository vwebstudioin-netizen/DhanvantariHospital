import { Award, Users, Stethoscope, Clock } from "lucide-react";

const stats = [
  { icon: Users,       value: "10,000+", label: "Patients Served" },
  { icon: Award,       value: "8+",      label: "Specialists" },
  { icon: Stethoscope, value: "8",       label: "Departments" },
  { icon: Clock,       value: "24/7",    label: "Emergency Care" },
];

export default function StatsSection() {
  return (
    <section className="bg-[#1e3a5f] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <stat.icon className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
