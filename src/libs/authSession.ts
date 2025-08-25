// libs/authSession.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserIdBySession } from '@/libs/db_session';
import { SESSION_COOKIE_NAME } from '@/config/constants';
import { throwError } from './utils/errorUtils';

// For server
export async function authSessionInServer(): Promise<number> {
  const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!sid) {
    throw new Error('Not logged in');
  }
  const userId = await getUserIdBySession(sid);
  if (!userId) {
    throwError('Not logged in');
  }
  return userId;
}

// For router
export async function authSessionInRouter() {
  const sid = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!sid) {
    return NextResponse.json(
      { ok: false, error: 'Not logged in' },
      { status: 401 },
    );
  }
  const userId = await getUserIdBySession(sid);
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: 'Not logged in' },
      { status: 401 },
    );
  }
  return userId;
}
