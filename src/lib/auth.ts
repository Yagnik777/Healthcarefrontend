// export const setToken = (token: string) => {
//     localStorage.setItem("token", token);
//   };
  
//   export const getToken = () => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("token");
//   };
  
//   export const logout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };
  
  // Token helper functions for Local + Production

export const setToken = (token: string) => {
  // 🛡️ SSR check: ખાતરી કરો કે વિન્ડો અસ્તિત્વમાં છે
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const getToken = () => {
  // 🛡️ SSR check: Next.js સર્વર સાઇડ પર લોકલ સ્ટોરેજ નથી હોતું
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    // 🚀 Production ready redirect
    window.location.href = "/login";
  }
};