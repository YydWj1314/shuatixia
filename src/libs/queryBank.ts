import { createClient } from '@supabase/supabase-js';
import { Bank } from '@/types/Banks';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

/**
 *
 * @param limit
 * @returns
 */
export async function getAllBanks(limit = 12): Promise<Bank[]> {
  const { data, error } = await sb
    .from('question_banks')
    .select(
      'id, title, topic,  description, picture, user_id, created_at, updated_at, edited_at, is_delete',
    )
    .eq('is_delete', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 *
 * @param id
 * @returns
 */
export async function getBankById(id: number | string) {
  const { data, error } = await sb
    .from('question_banks')
    .select(
      'id, title,  topic, description, picture, user_id, created_at, updated_at, edited_at, is_delete',
    )
    .eq('is_delete', false)
    .eq('id', id)
    .maybeSingle(); // return only one item

  if (error) throw error;
  return data as Bank | null;
}

/**
 *
 * @param topic
 * @param limit
 * @returns
 */
export async function getBanksByTopic(
  topic: string,
  limit = 20,
): Promise<Bank[]> {
  const { data, error } = await sb
    .from('question_banks')
    .select(
      'id, title, topic, description, picture, user_id, created_at, updated_at, edited_at, is_delete',
    )
    .eq('is_delete', false)
    .eq('topic', topic)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
