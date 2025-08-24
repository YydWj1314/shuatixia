import { createClient } from '@/libs/utils/supabase/app_router/server';
import { throwError } from './utils/errorUtils';
import { sbAdmin } from './sbAdmin';

/**
 * Get user's favorate banks' data from db by user id
 * @param user_id
 */
export async function getBfIdByUidAndBid(userId: number, bankId: number) {
  const sb = await createClient();
  const { data, error } = await sb
    .from('user_bank_favorites')
    .select('id') // FK searching
    .eq('user_id', userId)
    .eq('bank_id', bankId)
    .maybeSingle();

  if (error) {
    console.log(error);
    console.error('[getBfIdByUidAndBid]', error?.message);
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
  const { data, error } = await sbAdmin
    .from('user_bank_favorites')
    .insert([{ user_id: userId, bank_id: bankId }])
    .select('id')
    .single();

  if (error) {
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
export async function deleteBankFavorites(
  userId: number,
  bankId: number,
): Promise<number> {
  const { count, error } = await sbAdmin
    .from('user_bank_favorites')
    .delete({ count: 'exact' })
    .eq('user_id', userId)
    .eq('bank_id', bankId);

  if (error) {
    throw new Error(`[deleteBankFavorites] Failed: ${error.message}`);
  }

  return count ?? 0;
}
