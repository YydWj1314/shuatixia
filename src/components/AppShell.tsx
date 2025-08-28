'use client';

import { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import BasicLayout from '@/components/GlobalLayout';
import { usePathname, useRouter } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  // 你原来的 InitLayout 逻辑放这
  const doInit = useCallback(() => {
    console.log('hello 欢迎来到我的项目');
  }, []);

  // useEffect(() => {
  //   doInit();
  // }, [doInit]);

  const pathname = usePathname();
  const router = useRouter();
  // Refresh page when path change
  useEffect(() => {
    router.refresh();
  }, [pathname]);

  return <BasicLayout>{children}</BasicLayout>;
}
