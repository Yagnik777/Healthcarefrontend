"use client";

import { useEffect, useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"; // Dashboard આઇકોન ઉમેર્યો
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // પાથ ચેક કરવા માટે

  // ડેટા લોડ કરવાનું ફંક્શન
  const loadUser = () => {
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && name) {
      setUser({ name, role: role || "" });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    // જ્યારે લોકલ સ્ટોરેજમાં ફેરફાર થાય ત્યારે અપડેટ કરવા માટે
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [pathname]); // pathname બદલાય ત્યારે પણ ચેક કરશે

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-50 border-b border-slate-100">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-black text-blue-600 cursor-pointer tracking-tighter" onClick={() => router.push("/")}>
          HealthCare<span className="text-slate-800">+</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 font-semibold text-slate-600">
            {["Home", "Services", "Doctors", "Contact"].map((link) => (
              <li key={link} className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => router.push("/" + link.toLowerCase())}>
                {link}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-5 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100">
                {/* ડેશબોર્ડ બટન */}
                <button 
                  onClick={() => router.push(`/dashboard/${user.role}`)}
                  className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all shadow-md"
                  title="Go to Dashboard"
                >
                  <LayoutDashboard size={18} />
                </button>

                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest">Logged in as</span>
                  <span className="text-sm font-bold text-slate-800">
                    {user.role === "doctor" ? `Dr. ${user.name}` : user.name}
                  </span>
                </div>

                <button onClick={handleLogout} className="text-rose-500 hover:text-rose-700 transition-colors p-1" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button className="text-slate-600 font-bold px-4 py-2 hover:text-blue-600 transition" onClick={() => router.push("/login")}>Login</button>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition" onClick={() => router.push("/register")}>Register</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden cursor-pointer text-slate-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </nav>

      {/* Mobile Menu (Same Logic) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-6 flex flex-col gap-4">
          {user && (
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Welcome</p>
              <p className="text-lg font-bold text-slate-800">{user.role === "doctor" ? `Dr. ${user.name}` : user.name}</p>
            </div>
          )}
          {/* ... regular links ... */}
          <button onClick={user ? handleLogout : () => router.push("/login")} className={`w-full py-3 rounded-xl font-bold ${user ? 'bg-rose-50 text-rose-600' : 'bg-blue-600 text-white'}`}>
            {user ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </header>
  );
}