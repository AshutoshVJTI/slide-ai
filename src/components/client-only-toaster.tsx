'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export function ClientOnlyToaster() {
  // Only render the toaster on the client side to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Toaster
      richColors
      closeButton
      position="top-center"
      toastOptions={{
        style: {
          fontSize: '14px',
        },
      }}
    />
  );
} 