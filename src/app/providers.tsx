'use client';

import { ReactQueryProvider } from "@/providers/react-query.provider";
import { ThemeProvider } from "@/providers/theme.provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ThemeProvider>

  );
}