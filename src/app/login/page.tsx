"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // પ્રોડક્શનમાં લોડિંગ સ્ટેટ જરૂરી છે
  const router = useRouter();

  // API URL logic
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); 
    
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // LocalStorage Updates
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      if (data.name) {
        localStorage.setItem("name", data.name); 
      }

      // Role based routing
      let targetPath = "/dashboard/Patient";
      if (data.role === "admin") targetPath = "/dashboard/admin";
      else if (data.role === "doctor") targetPath = "/dashboard/doctor";

      router.push(targetPath);

      // Reload setting for Navbar update
      

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Responsive Padding: px-4 (mobile) અને sm:px-0 (desktop)
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] px-4 sm:px-0">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 sm:p-10 rounded-2rem sm:rounded-[2.5rem] shadow-xl shadow-blue-100/50 w-full max-w-md border border-slate-100 transition-all"
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2 font-medium text-sm sm:text-base">Login to manage your health</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-500 p-4 rounded-xl mb-6 text-xs sm:text-sm font-bold border border-rose-100 animate-shake">
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
              className="w-full p-3 sm:p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm sm:text-base"
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
              className="w-full p-3 sm:p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm sm:text-base"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'} text-white py-3 sm:p-4 rounded-2xl mt-8 font-black shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm sm:text-base`}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-center mt-6 text-slate-400 font-medium text-xs sm:text-sm">
          Don't have an account?{" "}
          <span 
            className="text-blue-600 font-bold cursor-pointer hover:underline" 
            onClick={() => router.push("/register")}
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
}