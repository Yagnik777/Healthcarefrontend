// // src/lib/api.ts
// const API_URL = "http://localhost:5000/api";

// export async function apiRequest(
//   endpoint: string,
//   method: string,
//   body?: any,
//   token?: string
// ) {
//   const res = await fetch(`${API_URL}${endpoint}`, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(err);
//   }

//   return res.json();
// }
// src/lib/api.ts

// 🌐 Production અને Local બંને માટે API URL સેટઅપ
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiRequest(
  endpoint: string,
  method: string,
  body?: any,
  token?: string
) {
  // logic માં કોઈ ફેરફાર નથી, ફક્ત API_URL નો ઉપયોગ કર્યો છે
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}