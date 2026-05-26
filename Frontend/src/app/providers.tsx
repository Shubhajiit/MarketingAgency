'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { GoogleOAuthProvider } from '@react-oauth/google';

/**
 * Calls checkAuth exactly once when the app first mounts.
 * Using a ref guard ensures it doesn't re-fire in React StrictMode
 * (which double-invokes effects in development) or if this component
 * somehow re-renders.
 */
function AuthHydration({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth();
  const didCheck = useRef(false);

  useEffect(() => {
    if (!didCheck.current) {
      didCheck.current = true;
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy_client_id'}>
      <QueryClientProvider client={queryClient}>
        <AuthHydration>{children}</AuthHydration>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
