import type { SupabaseClient } from '@supabase/supabase-js';
import { throwError } from './utils/errorUtils';
import { createClient } from '@/libs/utils/supabase/app_router/server';
import { sbAdmin } from './sbAdmin';
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
): Promise<{ sid: string; expiresAt: string }> {
  // check parameters
  const sb = await createClient();
  if (!sid || !userId || !expiresAt) {
    throwError('Invalid Paramters');
  }
  // insert session to db
  const { error } = await sbAdmin
    .from('sessions')
    .insert([{ id: sid, user_id: userId, expires_at: expiresAt }]);

  if (error) {
    throwError('Insert Session Failed');
  }
  return { sid, expiresAt };
}

/**
 * Get user id by session id
 * @param sid
 * @returns
 */
export async function getUserIdBySession(sid: string): Promise<number> {
  const sb = await createClient();

  if (!sid) {
    throwError('Sid Missing');
  }

  const { data, error } = await sb
    .from('sessions')
    .select('user_id')
    .eq('id', sid)
    .maybeSingle();

  if (error) {
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
  const { count, error } = await sbAdmin
    .from('sessions')
    .delete({ count: 'exact' })
    .eq('id', sid);

  if (error) {
    throwError('Delete Session Failed');
  }

  return count ?? 0;
}
