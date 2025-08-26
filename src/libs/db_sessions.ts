import type { SupabaseClient } from '@supabase/supabase-js';
import { throwError } from './utils/errorUtils';
import { createClient } from '@/libs/utils/supabase/app_router/server';
import { sbAdmin } from './sbAdmin';
import { hashSession } from './utils/sessionUtils';
import { logCall } from './utils/logUtils';
/**
 * Insert session into db
 * @param sbAdmin
 * @param sid
 * @param userId
 * @param expiresAt
 * @returns true: insert successfully
 */
export async function insertSession(
  sbAdmin: SupabaseClient,
  sid: string,
  userId: number,
  expiresAt: string,
): Promise<{ hashedSid: string; expiresAt: string }> {
  logCall();
  // check parameters
  if (!sid || !userId || !expiresAt) {
    throwError('Invalid Paramters');
  }

  // Hash session id
  const hashedSid = hashSession(sid);
  console.log('[libs/db_session] hash created:', hashedSid);

  // insert session to db
  const { error } = await sbAdmin
    .from('sessions')
    .insert([
      { hashed_sid: hashedSid, user_id: userId, expires_at: expiresAt },
    ]);

  if (error) {
    console.error(error);
    throwError('Insert Session Failed');
  }
  return { hashedSid, expiresAt };
}

/**
 * Get user id by session id
 * @param hahsedSid
 * @returns
 */
export async function getUserIdBySession(hashedSid: string): Promise<number> {
  logCall();
  const sb = await createClient();

  if (!hashedSid) {
    throwError('Sid Missing');
  }
  // console.log('[libs/db_sesison] hashedSid created:', hashedSid);
  const { data, error } = await sb
    .from('sessions')
    .select('user_id')
    .eq('hashed_sid', hashedSid)
    .gt('expires_at', new Date().toISOString()) // not expired
    .maybeSingle();

  if (error) {
    console.error(error);
    throwError('Query Session Failed');
  }

  if (!data) {
    throwError('Session Not Found');
  }

  return Number(data.user_id);
}

/**
 * Delete session
 * @param sid
 * @returns number of data deleted
 */
export async function deleteSessionBySid(sid: string): Promise<number> {
  logCall();
  if (!sid) {
    throwError('Sid Missing');
  }

  const hashedSid = hashSession(sid);

  const { count, error } = await sbAdmin
    .from('sessions')
    .delete({ count: 'exact' })
    .eq('hashed_sid', hashedSid);

  if (error) {
    console.error(error);
    throwError('Delete Session Failed');
  }

  return count ?? 0;
}
