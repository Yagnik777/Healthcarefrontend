// "use client";

// import { useEffect, useState } from "react";

// // Types
// interface Doctor {
//   _id: string;
//   name: string;
//   specialization: string;
//   experience: number;
//   clinicAddress: string;
// }

// interface Appointment {
//   _id: string;
//   doctor: { name: string } | null;
//   date: string;
//   slot: string;
//   status: "pending" | "accepted" | "rejected";
// }

// export default function PatientDashboard() {
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const [date, setDate] = useState("");
//   const [slots, setSlots] = useState<string[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [form, setForm] = useState({ patientName: "", patientEmail: "" });
  
//   const [loading, setLoading] = useState(true);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [error, setError] = useState("");

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // 1. Initial Load: Fetch Doctors and Appointment History
//   useEffect(() => {
//     if (!token) {
//       setError("Please login to access the dashboard.");
//       setLoading(false);
//       return;
//     }

//     const initDashboard = async () => {
//       try {
//         const docRes = await fetch("http://localhost:5000/api/doctor/available", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const docs = await docRes.json();
//         setDoctors(Array.isArray(docs) ? docs : []);
        
//         await fetchMyAppointments();
//       } catch (err) {
//         setError("Failed to connect to server.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initDashboard();
//   }, [token]);

//   // Fetch Patient's History
//   const fetchMyAppointments = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/appointment/patient-list", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setMyAppointments(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error("History fetch error:", e);
//     }
//   };

//   // 2. Fetch Slots when Doctor or Date changes
//   useEffect(() => {
//     const fetchSlots = async () => {
//       if (!selectedDoctor?._id || !date) {
//         setSlots([]);
//         return;
//       }

//       setLoadingSlots(true);
//       try {
//         // 🔥 FIX: Backticks (``) નો ઉપયોગ કર્યો છે અને Method GET છે
//         const res = await fetch(
//           `http://localhost:5000/api/doctor/slots/${selectedDoctor._id}?date=${date}`,
//           {
//             method: "GET",
//             headers: { 
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json"
//             }
//           }
//         );

//         const data = await res.json();

//         if (res.ok && Array.isArray(data)) {
//           setSlots(data);
//         } else {
//           setSlots([]);
//         }
//       } catch (e) {
//         console.error("Fetch slots error:", e);
//         setSlots([]);
//       } finally {
//         setLoadingSlots(false);
//       }
//     };

//     fetchSlots();
//   }, [selectedDoctor, date, token]);

//   // 3. Book Appointment Function
//   const bookAppointment = async () => {
//     if (!selectedDoctor || !date || !selectedSlot || !form.patientName) {
//       return alert("Please fill all details and select a slot.");
//     }
    
//     try {
//       const res = await fetch("http://localhost:5000/api/appointment/book", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json", 
//           Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           doctorId: selectedDoctor._id,
//           date,
//           slot: selectedSlot,
//           patientName: form.patientName,
//           patientEmail: form.patientEmail,
//         }),
//       });

//       if (res.ok) {
//         alert("🎉 Appointment booked successfully!");
//         setSelectedSlot("");
//         setDate("");
//         setSelectedDoctor(null);
//         setForm({ patientName: "", patientEmail: "" });
//         fetchMyAppointments();
//       } else {
//         const errData = await res.json();
//         alert(errData.message || "Booking failed");
//       }
//     } catch (err) {
//       alert("System error during booking.");
//     }
//   };

//   if (loading) return <div className="p-10 text-center font-bold text-blue-600 animate-pulse">Loading Dashboard...</div>;
//   if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
//       <header className="mb-10 text-center">
//         <h1 className="text-4xl font-black text-blue-900">Patient Dashboard</h1>
//         <p className="text-gray-500 mt-2">Book your appointments and view history in one place</p>
//       </header>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         <div className="lg:col-span-2 space-y-6">
//           {/* STEP 1: SELECT DOCTOR */}
//           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
//               <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
//               Choose Your Specialist
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {doctors.length > 0 ? doctors.map(doc => (
//                 <div 
//                   key={doc._id}
//                   onClick={() => {
//                     setSelectedDoctor(doc);
//                     setDate("");
//                     setSlots([]);
//                     setSelectedSlot("");
//                   }}
//                   className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${
//                     selectedDoctor?._id === doc._id 
//                     ? 'border-blue-600 bg-blue-50' 
//                     : 'border-gray-100 hover:border-blue-200 bg-white'
//                   }`}
//                 >
//                   <p className="font-bold text-blue-900">Dr. {doc.name}</p>
//                   <p className="text-sm text-blue-600 font-medium">{doc.specialization}</p>
//                   <p className="text-xs text-gray-400 mt-2 italic">📍 {doc.clinicAddress}</p>
//                 </div>
//               )) : <p className="text-gray-400 italic">No doctors available.</p>}
//             </div>
//           </div>

//           {/* STEP 2: SELECT DATE & TIME */}
//           {selectedDoctor && (
//             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
//                 <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
//                 Select Date & Time
//               </h2>
              
//               <input
//                 type="date"
//                 min={new Date().toISOString().split("T")[0]}
//                 className="w-full md:w-1/2 border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all mb-8"
//                 onChange={(e) => setDate(e.target.value)}
//                 value={date}
//               />

//               <div className="mt-4">
//                 {loadingSlots ? (
//                   <p className="text-blue-500 font-bold animate-pulse">Checking availability...</p>
//                 ) : date ? (
//                   slots.length > 0 ? (
//                     <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
//                       {slots.map(s => (
//                         <button
//                           key={s}
//                           onClick={() => setSelectedSlot(s)}
//                           className={`p-3 text-xs font-bold rounded-xl border-2 transition-all ${
//                             selectedSlot === s 
//                             ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' 
//                             : 'bg-white border-gray-100 text-gray-600 hover:border-blue-300'
//                           }`}
//                         >
//                           {s}
//                         </button>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="p-4 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
//                       <p className="font-bold">No slots found for Dr. {selectedDoctor.name} on this date.</p>
//                       <p className="text-xs opacity-80">Please try another date.</p>
//                     </div>
//                   )
//                 ) : (
//                   <p className="text-gray-400 italic">Select a date to view available time slots.</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* STEP 3: CONFIRM */}
//           {selectedSlot && (
//             <div className="bg-blue-900 p-8 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300">
//               <h2 className="text-xl font-bold mb-6 text-white">3. Patient Details</h2>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Patient Full Name"
//                   className="w-full p-4 rounded-2xl bg-blue-800 text-white placeholder-blue-300 border-none outline-none focus:ring-2 focus:ring-blue-400"
//                   onChange={(e) => setForm({ ...form, patientName: e.target.value })}
//                   value={form.patientName}
//                 />
//                 <button
//                   onClick={bookAppointment}
//                   className="w-full bg-white text-blue-900 font-black py-5 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
//                 >
//                   Book Appointment for {selectedSlot}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT PANEL: History */}
//         <div className="space-y-6">
//           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-6">
//             <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
//               <span>📋</span> Appointment History
//             </h2>
//             <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
//               {myAppointments.length > 0 ? (
//                 myAppointments.map((appt) => (
//                   <div key={appt._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
//                     {/* અહીં ડોક્ટરનું નામ બતાવવા માટેનો સુધારો */}
//                     <p className="font-bold text-gray-800">
//                       {appt.doctor && typeof appt.doctor === "object" 
//                         ? `Dr. ${appt.doctor.name}` 
//                         : "Dr. Specialist"}
//                     </p>
                      
//                     <div className="flex justify-between items-center mt-3">
//                       <div className="text-[10px] font-bold text-gray-400">
//                         {appt.date} <br /> {appt.slot}
//                       </div>
//                       <span
//                         className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
//                           appt.status === "accepted"
//                             ? "bg-green-100 text-green-700"
//                             : appt.status === "rejected"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-orange-100 text-orange-700"
//                         }`}
//                       >
//                         {appt.status}
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-10">
//                   <p className="text-gray-400 text-sm">No history yet.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";

// 🌐 Production-ready API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Types
interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  clinicAddress: string;
}

interface Appointment {
  _id: string;
  doctor: { name: string } | null;
  date: string;
  slot: string;
  status: "pending" | "accepted" | "rejected";
}

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ patientName: "", patientEmail: "" });
  
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  // 🛡️ Safe token handling for Next.js SSR
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  // 1. Initial Load: Fetch Doctors and Appointment History
  useEffect(() => {
    if (token === null && loading === true) {
      // Wait for token to load from localStorage
      const checkToken = localStorage.getItem("token");
      if (!checkToken) {
        setError("Please login to access the dashboard.");
        setLoading(false);
        return;
      }
    }

    if (!token) return;

    const initDashboard = async () => {
      try {
        const docRes = await fetch(`${API_BASE_URL}/api/doctor/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const docs = await docRes.json();
        setDoctors(Array.isArray(docs) ? docs : []);
        
        await fetchMyAppointments();
      } catch (err) {
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [token]);

  // Fetch Patient's History
  const fetchMyAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointment/patient-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("History fetch error:", e);
    }
  };

  // 2. Fetch Slots when Doctor or Date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor?._id || !date || !token) {
        setSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/doctor/slots/${selectedDoctor._id}?date=${date}`,
          {
            method: "GET",
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setSlots(data);
        } else {
          setSlots([]);
        }
      } catch (e) {
        console.error("Fetch slots error:", e);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, date, token]);

  // 3. Book Appointment Function
  const bookAppointment = async () => {
    if (!selectedDoctor || !date || !selectedSlot || !form.patientName) {
      return alert("Please fill all details and select a slot.");
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointment/book`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date,
          slot: selectedSlot,
          patientName: form.patientName,
          patientEmail: form.patientEmail,
        }),
      });

      if (res.ok) {
        alert("🎉 Appointment booked successfully!");
        setSelectedSlot("");
        setDate("");
        setSelectedDoctor(null);
        setForm({ patientName: "", patientEmail: "" });
        fetchMyAppointments();
      } else {
        const errData = await res.json();
        alert(errData.message || "Booking failed");
      }
    } catch (err) {
      alert("System error during booking.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-blue-600 animate-pulse">Loading Dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-blue-900">Patient Dashboard</h1>
        <p className="text-gray-500 mt-2">Book your appointments and view history in one place</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: SELECT DOCTOR */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Choose Your Specialist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.length > 0 ? doctors.map(doc => (
                <div 
                  key={doc._id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setDate("");
                    setSlots([]);
                    setSelectedSlot("");
                  }}
                  className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                    selectedDoctor?._id === doc._id 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-100 hover:border-blue-200 bg-white'
                  }`}
                >
                  <p className="font-bold text-blue-900">Dr. {doc.name}</p>
                  <p className="text-sm text-blue-600 font-medium">{doc.specialization}</p>
                  <p className="text-xs text-gray-400 mt-2 italic">📍 {doc.clinicAddress}</p>
                </div>
              )) : <p className="text-gray-400 italic">No doctors available.</p>}
            </div>
          </div>

          {/* STEP 2: SELECT DATE & TIME */}
          {selectedDoctor && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Select Date & Time
              </h2>
              
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full md:w-1/2 border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all mb-8"
                onChange={(e) => setDate(e.target.value)}
                value={date}
              />

              <div className="mt-4">
                {loadingSlots ? (
                  <p className="text-blue-500 font-bold animate-pulse">Checking availability...</p>
                ) : date ? (
                  slots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {slots.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSlot(s)}
                          className={`p-3 text-xs font-bold rounded-xl border-2 transition-all ${
                            selectedSlot === s 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' 
                            : 'bg-white border-gray-100 text-gray-600 hover:border-blue-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                      <p className="font-bold">No slots found for Dr. {selectedDoctor.name} on this date.</p>
                      <p className="text-xs opacity-80">Please try another date.</p>
                    </div>
                  )
                ) : (
                  <p className="text-gray-400 italic">Select a date to view available time slots.</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {selectedSlot && (
            <div className="bg-blue-900 p-8 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300">
              <h2 className="text-xl font-bold mb-6 text-white">3. Patient Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Full Name"
                  className="w-full p-4 rounded-2xl bg-blue-800 text-white placeholder-blue-300 border-none outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  value={form.patientName}
                />
                <button
                  onClick={bookAppointment}
                  className="w-full bg-white text-blue-900 font-black py-5 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
                >
                  Book Appointment for {selectedSlot}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: History */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span>📋</span> Appointment History
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {myAppointments.length > 0 ? (
                myAppointments.map((appt) => (
                  <div key={appt._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="font-bold text-gray-800">
                      {appt.doctor && typeof appt.doctor === "object" 
                        ? `Dr. ${appt.doctor.name}` 
                        : "Dr. Specialist"}
                    </p>
                      
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-[10px] font-bold text-gray-400">
                        {appt.date} <br /> {appt.slot}
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                          appt.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm">No history yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}