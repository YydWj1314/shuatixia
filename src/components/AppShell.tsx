'use client';

import { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import store from '@/stores';
import BasicLayout from '@/components/GlobalLayout';

export default function AppShell({ children }: { children: React.ReactNode }) {
  // 你原来的 InitLayout 逻辑放这
  const doInit = useCallback(() => {
    console.log('hello 欢迎来到我的项目');
  }, []);

  useEffect(() => {
    doInit();
  }, [doInit]);

  return (
    <Provider store={store}>
      <BasicLayout>{children}</BasicLayout>
    </Provider>
  );
}
