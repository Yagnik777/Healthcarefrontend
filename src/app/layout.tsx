"use client";

import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
