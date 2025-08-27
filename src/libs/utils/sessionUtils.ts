import { cookies } from 'next/headers';
import crypto from 'crypto';
import { SESSION_MAX_AGE_SEC, SESSION_COOKIE_NAME } from '@/config/constants';
import { NextResponse } from 'next/server';
import { getUserIdBySession } from '@/libs/database/db_sessions';
import { throwError } from './errorUtils';

interface InsertSessionResult {
  sid: string;
  expiresAt: string; // ISO string
}

/**
 * Create seesion with cypto
 * @param sbAdmin
 * @param userId
 * @returns  sid: string, ID of session in 32bits hexidecimal string
 *           expirsAt: string,  representing timestamps
 */
export function createSession(): InsertSessionResult {
  const sid = crypto.randomBytes(32).toString('hex'); //生成一个随机的 session ID（相当于令牌），然后转成 64 位十六进制字符串。
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_SEC * 1000,
  ).toISOString();
  return { sid, expiresAt };
}

/**
 * Store session into response
 * @param sid
 */
export async function storeSessionInResponse(sid: string) {
  cookies().set(SESSION_COOKIE_NAME, sid, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SEC,
    path: '/',
  });
}

/**
 * Convert session id to hashed session id
 * @param input unhansed session id
 * @returns hashed session id
 */
export function hashSession(input: string): string {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Athenticate user by session id
 * @returns
 */
export async function authSessionInServer(): Promise<number | null> {
  const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!sid) {
    return null; // 未登录返回null
  }
  const hashedSid = hashSession(sid);

  const userId = await getUserIdBySession(hashedSid);

  return userId ?? null;
}
