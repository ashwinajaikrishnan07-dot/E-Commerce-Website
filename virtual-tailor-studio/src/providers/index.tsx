"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "./query-provider";

// ============================================================
// APP PROVIDERS
// Composes all providers in the correct order.
// Add authentication, theme, or other providers here.
// ============================================================

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
