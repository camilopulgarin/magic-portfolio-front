"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}