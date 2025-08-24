import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/config/constants';
import { getUserIdBySession } from '@/libs/db_session';
import { getFavoriteBanksByUserId } from '@/libs/db_bank_favorites';

export async function GET() {
  // 1) 取 session cookie
  const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? '';
  if (!sid) {
    return NextResponse.json({ error: 'Unauthorized User' }, { status: 401 });
  }

  try {
    // 2) 根据 sid -> userId
    const userId = await getUserIdBySession(sid);
    //TODO
    console.log('[test/favorites]:', userId);

    // 3) 查收藏题库
    const favoriteBanks = await getFavoriteBanksByUserId(userId);
    //TODO
    console.log('[test/favorites]:', favoriteBanks);

    // 4) 返回 JSON
    return NextResponse.json({
      ok: true,
      count: favoriteBanks.length,
      data: favoriteBanks,
    });
  } catch (e: any) {
    console.error('【/api/favorites】', e?.message, e?.stack);
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server Error' },
      { status: 500 },
    );
  }
}
