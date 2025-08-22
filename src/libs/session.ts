import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SESSION_MAX_AGE_SEC, SESSION_COOKIE_NAME } from '@/config/constants';

const COOKIE_NAME = SESSION_COOKIE_NAME;
const ALG = 'HS256';

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: number;
};

/**
 * Create session using random db id
 * @param payload  Data
 * @param res  response
 * @returns
 */
export async function StoreSession(sid: string) {
  cookies().set(SESSION_COOKIE_NAME, sid, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SEC,
    path: '/',
  });
}

export interface InsertSessionResult {
  sid: string;
  expiresAt: string; // ISO string
}

/**
 * Insert session into db
 * @param sbAdmin
 * @param userId
 * @returns  id of session table
 */
export async function CreateAndInsertSession(
  sbAdmin: SupabaseClient,
  userId: number,
): Promise<InsertSessionResult> {
  const sid = crypto.randomBytes(32).toString('hex'); //生成一个随机的 session ID（相当于令牌），然后转成 64 位十六进制字符串。
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_SEC * 1000,
  ).toISOString();

  const { error } = await sbAdmin
    .from('sessions')
    .insert([{ id: sid, user_id: userId, expires_at: expiresAt }]); // 传数组更稳

  if (error) {
    throw new Error(`创建会话失败: ${error.message}`);
  }

  return { sid, expiresAt };
}

export async function deleteSession() {}
