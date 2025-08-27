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
