"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}