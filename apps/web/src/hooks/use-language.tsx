"use client";

import React from "react";
import english from "@web/languages/english.json";
import french from "@web/languages/french.json";

export type Locale = "en" | "fr";

const translations = { en: english, fr: french } as const;

type LanguageContextProps = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = React.createContext<LanguageContextProps | null>(null);

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

const STORAGE_KEY = "locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>("en");

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "fr") {
      setLocale(stored);
      document.documentElement.lang = stored;
    } else {
      document.documentElement.lang = "en";
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = React.useCallback(
    (key: string) => {
      const parts = key.split(".");
      let result: unknown = translations[locale];
      for (const p of parts) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result = (result as any)?.[p];
        if (result === undefined) break;
      }
      return typeof result === "string" ? result : key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
