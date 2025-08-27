import { Question } from '@/types/Exams'; // 确保这里字段名和可空性与 DB 一致：answer，不是 answerts
import { createClient } from '@/libs/utils/supabase/app_router/server';
import { logCall } from '../utils/logUtils';
import { throwError } from '../utils/errorUtils';
import { QuestionInShowList } from '@/types/Questions';
import { sbAdmin } from '../utils/supabase/sbAdmin';

/**
 * Insert question to  question_save
 * @param userId
 * @param questionId
 * @returns
 */
export async function insertQuestionSaved(userId: number, questionId: number) {
  logCall();
  const { data, error } = await sbAdmin
    .from('user_question_saved')
    .insert([{ user_id: userId, question_id: questionId }])
    .select('id'); // 返回行数组

  if (error) {
    console.error('[libs/db_questions_saved]', error);
    throwError('Insert question saved failed');
  }
  return data?.length ?? 0; // 插入数量
}

export async function getSavebyQuestionId(questionId: number) {
  logCall();
  const sb = await createClient();
}

/**
 * Delete data
 * @param userId
 * @param questionId
 * @returns
 */
export async function cancelQuestionSaved(
  userId: number,
  questionId: number,
): Promise<number> {
  logCall();
  const { count, error } = await sbAdmin
    .from('user_question_saved')
    .delete({ count: 'exact' }) // 返回受影响条数，且不返回行数据
    .eq('user_id', userId)
    .eq('question_id', questionId);

  if (error) {
    console.error('[libs/db_question_saved]', error);
    throwError('Delete db_question_saved failed');
  }
  return count ?? 0;
}

/**
 *
 * @param userId
 * @param questionId
 * @returns
 */
export async function getSavedIdbyUidAndQid(
  userId: number,
  questionId: number,
) {
  logCall();
  // console.log(userId, questionId);
  const sb = await createClient();
  const { data, error } = await sb
    .from('user_question_saved')
    .select('id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  if (error) {
    console.error('[libs/db_question_saved]', error);
    throwError('Query db_question_saved Failed');
  }

  return data?.id ?? null;
}
