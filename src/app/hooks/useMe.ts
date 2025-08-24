// app/hooks/useMe.ts
'use client';
import useSWR from 'swr';

type Me = { id: number; user_account: string; user_role: string } | null;

export function useMe() {
  const { data, isLoading, error, mutate } = useSWR<Me>(
    '/api/auth/me',
    async (u) => {
      const r = await fetch(u, { credentials: 'include' });
      if (!r.ok) return null; // 401 -> 未登录
      return r.json();
    },
    { revalidateOnFocus: false },
  );
  return { me: data, isLoading, error, mutate };
}
