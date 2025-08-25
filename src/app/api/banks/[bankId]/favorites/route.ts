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
import { cookies } from 'next/headers';
import {
  insertBankFavorites,
  deleteBankFavorites,
  getBfIdByUidAndBid,
} from '@/libs/db_bank_favorites';
import { getUserIdBySession } from '@/libs/db_session';
import { SESSION_COOKIE_NAME } from '@/config/constants';

/**
 * POST:
 * Receive request and call insert insertBankFavorites api
 * then return response
 * @param req
 * @returns
 */
export async function POST(
  req: Request,
  { params }: { params: { bankId: string } },
) {
  console.log('=====[POST /api/banks/[bankId]/favorites] entered =====');
  try {
    // Get bankId from url path
    const bankId = Number(params.bankId);
    // console.log('[/api/banks/[bankId]/favorites]] bankId:', bankId);

    const bankIdNum = Number(bankId);
    if (!Number.isFinite(bankIdNum) || bankIdNum <= 0) {
      // console.warn('[/api/banks/[bankId]/favorites]] invalid bankId:', bankId);
      return NextResponse.json(
        { ok: false, error: 'Invalid bankId' },
        { status: 400 },
      );
    }

    const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
    // console.log('[/api/banks/[bankId]/favorites]] sid exists?', !!sid);
    if (!sid) {
      return NextResponse.json(
        { ok: false, error: 'Not logged in' },
        { status: 401 },
      );
    }

    // Get userId
    const userId = await getUserIdBySession(sid);
    // console.log('[/api/banks/[bankId]/favorites]] userId:', userId);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: 'Not logged in' },
        { status: 401 },
      );
    }

    // DB Operation: Insert data
    const res = await insertBankFavorites(userId, bankIdNum);
    // console.log('[/api/banks/[bankId]/favorites]] inserted id:', id);

    // Return reponse
    return NextResponse.json({ ok: true, res });
  } catch (e: any) {
    console.error('[/api/banks/[bankId]/favorites][POST]: ', e);
    const msg = e?.message ?? 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/**
 * DELETE
 * @param req
 * @returns
 */
export async function DELETE(
  req: Request,
  { params }: { params: { bankId: string } },
) {
  console.log('=====[DELETE /api/banks/[bankId]/favorites] entered =====');
  try {
    //authentication
    const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!sid) {
      return NextResponse.json(
        { ok: false, error: 'Not logged in' },
        { status: 401 },
      );
    }

    // Query userId from db
    const userId = await getUserIdBySession(sid);
    // console.log('[/api/banks/[bankId]/favorites]] userId:', userId);
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

    // delete data in db bank_favorites
    const affected = await deleteBankFavorites(userId, bankId);
    // return response
    return NextResponse.json({ ok: true, affected });
  } catch (e: any) {
    console.error('[/api/banks/[bankId]/favorites] error:', e);
    const msg = e?.message ?? 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

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
  console.log('=====[GET /api/banks/[bankId]/favorites] entered =====');
  try {
    // Authentication
    const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!sid) {
      return NextResponse.json(
        { ok: false, error: 'Not logged in' },
        { status: 401 },
      );
    }

    // Query userId from db
    const userId = await getUserIdBySession(sid);
    // console.log('[/api/banks/[bankId]/favorites]] userId:', userId);
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
    console.error('[/api/banks/[bankId]/favorites] error:', e);
    const msg = e?.message ?? 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
