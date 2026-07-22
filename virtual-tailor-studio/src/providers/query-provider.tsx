"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

// ============================================================
// REACT QUERY PROVIDER
// Wraps the application with TanStack Query for server state.
// Configured with sensible defaults for a 3D application.
// ============================================================

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
            retry: 2,
            refetchOnWindowFocus: false, // Avoid refetch during 3D interaction
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
