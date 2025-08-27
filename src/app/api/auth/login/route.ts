// backend api
// export const runtime = 'nodejs'; // 确保不是 Edge
// export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  createSession,
  storeSessionInResponse,
} from '@/libs/utils/sessionUtils';
import { sbAdmin } from '@/libs/utils/supabase/sbAdmin';
import { insertSession } from '@/libs/database/db_sessions';
import { logCall } from '@/libs/utils/logUtils';

export async function POST(req: Request) {
  try {
    logCall();
    const { user_account, password } = await req.json();

    if (!user_account || !password) {
      return NextResponse.json({ error: '缺少账号或密码' }, { status: 400 });
    }

    // 用 service role 绕过 RLS 读取密码哈希
    const { data: user, error } = await sbAdmin
      .from('users')
      .select('id, user_password, is_delete')
      .ilike('user_account', user_account) // 不区分大小写匹配
      .maybeSingle();

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json({ error: '服务器查询失败' }, { status: 500 });
    }
    if (!user || user.is_delete) {
      return NextResponse.json(
        { error: '账号不存在或已禁用' },
        { status: 404 },
      );
    }

    // Check password
    const ok = await bcrypt.compare(password, user.user_password);
    // login failed
    if (!ok) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    // Create cookie session(unHashed sid ) and store
    const { sid, expiresAt } = createSession();
    await storeSessionInResponse(sid);

    // Insert session into db
    const { hashedSid } = await insertSession(sbAdmin, sid, user.id, expiresAt);
    console.log('[api/login]hash created:', hashedSid);

    if (!hashedSid) {
      return NextResponse.json({ error: '登录异常' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '登录异常' }, { status: 500 });
  }
}
