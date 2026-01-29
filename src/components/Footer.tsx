"use client";

import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-blue-600 mb-2">About Us</h3>
          <p className="text-gray-600 text-sm">
            HealthCare+ is dedicated to providing the best medical care.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-blue-600 mb-2">Quick Links</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            {["Home", "Services", "Doctors", "Contact"].map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-blue-600 mb-2">Services</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            {["General Checkup", "Cardiology", "Telemedicine", "Emergency Care"].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-blue-600 mb-2">Contact</h3>
          <p className="text-gray-600 text-sm">Phone: +1 234 567 890</p>
          <p className="text-gray-600 text-sm">Email: info@healthcareplus.com</p>
          <div className="flex gap-2 mt-2">
            <Facebook size={20} />
            <Twitter size={20} />
            <Instagram size={20} />
          </div>
        </div>
      </div>
    </footer>
  );
}
