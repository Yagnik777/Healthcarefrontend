"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookAppointmentPage() {
  const { doctorId } = useParams();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const [patient, setPatient] = useState({
    name: "",
    email: "",
  });

  // Fetch free slots
  useEffect(() => {
    if (!date) return;

    setLoading(true);
    fetch(
      `http://localhost:5000/api/doctor/${doctorId}/slots?date=${date}`
    )
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .finally(() => setLoading(false));
  }, [date, doctorId]);

  // Book appointment
  const handleBook = async () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/appointments/book",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          date,
          slot: selectedSlot,
          patientName: patient.name,
          patientEmail: patient.email,
        }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      alert("Appointment booked successfully ✅");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

      {/* Date */}
      <label className="block mb-2 font-medium">Select Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Slots */}
      {loading ? (
        <p>Loading slots...</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {slots.length === 0 && date && (
            <p className="text-gray-500 col-span-2">
              No slots available
            </p>
          )}

          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`p-2 border rounded ${
                selectedSlot === slot
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      {/* Patient Info */}
      <input
        placeholder="Patient Name"
        value={patient.name}
        onChange={(e) =>
          setPatient({ ...patient, name: e.target.value })
        }
        className="w-full border p-2 rounded mb-2"
      />

      <input
        placeholder="Patient Email"
        value={patient.email}
        onChange={(e) =>
          setPatient({ ...patient, email: e.target.value })
        }
        className="w-full border p-2 rounded mb-4"
      />

      {/* Book */}
      <button
        onClick={handleBook}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Confirm Appointment
      </button>
    </div>
  );
}
