"use client";

import { useState } from "react";

export default function AppointmentForm() {
  const [form, setForm] = useState({ name: "", email: "", department: "", date: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Appointment booked for ${form.name}`);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Book an Appointment</h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          >
            <option value="">Select Department</option>
            <option value="general">General Checkup</option>
            <option value="cardiology">Cardiology</option>
            <option value="telemedicine">Telemedicine</option>
            <option value="emergency">Emergency Care</option>
          </select>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700 transition">
            Book Appointment
          </button>
        </form>
      </div>
    </section>
  );
}
