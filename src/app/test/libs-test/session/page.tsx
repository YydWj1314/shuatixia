// app/test/libs-test/session/page.tsx
import { SESSION_COOKIE_NAME } from '@/config/constants';
import { getUserIdBySession } from '@/libs/database/db_sessions';
import { cookies } from 'next/headers';

// ✅ 这是一个 Server Component
export default async function SessionTestPage() {
  // 测试用的 sid，可以写死，或者从 cookies() / searchParams 拿

  const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? '';
  console.log(sid);

  let result: string;
  try {
    const { userId } = await getUserIdBySession(sid);
    result = `✅ UserId = ${userId}`;
  } catch (e: any) {
    result = `❌ Error: ${e.message}`;
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Session 工具类测试</h2>
      <pre>{result}</pre>
    </div>
  );
}
