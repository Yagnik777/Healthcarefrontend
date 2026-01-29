"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-24 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-gray-600 mb-6">
            Comprehensive care from trusted professionals. Your well-being matters most.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Get Started
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <img
            src="/medical-hero-placeholder.png"
            alt="Medical Professional"
            className="w-full rounded shadow"
          />
        </motion.div>
      </div>
    </section>
  );
}
