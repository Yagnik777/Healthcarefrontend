import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <h1>Welcome to Dashboard</h1>
      <p>This is a protected route.</p>
    </div>
  );
}
