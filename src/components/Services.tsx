"use client";

import { Stethoscope, Heart, Phone, Activity } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { icon: <Stethoscope size={32} />, title: "General Checkup" },
  { icon: <Heart size={32} />, title: "Cardiology" },
  { icon: <Phone size={32} />, title: "Telemedicine" },
  { icon: <Activity size={32} />, title: "Emergency Care" },
];

export default function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.title}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 p-6 rounded shadow text-center"
            >
              <div className="mb-4 text-blue-600">{service.icon}</div>
              <h3 className="font-semibold text-lg">{service.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
