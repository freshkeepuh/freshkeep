'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';

interface Props {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        storageKey="fk-theme"
        defaultTheme="system"
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
