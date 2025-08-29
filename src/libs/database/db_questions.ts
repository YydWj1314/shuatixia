import { Question } from '@/types/Exams'; // 确保这里字段名和可空性与 DB 一致：answer，不是 answerts
import { createClient } from '@/libs/utils/supabase/app_router/server';
import { logCall } from '../utils/logUtils';
import { throwError } from '../utils/errorUtils';
import { QuestionInDetail } from '@/types/Questions';

export async function getQuestionsByBankId(
  bankId: number,
): Promise<Question[]> {
  logCall();

  const sb = await createClient();

  const { data, error } = await sb

    .from('question_bank_questions')
    // 保证一对一关系返回的是单个对象（避免二维数组）
    .select('questions!inner(id, title, content, tags, answer)') //fk inner join
    .eq('question_bank_id', bankId)
    .eq('questions.is_delete', false)
    .order('question_id', { ascending: true })
    // 明确告诉 TS 返回的是 { questions: Question }[]：
    .returns<{ questions: Question }[]>();

  if (error) {
    console.error(error);
    throwError('Query quesions failed');
  }

  // data 形如：[{ questions: {...} }, ...] → 扁平化
  return data.map(({ questions }) => questions);
}

/**
 * Get quesion list
 */
export async function getAllQuestions() {
  logCall();
  const sb = await createClient();

  const { data, error } = await sb
    .from('questions')
    .select('id, title, content, tags, answer')
    .eq('is_delete', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throwError('Query questions failed');
  }

  return data ?? [];
}

export async function getQuestionByQid(questionId: number) {
  // 从数据库取题目
  logCall();
  const sb = await createClient();
  const { data, error } = await sb
    .from('questions')
    .select('id, title, content, answer, tags, updated_at')
    .eq('id', questionId)
    .eq('is_delete', false)
    .maybeSingle<QuestionInDetail>();

  if (error) {
    console.error(error);
    throwError('Query questions failed');
  }

  return data ?? null;
}

/**
 * Get questions by userId
 * @returns
 */

export async function getSavedQuestionsByUserId(userId: number) {
  const sb = await createClient();

  const { data, error } = await sb
    .from('user_question_saved')
    .select(
      `
    question_id, created_at,
    questions!user_question_saved_question_id_fkey (
      id, title, content, tags, answer
    )
  `,
    )
    .eq('user_id', userId)
    .eq('questions.is_delete', false)
    .order('created_at', { ascending: false });

  if (error) throw error;

  /**
 * raw data: [
              { question_id: 1, 
                questions: { id: 101, title: 'A'... } 
              },
              ...
          ];
   */

  return (data ?? []).map((row: any) => row.questions).filter(Boolean);
}
