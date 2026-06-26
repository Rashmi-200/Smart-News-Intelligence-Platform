"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a new QueryClient per browser session — prevents shared state across
  // users in SSR, and ensures a fresh client on hot-reload during dev.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 60 seconds before a background refetch
            staleTime: 60_000,
            // Only retry once on failure (avoids hammering a down backend)
            retry: 1,
            // Show cached data while refetching in the background
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
