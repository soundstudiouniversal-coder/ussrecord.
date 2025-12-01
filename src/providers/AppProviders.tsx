
"use client";

import { type ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { AdminProvider } from './AdminProvider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <FirebaseClientProvider>
        <AdminProvider>
            {children}
        </AdminProvider>
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
