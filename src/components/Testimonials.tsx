"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Alice Smith", feedback: "Excellent care and friendly staff!" },
  { name: "John Doe", feedback: "Highly professional doctors and quick service." },
  { name: "Maria Garcia", feedback: "The telemedicine option is very convenient!" },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">What Our Patients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ scale: 1.05 }}
              className="border p-6 rounded shadow bg-gray-50"
            >
              <p className="italic text-gray-700 mb-4">"{t.feedback}"</p>
              <p className="font-semibold text-blue-600">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
