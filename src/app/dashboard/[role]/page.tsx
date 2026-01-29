"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DashboardRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleParam = params?.role;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== roleParam) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [roleParam, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-gray-500 text-lg">Loading...</p></div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome {typeof roleParam === "string" ? roleParam.charAt(0).toUpperCase() + roleParam.slice(1) : ""} Dashboard</h1>
      <p className="text-gray-700 mb-6">This is a protected route for {roleParam} users only.</p>
      <button
        className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
