import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sbAdmin } from '@/libs/sbAdmin';
import { SESSION_COOKIE_NAME } from '@/config/constants';

/**
 * Delete session in db and browser cookie
 * @returns
 */

export async function POST() {
  // get session id
  const sid = cookies().get(SESSION_COOKIE_NAME)?.value;

  // delete session in db session table
  if (sid) {
    await sbAdmin.from('sessions').delete().eq('id', sid);
  }

  // get response
  const res = NextResponse.json({ ok: true });
  // delete session in cookie
  res.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

  return res;
}
