"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorProfile() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    experience: "",
    phone: "",
    clinicAddress: "",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

      useEffect(() => {
        if (!token) return;
      
        fetch("http://localhost:5000/api/doctor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data) {
              // ✅ Spread the existing 'form' defaults first, 
              // then overwrite with 'data' from API
              setForm(prev => ({
                ...prev,
                ...data
              }));
            }
          });
      }, [token]);
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(
      "http://localhost:5000/api/doctor/profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (res.ok) {
      alert("Profile saved successfully");
      router.push("/dashboard/doctor"); // ✅ DASHBOARD REDIRECT
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        Doctor Profile
      </h1>

      {[
        "name",
        "specialization",
        "experience",
        "phone",
        "clinicAddress",
      ].map(field => (
        <input
          key={field}
          name={field}
          value={(form as any)[field]}
          onChange={handleChange}
          placeholder={field}
          className="w-full mb-3 p-2 border rounded"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-3"
      >
        Save Profile
      </button>

      {/* 🔙 Back Button */}
      <button
        onClick={() => router.push("/dashboard/doctor")}
        className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
