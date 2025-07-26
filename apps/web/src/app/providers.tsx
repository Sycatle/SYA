"use client";
import { ThemeProvider } from "@hooks/use-theme";
import { LanguageProvider } from "@hooks/use-language";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  );
}
