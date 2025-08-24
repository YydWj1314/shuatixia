// app/providers/SWRProvider.tsx
'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          const res = await fetch(url, { credentials: 'include' });
          if (!res.ok) throw new Error('network');
          return res.json();
        },
        revalidateOnMount: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 1500,
      }}
    >
      {children}
    </SWRConfig>
  );
}
