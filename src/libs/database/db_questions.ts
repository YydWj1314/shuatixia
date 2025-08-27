import { Question } from '@/types/Exams'; // 确保这里字段名和可空性与 DB 一致：answer，不是 answerts
import { createClient } from '@/libs/utils/supabase/app_router/server';
import { logCall } from '../utils/logUtils';
import { throwError } from '../utils/errorUtils';
import { QuestionForList } from '@/types/Questions';

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
    .select('title, content, tags, answer')
    .eq('is_delete', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throwError('Query quesions failed');
  }

  return data as QuestionForList[];
}
