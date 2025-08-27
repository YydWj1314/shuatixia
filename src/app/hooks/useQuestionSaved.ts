'use client';
import useSWR from 'swr';
import { useMe } from './useMe';

type SavResp = { ok: boolean; isSaved: boolean };

export function useQuestionSaved(questionId: number) {
  console.log('======== useQuestionSaved  entered ========');
  // console.log('[hooks/useQuestionSaved]:', questionId);
  const { me } = useMe();
  const uid = me?.id ?? 'anon';

  const url = Number.isFinite(questionId)
    ? `/api/questions/${questionId}/save`
    : null;

  // console.log('[hooks/useQuestionSaved] url:', url);

  // GET request by global swr provider
  const { data, mutate, isLoading, isValidating, error } = useSWR<SavResp>(
    url ? [url, uid] : null, // 需要全局 fetcher 支持元组 key
    { revalidateOnFocus: false }, // 可选
  );
  console.log('[hooks/useQuestionSaved] data:', data);

  async function toggleSave() {
    if (!url) return;
    if (!me) throw new Error('Not Logged In');

    const next = !data?.isSaved;

    await mutate(
      async () => {
        const res = await fetch(url, {
          method: next ? 'POST' : 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Operation Failed');
        return { ok: true, isSaved: next };
      },
      {
        optimisticData: { ok: true, isSaved: next },
        rollbackOnError: true,
        revalidate: false,
      },
    );

    await mutate(); // 再 GET 一次，校准服务端状态
  }

  return {
    isSaved: !!data?.isSaved,
    isLoading,
    isValidating,
    error,
    toggleSave,
    refresh: () => mutate(),
  };
}
