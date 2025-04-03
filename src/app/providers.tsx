'use client';

import { ReactQueryProvider } from "@/providers/react-query.provider";
import { SessionProvider } from "@/providers/session.provider";
import { ThemeProvider } from "@/providers/theme.provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
