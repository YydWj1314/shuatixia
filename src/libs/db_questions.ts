import { Question } from '@/types/Exam'; // 确保这里字段名和可空性与 DB 一致：answer，不是 answerts
import { createClient } from '@/libs/utils/supabase/app_router/server';

export async function getQuestionsByBankId(
  bankId: number,
): Promise<Question[]> {
  const sb = await createClient();

  const { data, error } = await sb
    .from('question_bank_questions')
    // 保证一对一关系返回的是单个对象（避免二维数组）
    .select('questions!inner(id, title, content, tags, answer)')
    .eq('question_bank_id', bankId)
    .order('question_id', { ascending: true })
    // 明确告诉 TS 返回的是 { questions: Question }[]：
    .returns<{ questions: Question }[]>();

  if (error) throw error;

  // data 形如：[{ questions: {...} }, ...] → 扁平化
  return data.map(({ questions }) => questions);
}
