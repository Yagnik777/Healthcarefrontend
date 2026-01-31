// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface Appointment {
//   _id: string;
//   patientName: string;
//   date: string;
//   slot: string;
//   status: "pending" | "accepted" | "rejected";
// }

// interface TimeSlot {
//   from: string;
//   to: string;
//   slotDuration: number;
// }

// export default function DoctorDashboard() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<"overview" | "availability">("overview");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
  
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0 });

//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [from, setFrom] = useState("09:00");
//   const [to, setTo] = useState("12:00");
//   const [slotDuration, setSlotDuration] = useState<number>(30);
//   const [existingSlots, setExistingSlots] = useState<TimeSlot[]>([]);

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     if (!token || role !== "doctor") {
//       router.replace("/login");
//       return;
//     }

//     async function fetchData() {
//       try {
//         const profileRes = await fetch("http://localhost:5000/api/doctor/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const profileData = await profileRes.json();
        
//         if (!profileData?.profileCompleted) {
//           router.replace("/dashboard/doctor/profile");
//           return;
//         }

//         const apptRes = await fetch("http://localhost:5000/api/appointment/doctor-list", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         const apptData = await apptRes.json();
        
//         if (apptRes.ok && Array.isArray(apptData)) { 
//           setAppointments(apptData);
//           updateStats(apptData);
//         } else {
//           setAppointments([]);
//         }
//       } catch (err) {
//         console.error("Dashboard error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [router, token]);

//   useEffect(() => {
//     if (activeTab === "availability" && selectedDate) {
//       fetchCurrentDateAvailability();
//     }
//   }, [selectedDate, activeTab]);

//   const fetchCurrentDateAvailability = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/doctor/availability?date=${selectedDate}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setExistingSlots(data?.timeSlots || []);
//       }
//     } catch (e) { 
//         setExistingSlots([]);
//     }
//   };

//   const updateStats = (data: Appointment[]) => {
//     const pending = data.filter((a) => a.status === "pending").length;
//     const accepted = data.filter((a) => a.status === "accepted").length;
//     setStats({ total: data.length, pending, accepted });
//   };

//   const saveAvailability = async () => {
//     setSaving(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/doctor/availability", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json", 
//           "Authorization": `Bearer ${token}` 
//         },
//         body: JSON.stringify({ 
//           date: selectedDate,
//           from,
//           to,
//           slotDuration: Number(slotDuration) 
//         }),
//       });

//       if (res.ok) {
//         alert("✅ Slot added successfully!");
//         fetchCurrentDateAvailability();
//       } else {
//         const data = await res.json();
//         alert(`❌ Error: ${data.message || "Failed to save"}`);
//       }
//     } catch (err) {
//       alert("Connection failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --- NEW: ACCEPT/REJECT FUNCTION ---
//   const handleStatusUpdate = async (id: string, newStatus: "accepted" | "rejected") => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/appointment/status/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         const updatedList = appointments.map((appt) =>
//           appt._id === id ? { ...appt, status: newStatus } : appt
//         );
//         setAppointments(updatedList as Appointment[]);
//         updateStats(updatedList as Appointment[]);
//       } else {
//         alert("Failed to update status");
//       }
//     } catch (err) {
//       console.error("Update status error:", err);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-blue-50">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">
//       <header className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-100">
//         <div className="flex items-center gap-2">
//           <span className="text-2xl">🩺</span>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight">DocPanel<span className="text-blue-600">.</span></h1>
//         </div>
//         <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="bg-rose-50 text-rose-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100">
//           Logout
//         </button>
//       </header>

//       <main className="max-w-6xl mx-auto p-6 md:p-10">
//         <div className="inline-flex p-1 bg-gray-200/50 rounded-2xl mb-10 border border-gray-200">
//           <button onClick={() => setActiveTab("overview")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "overview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
//             Overview
//           </button>
//           <button onClick={() => setActiveTab("availability")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "availability" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
//             My Schedule
//           </button>
//         </div>

//         {activeTab === "overview" ? (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//               <DashboardCard title="Total" value={stats.total} color="blue" icon="📋" />
//               <DashboardCard title="Pending" value={stats.pending} color="amber" icon="⏳" />
//               <DashboardCard title="Accepted" value={stats.accepted} color="emerald" icon="✅" />
//             </div>

//             <div className="bg-white rounded-2rem p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
//               <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
//                 Recent Appointments
//                 <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase">Live</span>
//               </h3>
//               {appointments.length > 0 ? (
//                 <div className="space-y-4">
//                   {appointments.map((appt) => (
//                     <div key={appt._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:scale-[1.01] transition-transform gap-4">
//                       <div className="flex items-center gap-4">
//                         <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">👤</div>
//                         <div>
//                           <p className="font-bold text-slate-700">{appt.patientName}</p>
//                           <p className="text-xs text-slate-400 font-medium">{appt.date} • {appt.slot}</p>
//                         </div>
//                       </div>

//                       {/* --- ACTION BUTTONS --- */}
//                       <div className="flex items-center gap-2">
//                         {appt.status === "pending" ? (
//                           <>
//                             <button 
//                               onClick={() => handleStatusUpdate(appt._id, "accepted")}
//                               className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all shadow-md"
//                             >
//                               Accept
//                             </button>
//                             <button 
//                               onClick={() => handleStatusUpdate(appt._id, "rejected")}
//                               className="bg-white text-rose-500 border border-rose-100 px-4 py-2 rounded-xl font-bold text-xs hover:bg-rose-50 transition-all"
//                             >
//                               Reject
//                             </button>
//                           </>
//                         ) : (
//                           <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider ${
//                             appt.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
//                           }`}>
//                             {appt.status}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-10 text-slate-400 font-medium">No appointments found yet.</div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200/20 border border-slate-100 h-fit">
//               <div className="mb-8">
//                 <h2 className="text-3xl font-black text-slate-800">Set Availability</h2>
//                 <p className="text-slate-400 text-sm mt-1">Add multiple time ranges for a single day.</p>
//               </div>
              
//               <div className="space-y-8">
//                 <div className="p-6 bg-blue-50/50 rounded-2rem border border-blue-100">
//                   <label className="block text-[10px] font-black text-blue-500 mb-3 uppercase tracking-[0.2em]">Select Target Date</label>
//                   <input 
//                     type="date" 
//                     min={new Date().toISOString().split("T")[0]}
//                     value={selectedDate} 
//                     onChange={(e) => setSelectedDate(e.target.value)} 
//                     className="w-full bg-white border-2 border-blue-100 p-4 rounded-2xl shadow-sm outline-none focus:border-blue-500 font-bold text-slate-700 transition-all" 
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Shift Starts</label>
//                     <input type="time" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700" />
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Shift Ends</label>
//                     <input type="time" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest text-center">Time per Patient</label>
//                   <div className="flex gap-3">
//                     {[15, 30, 60].map((dur) => (
//                       <button 
//                         key={dur} 
//                         onClick={() => setSlotDuration(dur)}
//                         className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${slotDuration === dur ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"}`}
//                       >
//                         {dur}m
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <button 
//                   onClick={saveAvailability} 
//                   disabled={saving}
//                   className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-2"
//                 >
//                   {saving ? "Adding..." : `Add Slot for ${selectedDate}`}
//                 </button>
//               </div>
//             </div>

//             <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
//               <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
//                 Existing Slots on {selectedDate}
//               </h3>
              
//               {existingSlots.length > 0 ? (
//                 <div className="space-y-4">
//                   {existingSlots.map((slot, idx) => (
//                     <div key={idx} className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center group hover:bg-emerald-100 transition-colors">
//                       <div>
//                         <p className="text-emerald-700 font-black text-lg">{slot.from} - {slot.to}</p>
//                         <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{slot.slotDuration} Min Duration</p>
//                       </div>
//                       <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
//                         <span className="text-emerald-600 font-bold text-xs">#{idx + 1}</span>
//                       </div>
//                     </div>
//                   ))}
//                   <p className="text-center text-slate-400 text-xs mt-4 italic">Doctor can add multiple ranges for the same day.</p>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-20 opacity-40">
//                   <span className="text-5xl mb-4">📅</span>
//                   <p className="font-bold text-slate-500">No slots configured yet.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// function DashboardCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
//   const colors: any = {
//     blue: "border-blue-500 text-blue-600 bg-blue-50",
//     amber: "border-amber-500 text-amber-600 bg-amber-50",
//     emerald: "border-emerald-500 text-emerald-600 bg-emerald-50"
//   };

//   return (
//     <div className={`p-6 rounded-2rem border-2 shadow-sm ${colors[color]} border-opacity-20`}>
//       <div className="flex justify-between items-start">
//         <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{title}</span>
//         <span className="text-lg">{icon}</span>
//       </div>
//       <h2 className="text-4xl font-black mt-2 tracking-tighter">{value}</h2>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  slot: string;
  status: "pending" | "accepted" | "rejected";
}

interface TimeSlot {
  from: string;
  to: string;
  slotDuration: number;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "availability">("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0 });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("12:00");
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [existingSlots, setExistingSlots] = useState<TimeSlot[]>([]);

  // Production/Local API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!token || role !== "doctor") {
      router.replace("/login");
      return;
    }

    async function fetchData() {
      try {
        const profileRes = await fetch(`${API_URL}/api/doctor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        
        if (!profileData?.profileCompleted) {
          router.replace("/dashboard/doctor/profile");
          return;
        }

        const apptRes = await fetch(`${API_URL}/api/appointment/doctor-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const apptData = await apptRes.json();
        
        if (apptRes.ok && Array.isArray(apptData)) { 
          setAppointments(apptData);
          updateStats(apptData);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router, token, API_URL]);

  useEffect(() => {
    if (activeTab === "availability" && selectedDate) {
      fetchCurrentDateAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, activeTab]);

  const fetchCurrentDateAvailability = async () => {
    try {
      const res = await fetch(`${API_URL}/api/doctor/availability?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExistingSlots(data?.timeSlots || []);
      }
    } catch (e) { 
        setExistingSlots([]);
    }
  };

  const updateStats = (data: Appointment[]) => {
    const pending = data.filter((a) => a.status === "pending").length;
    const accepted = data.filter((a) => a.status === "accepted").length;
    setStats({ total: data.length, pending, accepted });
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/doctor/availability`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          date: selectedDate,
          from,
          to,
          slotDuration: Number(slotDuration) 
        }),
      });

      if (res.ok) {
        alert("✅ Slot added successfully!");
        fetchCurrentDateAvailability();
      } else {
        const data = await res.json();
        alert(`❌ Error: ${data.message || "Failed to save"}`);
      }
    } catch (err) {
      alert("Connection failed");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: "accepted" | "rejected") => {
    try {
      const res = await fetch(`${API_URL}/api/appointment/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedList = appointments.map((appt) =>
          appt._id === id ? { ...appt, status: newStatus } : appt
        );
        setAppointments(updatedList as Appointment[]);
        updateStats(updatedList as Appointment[]);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white/80 backdrop-blur-md shadow-sm px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">DocPanel<span className="text-blue-600">.</span></h1>
        </div>
        <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="bg-rose-50 text-rose-600 px-4 md:px-5 py-2 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100">
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="inline-flex p-1 bg-gray-200/50 rounded-2xl mb-6 md:mb-10 border border-gray-200">
          <button onClick={() => setActiveTab("overview")} className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${activeTab === "overview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab("availability")} className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${activeTab === "availability" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            My Schedule
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
              <DashboardCard title="Total" value={stats.total} color="blue" icon="📋" />
              <DashboardCard title="Pending" value={stats.pending} color="amber" icon="⏳" />
              <DashboardCard title="Accepted" value={stats.accepted} color="emerald" icon="✅" />
            </div>

            <div className="bg-white rounded-2rem p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                Recent Appointments
                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase">Live</span>
              </h3>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:scale-[1.01] transition-transform gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">👤</div>
                        <div>
                          <p className="font-bold text-slate-700">{appt.patientName}</p>
                          <p className="text-xs text-slate-400 font-medium">{appt.date} • {appt.slot}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {appt.status === "pending" ? (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(appt._id, "accepted")}
                              className="flex-1 md:flex-none bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all shadow-md"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(appt._id, "rejected")}
                              className="flex-1 md:flex-none bg-white text-rose-500 border border-rose-100 px-4 py-2 rounded-xl font-bold text-xs hover:bg-rose-50 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider ${
                            appt.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                            {appt.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 font-medium">No appointments found yet.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200/20 border border-slate-100 h-fit">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800">Set Availability</h2>
                <p className="text-slate-400 text-sm mt-1">Add multiple time ranges for a single day.</p>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="p-4 md:p-6 bg-blue-50/50 rounded-2rem border border-blue-100">
                  <label className="block text-[10px] font-black text-blue-500 mb-3 uppercase tracking-[0.2em]">Select Target Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    className="w-full bg-white border-2 border-blue-100 p-3 md:p-4 rounded-2xl shadow-sm outline-none focus:border-blue-500 font-bold text-slate-700 transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Shift Starts</label>
                    <input type="time" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border-2 border-slate-50 bg-slate-50 p-3 md:p-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Shift Ends</label>
                    <input type="time" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border-2 border-slate-50 bg-slate-50 p-3 md:p-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest text-center">Time per Patient</label>
                  <div className="flex gap-2 md:gap-3">
                    {[15, 30, 60].map((dur) => (
                      <button 
                        key={dur} 
                        onClick={() => setSlotDuration(dur)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${slotDuration === dur ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"}`}
                      >
                        {dur}m
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={saveAvailability} 
                  disabled={saving}
                  className="w-full bg-slate-900 text-white font-black py-4 md:py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-2"
                >
                  {saving ? "Adding..." : `Add Slot for ${selectedDate}`}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                Existing Slots on {selectedDate}
              </h3>
              
              {existingSlots.length > 0 ? (
                <div className="space-y-4">
                  {existingSlots.map((slot, idx) => (
                    <div key={idx} className="p-4 md:p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center group hover:bg-emerald-100 transition-colors">
                      <div>
                        <p className="text-emerald-700 font-black text-base md:text-lg">{slot.from} - {slot.to}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{slot.slotDuration} Min Duration</p>
                      </div>
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <span className="text-emerald-600 font-bold text-xs">#{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-center text-slate-400 text-xs mt-4 italic">Doctor can add multiple ranges for the same day.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 md:py-20 opacity-40">
                  <span className="text-4xl md:text-5xl mb-4">📅</span>
                  <p className="font-bold text-slate-500 text-sm md:text-base">No slots configured yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  const colors: any = {
    blue: "border-blue-500 text-blue-600 bg-blue-50",
    amber: "border-amber-500 text-amber-600 bg-amber-50",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50"
  };

  return (
    <div className={`p-5 md:p-6 rounded-2rem border-2 shadow-sm ${colors[color]} border-opacity-20`}>
      <div className="flex justify-between items-start">
        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black mt-2 tracking-tighter">{value}</h2>
    </div>
  );
}