// app/providers/SWRProvider.tsx
'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';
import { globalFetcher } from './fetcher';

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: globalFetcher, // default GET
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
