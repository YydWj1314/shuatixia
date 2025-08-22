// backend api
export const runtime = 'nodejs'; // 确保不是 Edge
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { CreateAndInsertSession, StoreSession } from '@/libs/session';

import { sbAdmin } from '@/libs/sbAdmin';

export async function POST(req: Request) {
  try {
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
      console.error('Supabase query error:', error);
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
    if (!ok) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    // 登录成功：创建会话 Cookie
    const res = NextResponse.json({ ok: true });
    // session 插入 db 获取 id
    const { sid } = await CreateAndInsertSession(sbAdmin, user.id);
    await StoreSession(sid); // 在响应里设置 HttpOnly cookie

    // TODO inserSession

    return res;
  } catch (e) {
    console.error('LOGIN_ERROR:', e);
    return NextResponse.json({ error: '登录异常' }, { status: 500 });
  }
}
