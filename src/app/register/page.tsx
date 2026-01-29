"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-100/50 w-full max-w-lg border border-slate-100 animate-in fade-in zoom-in duration-500"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-slate-400 mt-2 font-medium">Join our healthcare community today.</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-100 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.15em] ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.15em] ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.15em] ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.15em] ml-1">I am a...</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as any)} 
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-5 rounded-2xl mt-10 font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
        >
          Create Free Account
        </button>

        <p className="text-center mt-8 text-slate-400 font-medium text-sm">
          Already have an account?{" "}
          <span 
            className="text-blue-600 font-bold cursor-pointer hover:underline" 
            onClick={() => router.push("/login")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}