// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role);

//       if (data.role === "admin") {
//         router.push("/dashboard/admin");
//       } else if (data.role === "doctor") {
//         router.push("/dashboard/doctor");
//       } else {
//         router.push("/dashboard/Patient");
//       }
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6">Login</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mb-4 p-3 border rounded"/>
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mb-6 p-3 border rounded"/>
//         <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">Login</button>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // એરર ક્લિયર કરો
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // --- આ લાઈન્સ ખાસ ચેક કરો ---
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      // જો તમારા બેકએન્ડમાં data.name માં નામ આવતું હોય તો:
      localStorage.setItem("name", data.name); 
      // નોંધ: જો બેકએન્ડમાં નામ 'data.user.name' માં હોય, તો ઉપરની લાઈન બદલીને એ મુજબ લખજો.

      // પેજ રીફ્રેશ કરવાની જરૂર પડી શકે છે જેથી Navbar ડેટા પકડી લે
      if (data.role === "admin") {
        router.push("/dashboard/admin");
      } else if (data.role === "doctor") {
        router.push("/dashboard/doctor");
      } else {
        router.push("/dashboard/Patient");
      }

      // Navbar ને તાત્કાલિક અપડેટ કરવા માટે વિન્ડો રીલોડ પણ કરી શકાય (Optional)
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2rem shadow-xl shadow-blue-100/50 w-full max-w-md border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-800">Welcome Back</h2>
          <p className="text-slate-400 mt-2 font-medium">Login to manage your health</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-500 p-4 rounded-xl mb-6 text-sm font-bold border border-rose-100 animate-shake">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl mt-8 font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
        >
          Sign In
        </button>

        <p className="text-center mt-6 text-slate-400 font-medium text-sm">
          Don't have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => router.push("/register")}>Create one</span>
        </p>
      </form>
    </div>
  );
}