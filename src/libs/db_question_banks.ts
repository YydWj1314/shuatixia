/**
 * Data Access Layer (DAL) — Query methods for the `question_banks` table.
 *
 * This module provides reusable functions to query question bank data
 * from Supabase. All methods return typed results (`Bank`) and only include
 * records where `is_delete = false`.
 *
 * Available functions:
 * - getAllBanks(limit = 12): Promise<Bank[]>
 *   Fetch a list of question banks, ordered by creation time (descending).
 *   Limited by the given number of items.
 *
 * - getBankById(id: number | string): Promise<Bank | null>
 *   Fetch a single question bank by its ID. Returns null if not found.
 *
 * - getBanksByTopic(topic: string, limit = 20): Promise<Bank[]>
 *   Fetch a list of question banks by a specific topic, ordered by creation time (descending).
 *
 * Return conventions:
 * - On success, returns an array of Bank objects or a single Bank.
 * - On failure, throws a Supabase error (caller should handle exceptions).
 *
 * Notes:
 * - All queries automatically exclude deleted items (`is_delete = false`).
 * - Returned fields include id, title, topic, description, picture,
 *   user_id, created_at, updated_at, and edited_at.
 */

import { createClient } from '@/libs/utils/supabase/app_router/server';
import { Bank } from '@/types/Banks';

/**
 *
 * @param limit
 * @returns
 */
export async function getAllBanks(limit = 12): Promise<Bank[]> {
  const sb = await createClient();
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
  const sb = await createClient();
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
  const sb = await createClient();
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
