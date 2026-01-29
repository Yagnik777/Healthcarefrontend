// src/lib/api.ts
const API_URL = "http://localhost:5000/api";

export async function apiRequest(
  endpoint: string,
  method: string,
  body?: any,
  token?: string
) {
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
