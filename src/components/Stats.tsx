"use client";

export default function StatsBar() {
  const stats = [
    { label: "Patients", value: "10k+" },
    { label: "Doctors", value: "50+" },
    { label: "Support", value: "24/7" },
  ];

  return (
    <section className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto flex justify-around text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <h2 className="text-3xl font-bold text-blue-600">{stat.value}</h2>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
