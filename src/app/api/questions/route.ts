/**
 * /api/banks/[bankId]/favorites
 * GET POST DELETE
 * 收藏指定题库。
 *
 * - 需要登录（基于 Session Cookie）
 * - 请求体: { bankId: number }
 * - 返回:
 *   - 200: { ok: true, id: number }   // 插入成功
 *   - 400: { ok: false, error: 'Invalid bankId' }
 *   - 401: { ok: false, error: 'Not logged in' }
 *   - 500: { ok: false, error: string }
 */

import { NextResponse } from 'next/server';
import { authSessionInServer } from '@/libs/utils/sessionUtils';
import { getBfIdByUidAndBid } from '@/libs/db_bank_favorites';
import { logCall } from '@/libs/utils/logUtils';

/**
 * Get user_favorite_bank id by useId and bankId
 * @param req
 * @param param1
 * @returns
 */
export async function GET(
  req: Request,
  { params }: { params: { bankId: string } },
) {
  logCall();
  try {
    // Authentication
    const userId = await authSessionInServer();
    // console.log('[/api/banks/[bankId]/favorites]] userId:', userId);

    // Failed response
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: 'Not logged in' },
        { status: 401 },
      );
    }

    // Get bankId from url path
    const bankId = Number(params.bankId);
    const bankIdNum = Number(bankId);
    if (!Number.isFinite(bankIdNum) || bankIdNum <= 0) {
      // console.warn('[/api/banks/[bankId]/favorites]] invalid bankId:', bankId);
      return NextResponse.json(
        { ok: false, error: 'Invalid bankId' },
        { status: 400 },
      );
    }

    // Query id in db
    const favoriteBankId = await getBfIdByUidAndBid(userId, bankId);
    // return response
    return NextResponse.json({ ok: true, isFavorited: favoriteBankId != null });
  } catch (e: any) {
    console.error(e);
    const msg = e?.message ?? 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
