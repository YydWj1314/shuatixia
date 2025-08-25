import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sbAdmin } from '@/libs/sbAdmin';
import { SESSION_COOKIE_NAME } from '@/config/constants';

// {
//   "id": "abc",
//   "expires_at": "2025-08-21T10:00:00.000Z",
//   "user": {
//     "id": 123,
//     "user_account": "alice",
//     "role": "admin"
//   }
// }
type MeRow = {
  expires_at?: string;
  user: {
    id: number;
    user_account: string;
    user_name: string;
    user_role: 'user' | 'admin';
  } | null;
};

export async function GET() {
  const sid = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sid) return NextResponse.json({ ok: false }, { status: 401 });

  const { data, error } = await sbAdmin
    .from('sessions')
    // 关键：嵌套选择 + maybeSingle() 返回“单个对象”，而不是数组
    .select('expires_at, user:users(id, user_account, user_name, user_role)')
    .eq('id', sid)
    // .gt('expires_at', now
    .maybeSingle<MeRow>();

  if (error || !data?.user) {
    console.log('[app/api/me]: ', error);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const u = data.user;

  return NextResponse.json({
    ok: true,
    user: {
      id: u.id,
      account: u.user_account,
      username: u.user_name,
      role: u.user_role,
    },
  });
}
