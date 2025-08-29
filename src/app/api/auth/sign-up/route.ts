import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { addUser, getUidByEmail, getUserById } from '@/libs/database/db_user';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, username, password, confirm } = body || {};

  // 基础校验
  if (!email || !username || !password || !confirm) {
    return NextResponse.json(
      { ok: false, error: 'Missing necessary fields' },
      { status: 400 },
    );
  }
  if (password !== confirm) {
    return NextResponse.json({ ok: false, error: '' }, { status: 400 });
  }

  // email 格式校验（前端已有校验，这里兜底）
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json(
      { ok: false, error: 'Invalid email format' },
      { status: 400 },
    );
  }

  // email唯一性检查
  const userId = await getUidByEmail(email);
  if (userId) {
    return NextResponse.json(
      { ok: false, error: 'Email has been registered' },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const affected = addUser(email, username, hashedPassword);

  // 为了最小可运行，直接返回 ok
  return NextResponse.json({ ok: true, affected });
}
