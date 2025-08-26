import { createClient } from './utils/supabase/app_router/server';
import { throwError } from '@/libs/utils/errorUtils';
import type { UserGetById } from '@/types/User';
import { logCall } from './utils/logUtils';

export async function getUserById(
  userId: number | string,
): Promise<UserGetById | null> {
  const sb = await createClient();
  // console.log('===== [db_user]: getUserById is called =====');
  // console.log('[getUserById] userId=', userId, 'typeof=', typeof userId);
  logCall();
  const { data, error } = await sb
    .from('users')
    .select('id, user_account, user_name, user_avatar, user_profile, user_role')
    .eq('id', userId)
    .eq('is_delete', false)
    .maybeSingle<UserGetById>();

  if (error) {
    console.error(error);
    throwError('Query user failed');
  }
  // console.log('[db_user] data: ', data);
  return data ?? null;
}
