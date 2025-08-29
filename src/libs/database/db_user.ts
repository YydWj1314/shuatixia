import { createClient } from '../utils/supabase/app_router/server';
import { throwError } from '@/libs/utils/errorUtils';
import type { UserGetById } from '@/types/Users';
import { logCall } from '../utils/logUtils';
import { sbAdmin } from '../utils/supabase/sbAdmin';

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

/**
 * Get usr id by email
 * @param email
 * @returns
 */
export async function getUidByEmail(email: string): Promise<number | null> {
  const sb = await createClient();
  const { data, error } = await sb
    .from('users')
    .select('id')
    .eq('user_account', email)
    .maybeSingle<{ id: number }>();

  if (error) {
    console.error('[getUidByEmail] DB query failed:', error);
    return null;
  }

  return data ? data.id : null; // 查到返回 id，没查到返回 null
}
/**
 * Add new user
 * @param email
 * @param username
 * @param hashedPassword
 * @returns
 */
// libs/db_user.ts

// Postgres 唯一约束冲突错误码
const PG_UNIQUE_VIOLATION = '23505';

export async function addUser(
  email: string,
  username: string,
  hashedPassword: string,
): Promise<number> {
  // 标准化 email
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await sbAdmin
    .from('users')
    .insert([
      {
        // 按你现有表结构对齐字段名
        user_account: normalizedEmail, // 你用它做登录账号
        user_name: username, // 别写成 username
        user_password: hashedPassword, // 别写成 userpassord
        user_role: 'user',
        is_delete: false,
      },
    ])
    .select('id')
    .single(); // 只返回一条记录 { id: number }

  if (error) {
    // 唯一约束（邮箱重复）友好提示
    // 注意：如果唯一约束建在 user_account 或 email 上，这里都会触发 23505
    // @ts-ignore — Supabase error 里一般有 code
    if (error.code === PG_UNIQUE_VIOLATION) {
      // 让上层决定返回 409
      throw new Error('E_DUPLICATE_EMAIL');
    }
    console.error('[addUser] insert failed:', error);
    throw new Error('E_ADD_USER_FAILED');
  }

  if (!data?.id) {
    throw new Error('E_ADD_USER_NO_ID');
  }

  return data.id;
}
