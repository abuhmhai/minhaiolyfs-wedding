'use client';

import { SessionProvider } from 'next-auth/react';

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={true} // Refetch session when window is focused
      refetchWhenOffline={false} // Disable refetching when offline
    >
      {children}
    </SessionProvider>
  );
} 