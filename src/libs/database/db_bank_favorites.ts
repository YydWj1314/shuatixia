import { createClient } from '@/libs/utils/supabase/app_router/server';
import { throwError } from '../utils/errorUtils';
import { sbAdmin } from '../utils/supabase/sbAdmin';
import { logCall } from '../utils/logUtils';

/**
 * Get all banks data by bank_favoirtes id 
 * @param userId 
 * @returns 
 * [
    {
      "id": 5,
      "title": "算法与数据结构",
      "topic": "Computer Fundamentals",
      "description": "常见数据结构与算法",
      "picture": null,
      "is_delete": false,
      "user_bank_favorites": {}
    },{},{} ...
  ]
 */
export async function getBankFavoritesByUid(userId: number) {
  logCall();
  const sb = await createClient();
  const { data, error } = await sb
    .from('user_bank_favorites')
    .select(
      `bank_id,
        question_banks!user_bank_favorites_bank_id_fkey(
          id, title, topic, description
        )
      `,
    )
    .eq('question_banks.is_delete', false) // 只要未删除
    .eq('user_id', userId) // 过滤用户
    .order('created_at', {
      ascending: false,
    });

  // only need banks data
  if (error) {
    console.error('[libs/db_bank_favorites]', error);
    throwError('Query db user_bank_favorites Failed');
  }

  /**
  data: [
          {
            "bank_id": 123,                     
            "question_banks": {                            
              "id": 9,
              "titile": "xxx",                     
              "topic": "……",
              "dexcription": "……"               
            },
            ...
        ]
   */
  const banks = (data ?? [])
    .map((row: any) => row.question_banks)
    .filter(Boolean);

  return banks;
}

/**
 * Get user's favorate banks' data from db by user id
 * @param user_id
 * @param bank_id
 */
export async function getBfIdByUidAndBid(userId: number, bankId: number) {
  logCall();
  const sb = await createClient();
  const { data, error } = await sb
    .from('user_bank_favorites')
    .select('id') // FK searching
    .eq('user_id', userId)
    .eq('bank_id', bankId)
    .maybeSingle();

  if (error) {
    console.error('[libs/db_bank_favorites]', error);
    throwError('Query db user_bank_favorites Failed');
  }

  return data?.id ?? null;
}

/**
 * Insert data into user_bank_favorates
 * @param userId
 * @param bankId
 * @returns
 */
export async function insertBankFavorites(userId: number, bankId: number) {
  logCall();
  const { data, error } = await sbAdmin
    .from('user_bank_favorites')
    .insert([{ user_id: userId, bank_id: bankId }])
    .select('id')
    .single();

  if (error) {
    console.error('[libs/db_bank_favorites]', error);
    throwError('Insert user_bank_favorates Failed');
  }

  return Number(data.id);
}

/**
 * Delete data in bank_favorites by userId and bankId
 * @param userId
 * @param bankId
 * @returns
 */
export async function cancelBankFavorites(
  userId: number,
  bankId: number,
): Promise<number> {
  logCall();
  const { count, error } = await sbAdmin
    .from('user_bank_favorites')
    .delete({ count: 'exact' })
    .eq('user_id', userId)
    .eq('bank_id', bankId);

  if (error) {
    console.error('[libs/db_bank_favorites]', error);
    throwError('Delete user_bank_favorates Failed');
  }

  return count ?? 0;
}

/**
 * Batch delete user favorite banks
 * @param userId
 * @param bankIds
 * @returns
 */
export async function batchDeleteBankFavorites(
  userId: number,
  bankIds: number[],
): Promise<number> {
  logCall();
  // console.log('userId, bankId:', userId, bankIds);
  const { count, error } = await sbAdmin
    .from('user_bank_favorites')
    .delete({ count: 'exact' })
    .eq('user_id', userId)
    .in('bank_id', bankIds);

  if (error) {
    console.error('[libs/db_bank_favorites]', error);
    throwError('Delete Favorates Failed');
  }

  return count ?? 0;
}
